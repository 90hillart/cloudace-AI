
import { useState } from "react";
import type { Course } from "./courses";
import "./App.css";

type CourseViewProps = {
  course: Course;
  completedLessons: string[];
  onToggleLesson: (
    lessonId: string,
    completed: boolean
  ) => Promise<void>;
  onBack: () => void;
};

export default function CourseView({
  course,
  completedLessons,
  onToggleLesson,
  onBack,
}: CourseViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (course.lessons.length === 0) {
    return (
      <main className="lesson-page">
        <button
          className="secondary-button"
          type="button"
          onClick={onBack}
        >
          ← Back to dashboard
        </button>

        <section className="panel-card lesson-empty">
          <h1>{course.title}</h1>
          <p className="muted">
            No lessons have been added to this course yet.
          </p>
        </section>
      </main>
    );
  }

  const safeIndex = Math.min(
    selectedIndex,
    course.lessons.length - 1
  );
  const lesson = course.lessons[safeIndex];

  const completedCount = course.lessons.filter((item) =>
    completedLessons.includes(item.id)
  ).length;

  const progress = Math.round(
    (completedCount / course.lessons.length) * 100
  );

  const isCompleted = completedLessons.includes(lesson.id);

  async function toggleCompletion() {
    if (saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await onToggleLesson(lesson.id, !isCompleted);

      setMessage(
        !isCompleted
          ? "Lesson marked as complete."
          : "Lesson marked as incomplete."
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save lesson progress. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function selectLesson(index: number) {
    setSelectedIndex(index);
    setError("");
    setMessage("");
  }

  return (
    <main className="lesson-page">
      <header className="lesson-header">
        <button
          className="secondary-button"
          type="button"
          onClick={onBack}
        >
          <span aria-hidden="true">←</span> Back to dashboard
        </button>

        <p className="eyebrow">Learning workspace</p>

        <h1 className="page-title">{course.title}</h1>

        <p className="muted lesson-description">
          {course.description}
        </p>
      </header>

      <section
        className="panel-card lesson-progress-card"
        aria-label="Course progress"
      >
        <div className="lesson-progress-heading">
          <div>
            <span className="lesson-overline">YOUR PROGRESS</span>
            <h2>{progress}% complete</h2>
          </div>

          <p className="muted">
            {completedCount} of {course.lessons.length} lessons completed
          </p>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="Course completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <div className="lesson-layout">
        <aside className="panel-card lesson-sidebar">
          <div className="lesson-sidebar-heading">
            <h2>Course lessons</h2>
            <span className="lesson-count">
              {course.lessons.length}
            </span>
          </div>

          <nav aria-label="Course lessons" className="lesson-list">
            {course.lessons.map((item, index) => {
              const done = completedLessons.includes(item.id);
              const selected = index === safeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    "lesson-nav-item",
                    selected ? "selected" : "",
                    done ? "completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={selected ? "step" : undefined}
                  onClick={() => selectLesson(index)}
                >
                  <span className="lesson-number" aria-hidden="true">
                    {done ? "✓" : index + 1}
                  </span>

                  <span className="lesson-nav-title">
                    {item.title}
                  </span>

                  <span className="sr-only">
                    {done ? "Completed" : "Not completed"}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <article className="panel-card lesson-content-card">
          <div className="lesson-content-meta">
            <span className="lesson-overline">
              LESSON {safeIndex + 1} OF {course.lessons.length}
            </span>

            {isCompleted && (
              <span className="completion-pill">
                <span aria-hidden="true">✓</span> Completed
              </span>
            )}
          </div>

          <h2 className="lesson-title">{lesson.title}</h2>

          <div className="lesson-body">
            <p>{lesson.content}</p>
          </div>

          {error && (
            <p className="lesson-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="status-message" role="status">
              {message}
            </p>
          )}

          <button
            className="primary-button lesson-complete-button"
            type="button"
            onClick={() => void toggleCompletion()}
            disabled={saving}
          >
            {saving
              ? "Saving progress..."
              : isCompleted
                ? "✓ Mark as incomplete"
                : "✓ Mark lesson as complete"}
          </button>

          <div className="lesson-navigation">
            <button
              className="secondary-button"
              type="button"
              disabled={safeIndex === 0}
              onClick={() => selectLesson(safeIndex - 1)}
            >
              ← Previous lesson
            </button>

            <button
              className="secondary-button"
              type="button"
              disabled={safeIndex === course.lessons.length - 1}
              onClick={() => selectLesson(safeIndex + 1)}
            >
              Next lesson →
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
