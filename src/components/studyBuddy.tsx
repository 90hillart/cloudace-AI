import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./StudyBuddy.css";

type Mode = "chat" | "explain" | "questions";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const examples: Record<Mode, string[]> = {
  chat: [
    "What is Microsoft Azure?",
    "Explain the difference between IaaS, PaaS, and SaaS.",
    "How can I prepare for the AZ-900 exam?",
  ],
  explain: [
    "Explain Azure availability zones in simple terms.",
    "Explain Azure resource groups with an example.",
    "What is the difference between Azure Policy and resource locks?",
  ],
  questions: [
    "Give me 5 AZ-900 practice questions.",
    "Quiz me on cloud concepts.",
    "Test my knowledge of Azure pricing and support.",
  ],
};

async function getFunctionErrorDetails(error: unknown): Promise<string> {
  if (!(error instanceof Error)) {
    return "An unexpected error occurred while contacting the AI service.";
  }

  const functionError = error as Error & {
    context?: Response;
  };

  const response = functionError.context;

  if (response) {
    try {
      const responseCopy = response.clone();
      const responseText = await responseCopy.text();

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText) as {
            error?: string;
            message?: string;
            msg?: string;
          };

          return (
            parsed.error ||
            parsed.message ||
            parsed.msg ||
            responseText
          );
        } catch {
          return responseText;
        }
      }

      return `The server returned HTTP ${response.status} ${response.statusText}.`;
    } catch {
      return `The request failed: ${error.message}`;
    }
  }

  return error.message;
}

export default function StudyBuddy() {
  const [mode, setMode] = useState<Mode>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your CloudAce AI Study Buddy. Ask me about Azure, request a simple explanation, or practise for your AZ-900 certification exam.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(text = input) {
    const message = text.trim();

    if (!message || loading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          `Could not verify your session: ${sessionError.message}`,
        );
      }

      if (!session) {
        throw new Error(
          "You are not signed in. Please sign in again and retry.",
        );
      }

      const { data, error: functionError } =
        await supabase.functions.invoke("study-buddy", {
          body: {
            mode,
            message,
            history: updatedMessages.slice(-10).map((item) => ({
              role: item.role,
              content: item.content,
            })),
          },
        });

      if (functionError) {
        const details = await getFunctionErrorDetails(functionError);

        throw new Error(`Study Buddy error: ${details}`);
      }

      if (data?.error) {
        throw new Error(`Study Buddy error: ${data.error}`);
      }

      if (typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error(
          "The server responded, but no AI reply was returned. Check your Supabase function logs.",
        );
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";

      console.error("CloudAce Study Buddy request failed:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="study-buddy">
      <header className="study-buddy-header">
        <div>
          <span className="study-buddy-eyebrow">
            CLOUDA CE AI LEARNING
          </span>
          <h1>AI Study Buddy</h1>
          <p>
            Your personal assistant for mastering Microsoft Azure
            fundamentals.
          </p>
        </div>

        <span className="study-buddy-icon" aria-hidden="true">
          ✦
        </span>
      </header>

      <div className="study-buddy-modes" aria-label="Choose study mode">
        <button
          type="button"
          className={mode === "chat" ? "active" : ""}
          aria-pressed={mode === "chat"}
          onClick={() => setMode("chat")}
        >
          💬 Ask AI
        </button>

        <button
          type="button"
          className={mode === "explain" ? "active" : ""}
          aria-pressed={mode === "explain"}
          onClick={() => setMode("explain")}
        >
          📘 Explain a Topic
        </button>

        <button
          type="button"
          className={mode === "questions" ? "active" : ""}
          aria-pressed={mode === "questions"}
          onClick={() => setMode("questions")}
        >
          🎯 Practice Questions
        </button>
      </div>

      <div className="study-buddy-layout">
        <aside className="study-buddy-suggestions">
          <h2>Try asking</h2>
          <p>Choose a prompt to start learning.</p>

          {examples[mode].map((example) => (
            <button
              type="button"
              className="study-buddy-example"
              key={example}
              disabled={loading}
              onClick={() => void sendMessage(example)}
            >
              {example}
              <span aria-hidden="true">↗</span>
            </button>
          ))}

          <div className="study-buddy-tip">
            <strong>Study tip</strong>
            <p>
              Ask for practical examples, then test yourself to check
              what you have learned.
            </p>
          </div>
        </aside>

        <div className="study-buddy-chat">
          <div className="study-buddy-chat-heading">
            <div>
              <h2>Your learning conversation</h2>
              <p>Focused on Azure and AZ-900 exam preparation</p>
            </div>

            <button
              type="button"
              className="study-buddy-clear"
              disabled={loading}
              onClick={() => {
                setError("");
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "Conversation cleared. What would you like to learn today?",
                  },
                ]);
              }}
            >
              Clear chat
            </button>
          </div>

          <div className="study-buddy-messages" aria-live="polite">
            {messages.map((item, index) => (
              <article
                key={`${index}-${item.role}`}
                className={`study-buddy-message ${item.role}`}
              >
                <span className="study-buddy-avatar">
                  {item.role === "assistant" ? "✦" : "You"}
                </span>

                <div className="study-buddy-message-content">
                  <strong>
                    {item.role === "assistant" ? "Study Buddy" : "You"}
                  </strong>
                  <p>{item.content}</p>
                </div>
              </article>
            ))}

            {loading && (
              <div className="study-buddy-loading" role="status">
                <span className="study-buddy-spinner" />
                Your Study Buddy is thinking...
              </div>
            )}
          </div>

          {error && (
            <div className="study-buddy-error" role="alert">
              <strong>Unable to get an AI response</strong>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  void sendMessage(
                    messages.filter((item) => item.role === "user").at(-1)
                      ?.content || "",
                  );
                }}
                disabled={loading}
              >
                Try again
              </button>
            </div>
          )}

          <form
            className="study-buddy-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <label
              className="study-buddy-sr-only"
              htmlFor="study-buddy-input"
            >
              Your question
            </label>

            <textarea
              id="study-buddy-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Ask anything about Azure..."
              rows={2}
              maxLength={2000}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
            >
              {loading ? "Thinking..." : "Send ↑"}
            </button>
          </form>

          <p className="study-buddy-disclaimer">
            AI can make mistakes. Verify important exam concepts against
            official Microsoft Learn materials.
          </p>
        </div>
      </div>
    </section>
  );
}
