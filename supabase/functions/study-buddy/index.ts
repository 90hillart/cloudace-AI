import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `
You are CloudAce AI Study Buddy, a friendly and accurate Microsoft Azure
and AZ-900 certification tutor.

Your responsibilities:
- Explain cloud computing and Azure concepts clearly.
- Use beginner-friendly language and practical examples.
- Help learners understand IaaS, PaaS, SaaS, Azure services, security,
  governance, pricing, availability, and cloud architecture.
- Correct misconceptions politely.
- When creating practice questions, make them original and relevant to AZ-900.
- Explain why answers are correct or incorrect when appropriate.
- Do not claim that your questions are official Microsoft exam questions.
- If uncertain about a current Azure feature or price, say so.
`;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("AI_MODEL") || "gpt-4.1-mini";

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse(
        { error: "Supabase server configuration is missing." },
        500,
      );
    }

    if (!openaiApiKey) {
      return jsonResponse(
        { error: "The AI service is not configured yet." },
        500,
      );
    }

    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return jsonResponse(
        { error: "Please sign in to use the Study Buddy." },
        401,
      );
    }

    const token = authorization.slice("Bearer ".length);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse(
        { error: "Your session is invalid or expired. Please sign in again." },
        401,
      );
    }

    const body = await req.json();

    const allowedModes = ["chat", "explain", "questions"];
    const mode = body.mode;
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!allowedModes.includes(mode)) {
      return jsonResponse({ error: "Invalid study mode." }, 400);
    }

    if (!message || message.length > 2000) {
      return jsonResponse(
        { error: "Enter a message of up to 2,000 characters." },
        400,
      );
    }

    const history = Array.isArray(body.history)
      ? body.history
          .filter(
            (item: { role?: string; content?: string }) =>
              ["user", "assistant"].includes(item?.role ?? "") &&
              typeof item?.content === "string",
          )
          .slice(-10)
          .map((item: { role: string; content: string }) => ({
            role: item.role,
            content: item.content.slice(0, 3000),
          }))
      : [];

    let modeInstructions = "";

    if (mode === "explain") {
      modeInstructions =
        "Explain the requested concept step by step, using a simple analogy and a practical Azure example where relevant.";
    } else if (mode === "questions") {
      modeInstructions =
        "Create five original AZ-900-style multiple-choice practice questions unless the learner requests a different number. Include four options per question, identify the correct answer, and explain why it is correct. Clearly label this as practice material, not an official exam.";
    } else {
      modeInstructions =
        "Answer the learner's question clearly. Use headings or examples when they improve understanding.";
    }

    const input = [
      ...history.map((item: { role: string; content: string }) => ({
        role: item.role,
        content: item.content,
      })),
      {
        role: "user",
        content: `${modeInstructions}\n\nLearner's message:\n${message}`,
      },
    ];

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_PROMPT,
        input,
        max_output_tokens: mode === "questions" ? 1800 : 1000,
        store: false,
      }),
    });

    const result = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("OpenAI request failed:", aiResponse.status);

      return jsonResponse(
        {
          error:
            aiResponse.status === 429
              ? "The AI service is busy or has reached its usage limit. Please try again later."
              : "The AI could not complete your request. Please try again.",
        },
        502,
      );
    }

    const reply =
      typeof result.output_text === "string"
        ? result.output_text.trim()
        : "";

    if (!reply) {
      return jsonResponse(
        { error: "The AI returned an empty response. Please try again." },
        502,
      );
    }

    return jsonResponse({ reply });
  } catch (error) {
    console.error("Study Buddy function error:", error);

    return jsonResponse(
      { error: "Something went wrong. Please try again." },
      500,
    );
  }
});
