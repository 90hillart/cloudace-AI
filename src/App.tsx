
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { useLearner } from "./useLearner";
import { courses } from "./courses";
import CourseView from "./CourseView";
import { supabase } from "./lib/supabase";
import QuizPage from "./components/QuizPage";

type LessonProgressRow = {
  course_id: string;
  lesson_id: string;
  completed: boolean;
};

type CourseProgressRow = {
  course_id: string;
  progress: number;
  completed: boolean;
};

type ActivePage = "dashboard" | "courses" | "quiz";

export default function App() {
  const { user, loading } = useLearner();

  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    null
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProgress = useCallback(async () => {
    if (!user) return;

    setDataLoading(true);
    setMessage("");

    const [lessonsResult, coursesResult] = await Promise.all([
      supabase
        .from("lesson_progress")
        .select("course_id, lesson_id, completed")
        .eq("user_id", user.id),

      supabase
        .from("learner_progress")
        .select("course_id, progress, completed")
        .eq("user_id", user.id),
    ]);

    if (lessonsResult.error || coursesResult.error) {
      setMessage(
        lessonsResult.error?.message ??
          coursesResult.error?.message ??
          "Could not load your learning progress."
      );
      setDataLoading(false);
      return;
    }

    const lessonRows = (lessonsResult.data ?? []) as LessonProgressRow[];
    const courseRows = (coursesResult.data ?? []) as CourseProgressRow[];

    setCompletedLessons(
      lessonRows.filter((row) => row.completed).map((row) => row.lesson_id)
    );

    const savedProgress: Record<string, number> = {};

    courseRows.forEach((row) => {
      savedProgress[row.course_id] = row.progress;
    });

    setProgress(savedProgress);
    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    void loadProgress();
  }, [user, loadProgress]);

  const toggleLesson = useCallback(
    async (lessonId: string, completed: boolean) => {
      if (!user) throw new Error("Please sign in again.");

      const course = courses.find((item) =>
        item.lessons.some((lesson) => lesson.id === lessonId)
      );

      if (!course) throw new Error("Course not found.");

      const { error: lessonError } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            course_id: course.id,
            lesson_id: lessonId,
            completed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (lessonError) throw lessonError;

      const nextCompleted = completed
        ? [...new Set([...completedLessons, lessonId])]
        : completedLessons.filter((id) => id !== lessonId);

      const courseCompletedCount = course.lessons.filter((lesson) =>
        nextCompleted.includes(lesson.id)
      ).length;

      const coursePercent = Math.round(
        (courseCompletedCount / course.lessons.length) * 100
      );

      const { error: courseError } = await supabase
        .from("learner_progress")
        .upsert(
          {
            user_id: user.id,
            course_id: course.id,
            progress: coursePercent,
            completed: coursePercent === 100,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_id" }
        );

      if (courseError) throw courseError;

      setCompletedLessons(nextCompleted);
      setProgress((current) => ({
        ...current,
        [course.id]: coursePercent,
      }));

      setMessage("Lesson progress saved successfully.");
    },
    [user, completedLessons]
  );

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(`Sign out failed: ${error.message}`);
    }
  }

  function navigateTo(page: ActivePage) {
    setActivePage(page);
    setSelectedCourseId(null);
    setMessage("");

    if (page === "courses") {
      setSearchQuery("");
    }
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Checking authentication...</p>;
  }

  if (!user) return <AuthForm />;

  if (dataLoading) {
    return (
      <p style={{ padding: 24 }}>Loading your learning progress...</p>
    );
  }

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

  if (selectedCourse) {
    return (
      <CourseView
        course={selectedCourse}
        completedLessons={completedLessons}
        onToggleLesson={toggleLesson}
        onBack={() => setSelectedCourseId(null)}
      />
    );
  }

  const completedCourseCount = courses.filter(
    (course) => (progress[course.id] ?? 0) === 100
  ).length;

  const overallProgress = Math.round(
    courses.reduce(
      (total, course) => total + (progress[course.id] ?? 0),
      0
    ) / courses.length
  );

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand">
          CloudAce <span>AI</span>
        </h1>

        <p className="sidebar-caption">Your learning workspace</p>

        <p className="nav-label">Workspace</p>

        <nav>
          <button
            type="button"
            className={`nav-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigateTo("dashboard")}
          >
            ◫ &nbsp; Dashboard
          </button>

          <button
            type="button"
            className={`nav-item ${
              activePage === "courses" ? "active" : ""
            }`}
            onClick={() => navigateTo("courses")}
          >
            ▤ &nbsp; My Courses
          </button>

          <button
            type="button"
            className={`nav-item ${
              activePage === "quiz" ? "active" : ""
            }`}
            onClick={() => navigateTo("quiz")}
          >
            ◈ &nbsp; Practice Quiz
          </button>
        </nav>

        <div className="sidebar-bottom">
          <strong>Signed in</strong>
          <p>{user.email}</p>

          <button
            type="button"
            className="signout-button"
            onClick={() => void handleSignOut()}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-panel">
        {activePage === "quiz" ? (
          <QuizPage />
        ) : (
          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">
                  {activePage === "dashboard"
                    ? "Learning overview"
                    : "Your learning library"}
                </span>

                <h2 className="page-title">
                  {activePage === "dashboard"
                    ? "Welcome back!"
                    : "My Courses"}
                </h2>

                <p className="muted">
                  {activePage === "dashboard"
                    ? "Keep learning. Every lesson moves you forward."
                    : "Explore your courses and continue learning."}
                </p>
              </div>

              <input
                className="search-input"
                type="search"
                placeholder="Search courses..."
                aria-label="Search courses"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </header>

            {activePage === "dashboard" && (
              <section
                className="stats-grid"
                aria-label="Learning statistics"
              >
                <article className="stat-card">
                  <p>Available courses</p>
                  <h3>{courses.length}</h3>
                </article>

                <article className="stat-card">
                  <p>Completed courses</p>
                  <h3>{completedCourseCount}</h3>
                </article>

                <article className="stat-card">
                  <p>Overall progress</p>
                  <h3>{overallProgress}%</h3>
                </article>
              </section>
            )}

            <section id="course-catalog">
              <div className="section-heading">
                <h2>
                  {activePage === "dashboard"
                    ? "Explore courses"
                    : "Course catalog"}
                </h2>

                <span className="muted">
                  {filteredCourses.length} courses
                </span>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="empty-state">
                  <h3>No courses found</h3>
                  <p>Try another search term.</p>
                </div>
              ) : (
                <div className="course-grid">
                  {filteredCourses.map((course) => {
                    const courseProgress = progress[course.id] ?? 0;

                    const completedCount = course.lessons.filter(
                      (lesson) => completedLessons.includes(lesson.id)
                    ).length;

                    const courseIcon =
                      course.id === "python-basics"
                        ? "🐍"
                        : course.id === "data-science"
                          ? "📊"
                          : "🤖";

                    return (
                      <article className="course-card" key={course.id}>
                        <div className="course-icon" aria-hidden="true">
                          {courseIcon}
                        </div>

                        <h3>{course.title}</h3>

                        <p className="muted">{course.description}</p>

                        <p className="muted">
                          {course.lessons.length} lessons
                        </p>

                        <p className="muted">
                          {completedCount} of {course.lessons.length}{" "}
                          completed
                        </p>

                        <div
                          className="progress-track"
                          role="progressbar"
                          aria-label={`${course.title} progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={courseProgress}
                        >
                          <div
                            className="progress-fill"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>

                        <strong>{courseProgress}% complete</strong>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => setSelectedCourseId(course.id)}
                        >
                          {courseProgress === 100
                            ? "Review course"
                            : "Continue learning"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {message && (
              <p className="status-message" role="status">
                {message}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
