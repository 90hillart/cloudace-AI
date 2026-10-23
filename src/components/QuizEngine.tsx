
import { useMemo, useState } from "react";
import {
  startQuiz,
  submitQuiz,
  type QuizAttempt,
  type QuizQuestion,
  type QuizResult,
} from "../lib/quizApi";

type QuizTopic = {
  id: string;
  name: string;
};

type QuizEngineProps = {
  topics: QuizTopic[];
};

type Difficulty = "beginner" | "intermediate" | "advanced";

export default function QuizEngine({ topics }: QuizEngineProps) {
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [questionCount, setQuestionCount] = useState(10);

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  async function handleStart() {
    setLoading(true);
    setError("");
    setResult(null);
    setAttempt(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const quiz = await startQuiz({
        topicId: topicId || null,
        difficulty: difficulty || undefined,
        count: questionCount,
      });

      setAttempt(quiz.attempt);
      setQuestions(quiz.questions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionId: string, optionValue: string) {
    if (result || submitting) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionValue,
    }));
  }

  async function handleSubmit() {
    if (!attempt || submitting || result) return;

    if (answeredCount !== questions.length) {
      setError(
        `Please answer every question before submitting. ${
          questions.length - answeredCount
        } remaining.`
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const submittedAnswers = questions.map((question) => ({
        question_id: question.id,
        selected_option: answers[question.id],
      }));

      const quizResult = await submitQuiz(
        attempt.id,
        submittedAnswers
      );

      setResult(quizResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetQuiz() {
    setAttempt(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setError("");
  }

  if (result) {
    const percentage = result.score_percent;

    return (
      <section className="quiz-engine">
        <div className="quiz-result">
          <p className="quiz-eyebrow">QUIZ COMPLETED</p>
          <h2>Your results</h2>

          <div className="quiz-score-circle">
            <strong>{percentage.toFixed(0)}%</strong>
            <span>score</span>
          </div>

          <p className="quiz-result-summary">
            You answered {result.correct_count} out of{" "}
            {result.total_questions} questions correctly.
          </p>

          <div className="quiz-result-stats">
            <div>
              <strong>{result.correct_count}</strong>
              <span>Correct</span>
            </div>
            <div>
              <strong>
                {result.total_questions - result.correct_count}
              </strong>
              <span>Incorrect</span>
            </div>
            <div>
              <strong>{result.total_questions}</strong>
              <span>Total</span>
            </div>
          </div>

          <h3>Answer review</h3>

          <div className="quiz-review-list">
            {questions.map((question, index) => {
              const answerResult = result.results.find(
                (item) => item.question_id === question.id
              );

              if (!answerResult) return null;

              const selectedLabel =
                question.options[answerResult.selected_option];

              const correctLabel =
                question.options[answerResult.correct_option];

              return (
                <article
                  className={`quiz-review-item ${
                    answerResult.is_correct
                      ? "is-correct"
                      : "is-incorrect"
                  }`}
                  key={question.id}
                >
                  <p className="quiz-review-label">
                    Question {index + 1} ·{" "}
                    {answerResult.is_correct ? "Correct" : "Incorrect"}
                  </p>

                  <h4>{question.prompt}</h4>

                  <p>
                    <strong>Your answer:</strong>{" "}
                    {selectedLabel ?? answerResult.selected_option}
                  </p>

                  {!answerResult.is_correct && (
                    <p>
                      <strong>Correct answer:</strong>{" "}
                      {correctLabel ?? answerResult.correct_option}
                    </p>
                  )}

                  <p className="quiz-explanation">
                    {answerResult.explanation}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="quiz-actions">
            <button
              className="quiz-primary-button"
              onClick={resetQuiz}
            >
              Try another quiz
            </button>
          </div>

          <p className="quiz-disclaimer">
            This practice score is for learning and readiness tracking.
            It is not an official Microsoft certification result.
          </p>
        </div>
      </section>
    );
  }

  if (!attempt || questions.length === 0) {
    return (
      <section className="quiz-engine">
        <div className="quiz-setup">
          <p className="quiz-eyebrow">AZ-900 PRACTICE</p>
          <h2>Test your cloud knowledge</h2>
          <p className="quiz-muted">
            Practise key concepts, check your understanding, and learn
            from every answer.
          </p>

          <div className="quiz-field">
            <label htmlFor="quiz-topic">Topic</label>
            <select
              id="quiz-topic"
              value={topicId}
              onChange={(event) => setTopicId(event.target.value)}
            >
              <option value="">All available topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="quiz-field">
            <label htmlFor="quiz-difficulty">Difficulty</label>
            <select
              id="quiz-difficulty"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as Difficulty | "")
              }
            >
              <option value="">Mixed difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="quiz-field">
            <label htmlFor="quiz-count">Number of questions</label>
            <select
              id="quiz-count"
              value={questionCount}
              onChange={(event) =>
                setQuestionCount(Number(event.target.value))
              }
            >
              <option value={5}>5 questions</option>
              <option value={10}>10 questions</option>
              <option value={15}>15 questions</option>
              <option value={20}>20 questions</option>
            </select>
          </div>

          {error && (
            <p className="quiz-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="quiz-primary-button"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? "Preparing your quiz..." : "Start quiz"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-engine">
      <div className="quiz-session">
        <div className="quiz-session-header">
          <div>
            <p className="quiz-eyebrow">AZ-900 PRACTICE</p>
            <h2>Knowledge check</h2>
          </div>

          <span className="quiz-counter">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div
          className="quiz-progress-track"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={currentIndex + 1}
        >
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="quiz-question-meta">
          <span>
            {currentQuestion.difficulty
              ? currentQuestion.difficulty[0].toUpperCase() +
                currentQuestion.difficulty.slice(1)
              : "Practice"}
          </span>
          {currentQuestion.objective_code && (
            <span>{currentQuestion.objective_code}</span>
          )}
        </div>

        <h3 className="quiz-question">
          {currentQuestion.prompt}
        </h3>

        <div className="quiz-options">
          {Object.entries(currentQuestion.options).map(
            ([value, label]) => {
              const selected =
                answers[currentQuestion.id] === value;

              return (
                <button
                  type="button"
                  key={value}
                  className={`quiz-option ${
                    selected ? "is-selected" : ""
                  }`}
                  aria-pressed={selected}
                  onClick={() =>
                    selectAnswer(currentQuestion.id, value)
                  }
                  disabled={submitting}
                >
                  <span className="quiz-option-letter">
                    {value}
                  </span>
                  <span>{label}</span>
                </button>
              );
            }
          )}
        </div>

        <p className="quiz-muted">
          {answeredCount} of {questions.length} questions answered
        </p>

        {error && (
          <p className="quiz-error" role="alert">
            {error}
          </p>
        )}

        <div className="quiz-actions">
          <button
            className="quiz-secondary-button"
            onClick={() =>
              setCurrentIndex((index) => Math.max(0, index - 1))
            }
            disabled={currentIndex === 0 || submitting}
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className="quiz-primary-button"
              onClick={() =>
                setCurrentIndex((index) =>
                  Math.min(questions.length - 1, index + 1)
                )
              }
              disabled={submitting}
            >
              Next question
            </button>
          ) : (
            <button
              className="quiz-primary-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit answers"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
