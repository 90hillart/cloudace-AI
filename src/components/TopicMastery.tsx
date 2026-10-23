
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type TopicRow = {
  id: string;
  name: string;
  slug: string;
};

type AttemptRow = {
  id: string;
  question_ids: string[];
  status: string;
};

type AnswerRow = {
  attempt_id: string;
  question_id: string;
  is_correct: boolean;
};

type QuestionRow = {
  id: string;
  topic_id: string;
};

type TopicStat = {
  id: string;
  name: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

export default function TopicMastery() {
  const [stats, setStats] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTopicMastery() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("Please sign in to view topic mastery.");

        const [topicsResult, attemptsResult] = await Promise.all([
          supabase
            .from("topics")
            .select("id, name, slug")
            .eq("active", true)
            .order("name"),

          supabase
            .from("quiz_attempts")
            .select("id, question_ids, status")
            .eq("user_id", user.id)
            .eq("status", "completed"),
        ]);

        if (topicsResult.error) throw topicsResult.error;
        if (attemptsResult.error) throw attemptsResult.error;

        const topics = (topicsResult.data ?? []) as TopicRow[];
        const attempts = (attemptsResult.data ?? []) as AttemptRow[];

        if (attempts.length === 0) {
          if (!cancelled) {
            setStats(
              topics.map((topic) => ({
                id: topic.id,
                name: topic.name,
                attempted: 0,
                correct: 0,
                accuracy: 0,
              }))
            );
          }
          return;
        }

        const attemptIds = attempts.map((attempt) => attempt.id);

        const [answersResult, questionsResult] = await Promise.all([
          supabase
            .from("answers")
            .select("attempt_id, question_id, is_correct")
            .in("attempt_id", attemptIds),

          supabase
            .from("questions")
            .select("id, topic_id")
            .eq("active", true),
        ]);

        if (answersResult.error) throw answersResult.error;
        if (questionsResult.error) throw questionsResult.error;

        const answers = (answersResult.data ?? []) as AnswerRow[];
        const questions = (questionsResult.data ?? []) as QuestionRow[];

        const topicByQuestion = new Map(
          questions.map((question) => [question.id, question.topic_id])
        );

        const calculated = topics.map((topic) => {
          const topicAnswers = answers.filter(
            (answer) => topicByQuestion.get(answer.question_id) === topic.id
          );

          const attempted = topicAnswers.length;
          const correct = topicAnswers.filter(
            (answer) => answer.is_correct
          ).length;

          return {
            id: topic.id,
            name: topic.name,
            attempted,
            correct,
            accuracy:
              attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
          };
        });

        if (!cancelled) setStats(calculated);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load topic mastery."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadTopicMastery();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="muted">Loading topic mastery...</p>;
  }

  if (error) {
    return (
      <p className="status-message" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="topic-mastery-section">
      <div className="section-heading">
        <h2>Topic Mastery</h2>
        <span className="muted">Based on completed quiz answers</span>
      </div>

      {stats.length === 0 ? (
        <p className="muted">No active exam topics are available yet.</p>
      ) : (
        <div className="course-grid">
          {stats.map((topic) => (
            <article className="course-card" key={topic.id}>
              <h3>{topic.name}</h3>

              <p className="muted">
                {topic.attempted === 0
                  ? "No answers recorded yet"
                  : `${topic.correct} correct out of ${topic.attempted} answers`}
              </p>

              <div
                className="progress-track"
                role="progressbar"
                aria-label={`${topic.name} accuracy`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={topic.accuracy}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${topic.accuracy}%` }}
                />
              </div>

              <strong>
                {topic.attempted > 0 ? `${topic.accuracy}% accuracy` : "Not yet assessed"}
              </strong>

              {topic.attempted > 0 && topic.accuracy < 70 && (
                <p className="muted">Recommended: revise this topic.</p>
              )}

              {topic.attempted > 0 && topic.accuracy >= 70 && (
                <p className="muted">Keep practising to maintain your score.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
