
import { useEffect, useState } from "react";
// The JavaScript client is shared across the app and does not have a declaration file.
// @ts-ignore -- declare the module in a separate file if stricter typing is enabled.
import { supabase } from "../lib/supabase";
import QuizEngine from "./QuizEngine";

type QuizTopic = {
  id: string;
  name: string;
};

export default function QuizPage() {
  const [topics, setTopics] = useState<QuizTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTopics() {
      const { data, error } = await supabase
        .from("topics")
        .select("id, name")
        .eq("active", true)
        .order("name");

      if (cancelled) return;

      if (error) {
        setError(
          "Could not load quiz topics. Check that your topics table and read policies are configured."
        );
      } else {
        setTopics(data ?? []);
      }

      setLoading(false);
    }

    void loadTopics();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="quiz-page">
        <p>Loading quiz topics...</p>
      </section>
    );
  }

  return (
    <section className="quiz-page">
      <header>
        <p className="quiz-eyebrow">CLOUDACE AI LEARNING</p>
        <h1>Practice Quiz</h1>
        <p>Build your cloud knowledge one question at a time.</p>
      </header>

      {error && (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      )}

      {!error && topics.length === 0 && (
        <p className="quiz-notice">
          No active topics were found. Add topics to Supabase before starting a
          quiz.
        </p>
      )}

      {!error && topics.length > 0 && <QuizEngine topics={topics} />}
    </section>
  );
}
