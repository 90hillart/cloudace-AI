import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("Quiz engine server configuration is incomplete.");
      return json({ error: "Quiz service is not configured." }, 500);
    }

    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return json({ error: "Please sign in to continue." }, 401);
    }

    const token = authorization.slice("Bearer ".length);

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return json({ error: "Your session is invalid. Please sign in again." }, 401);
    }

    // This client is server-only. Never put its key in VITE_* variables.
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const body = await req.json();

    if (body.action === "start") {
      const topicId =
        typeof body.topic_id === "string" ? body.topic_id : null;
      const difficulty =
        typeof body.difficulty === "string" ? body.difficulty : null;
      const requestedCount = Number(body.count ?? 10);

      if (
        !Number.isInteger(requestedCount) ||
        requestedCount < 1 ||
        requestedCount > 50
      ) {
        return json({ error: "Choose between 1 and 50 questions." }, 400);
      }

      if (
        difficulty &&
        !["beginner", "intermediate", "advanced"].includes(difficulty)
      ) {
        return json({ error: "Choose a valid difficulty." }, 400);
      }

      let query = admin
        .from("questions")
        .select(
          "id, topic_id, prompt, options, difficulty, objective_code"
        )
        .eq("active", true);

      if (topicId) query = query.eq("topic_id", topicId);
      if (difficulty) query = query.eq("difficulty", difficulty);

      const { data: candidateQuestions, error: questionError } =
        await query.limit(200);

      if (questionError) {
        console.error("Question selection failed.");
        return json({ error: "Could not load practice questions." }, 500);
      }

      if (!candidateQuestions?.length) {
        return json({
          error: "No questions match those settings yet. Try another topic or difficulty.",
        }, 404);
      }

      // Only choose questions with answer keys. Never return the keys.
      const candidateIds = candidateQuestions.map((q) => q.id);

      const { data: keyedQuestions, error: keysError } = await admin
        .from("question_keys")
        .select("question_id")
        .in("question_id", candidateIds);

      if (keysError) {
        console.error("Question availability check failed.");
        return json({ error: "Could not prepare the quiz." }, 500);
      }

      const availableIds = new Set(
        (keyedQuestions ?? []).map((item) => item.question_id)
      );

      const eligible = candidateQuestions.filter((q) =>
        availableIds.has(q.id)
      );

      // Fisher–Yates shuffle on the server.
      for (let i = eligible.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
      }

      const selected = eligible.slice(
        0,
        Math.min(requestedCount, eligible.length)
      );

      if (!selected.length) {
        return json({
          error: "No ready-to-use questions are available for this selection.",
        }, 404);
      }

      const { data: attempt, error: attemptError } = await admin
        .from("quiz_attempts")
        .insert({
          user_id: user.id,
          topic_id: topicId,
          started_at: new Date().toISOString(),
          total_questions: selected.length,
          correct_count: 0,
          status: "started",
          question_ids: selected.map((q) => q.id),
        })
        .select("id, started_at, total_questions, status")
        .single();

      if (attemptError || !attempt) {
        console.error("Quiz attempt creation failed.");
        return json({ error: "Could not start your quiz." }, 500);
      }

      return json({
        attempt,
        questions: selected.map((q) => ({
          id: q.id,
          topic_id: q.topic_id,
          prompt: q.prompt,
          options: q.options,
          difficulty: q.difficulty,
          objective_code: q.objective_code,
        })),
      });
    }

    if (body.action === "submit") {
      const attemptId = body.attempt_id;
      const answers = body.answers;

      if (
        typeof attemptId !== "string" ||
        !Array.isArray(answers) ||
        answers.length < 1 ||
        answers.length > 50
      ) {
        return json({ error: "Invalid quiz submission." }, 400);
      }

      const validAnswers = answers.every(
        (answer: unknown) =>
          typeof answer === "object" &&
          answer !== null &&
          typeof (answer as Record<string, unknown>).question_id === "string" &&
          typeof (answer as Record<string, unknown>).selected_option === "string"
      );

      if (!validAnswers) {
        return json({ error: "One or more answers are invalid." }, 400);
      }

      // The SQL function checks attempt ownership, exact question membership,
      // option validity, and duplicate submission inside a transaction.
      const { data: result, error: submitError } = await admin.rpc(
        "submit_quiz_attempt",
        {
          p_attempt_id: attemptId,
          p_user_id: user.id,
          p_answers: answers,
        }
      );

      if (submitError) {
        // Keep database details out of the public response.
        console.warn("Quiz submission rejected or failed.");
        return json({
          error: "We couldn't submit this quiz. It may already be submitted, or your answers may be invalid.",
        }, 400);
      }

      return json({ result });
    }

    return json({ error: "Unknown quiz action." }, 400);
  } catch {
    return json({ error: "Unexpected quiz service error. Please try again." }, 500);
  }
});