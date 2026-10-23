
import { supabase } from "./supabase";

export type QuizOption = {
  value: string;
  label: string;
};

export type QuizOptions = Record<string, string>;

export type QuizQuestion = {
  id: string;
  topic_id: string;
  prompt: string;
  options: QuizOptions;
  difficulty: "beginner" | "intermediate" | "advanced";
  objective_code: string | null;
};

export type QuizAttempt = {
  id: string;
  started_at: string;
  total_questions: number;
  status: "started" | "completed" | "abandoned";
};

export type QuizAnswer = {
  question_id: string;
  selected_option: string;
};

export type QuizAnswerResult = QuizAnswer & {
  is_correct: boolean;
  correct_option: string;
  explanation: string;
  option_explanations: Record<string, string> | null;
};

export type QuizResult = {
  attempt_id: string;
  total_questions: number;
  correct_count: number;
  score_percent: number;
  results: QuizAnswerResult[];
};

type StartQuizOptions = {
  topicId?: string | null;
  difficulty?: "beginner" | "intermediate" | "advanced";
  count?: number;
};

async function getFunctionErrorMessage(error: unknown): Promise<string> {
  if (error && typeof error === "object" && "context" in error) {
    const context = error.context;

    if (context instanceof Response) {
      const body = await context.clone().text().catch(() => "");

      console.error("Quiz engine HTTP status:", context.status);
      console.error("Quiz engine response body:", body);

      if (body) {
        try {
          const parsed: unknown = JSON.parse(body);

          if (
            parsed &&
            typeof parsed === "object" &&
            "error" in parsed &&
            typeof parsed.error === "string"
          ) {
            return parsed.error;
          }
        } catch {
          // The response is not JSON; return its text below.
        }

        return body;
      }

      return `Quiz engine request failed with HTTP ${context.status}.`;
    }
  }

  const message =
    error instanceof Error
      ? error.message
      : "The quiz service is temporarily unavailable.";

  console.error("Quiz engine request error:", error);
  return message;
}

export async function startQuiz(settings: StartQuizOptions = {}) {
  const { data, error } = await supabase.functions.invoke("quiz-engine", {
    body: {
      action: "start",
      topic_id: settings.topicId ?? null,
      difficulty: settings.difficulty ?? null,
      count: settings.count ?? 10,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.attempt?.id || !Array.isArray(data.questions)) {
    throw new Error("The server returned an invalid quiz response.");
  }

  const questions: QuizQuestion[] = data.questions.map(
    (question: QuizQuestion) => {
      const rawOptions: unknown = question.options;
      let options: QuizOptions;

      if (Array.isArray(rawOptions)) {
        options = Object.fromEntries(
          rawOptions.map((option: QuizOption) => [
            option.value,
            option.label,
          ]),
        );
      } else if (
        rawOptions !== null &&
        typeof rawOptions === "object"
      ) {
        options = rawOptions as QuizOptions;
      } else {
        throw new Error(
          `Question "${question.prompt}" has an invalid options format.`,
        );
      }

      return { ...question, options };
    },
  );

  return {
    attempt: data.attempt as QuizAttempt,
    questions,
  };
}

export async function submitQuiz(
  attemptId: string,
  answers: QuizAnswer[],
): Promise<QuizResult> {
  if (!attemptId || answers.length === 0) {
    throw new Error("Select your answers before submitting.");
  }

  const { data, error } = await supabase.functions.invoke("quiz-engine", {
    body: {
      action: "submit",
      attempt_id: attemptId,
      answers,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (
    !data?.result ||
    typeof data.result.score_percent !== "number" ||
    !Array.isArray(data.result.results)
  ) {
    throw new Error("The server returned an invalid quiz result.");
  }

  return data.result as QuizResult;
}
