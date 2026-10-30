
import { useCallback, useEffect, useState } from "react";

import "./App.css";

import AuthForm from "./AuthForm";
import PasswordResetForm from "./PasswordResetForm";
import { useLearner } from "./useLearner";

import { courses } from "./courses";
import CourseView from "./CourseView";

import { supabase } from "./lib/supabase";
import { getLearnerProfile } from "./lib/onboarding";

import QuizPage from "./components/QuizPage";
import TopicMastery from "./components/TopicMastery";
import StudyBuddy from "./components/StudyBuddy";
import Flashcards from "./components/Flashcards";

import Onboarding from "./onboarding/Onboarding";

// --------------------------------------------------
// Types
// --------------------------------------------------

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

type QuizAttemptRow = {
  id: string;
  started_at: string;
  total_questions: number;
  status: "started" | "completed" | "abandoned";
};

type QuizAnswerRow = {
  attempt_id: string;
  is_correct: boolean;
};

type QuizPerformance = {
  completedAttempts: number;
  averageScore: number;
  bestScore: number;
  latestScore: number | null;
};

type ActivePage =
  | "dashboard"
  | "courses"
  | "quiz"
  | "study-buddy"
  | "flashcards";

const EMPTY_QUIZ_PERFORMANCE: QuizPerformance = {
  completedAttempts: 0,
  averageScore: 0,
  bestScore: 0,
  latestScore: null,
};

// --------------------------------------------------
// Main application
// --------------------------------------------------

export default function App() {
  const { user, loading } = useLearner();

  const isPasswordReset =
    new URLSearchParams(window.location.search).get("password-reset") === "1";

  // Navigation
  const [activePage, setActivePage] =
    useState<ActivePage>("dashboard");

  const [selectedCourseId, setSelectedCourseId] =
    useState<string | null>(null);

  // Course search and progress
  const [searchQuery, setSearchQuery] = useState("");

  const [completedLessons, setCompletedLessons] =
    useState<string[]>([]);

  const [progress, setProgress] =
    useState<Record<string, number>>({});

  // Application status
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Onboarding
  const [onboardingLoading, setOnboardingLoading] =
    useState(true);

  const [onboardingCompleted, setOnboardingCompleted] =
    useState(false);

  const [profileError, setProfileError] = useState("");

  // Quiz analytics
  const [quizPerformance, setQuizPerformance] =
    useState<QuizPerformance>(EMPTY_QUIZ_PERFORMANCE);

  const [quizStatsLoading, setQuizStatsLoading] =
    useState(true);

  // --------------------------------------------------
  // Load learner onboarding profile
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadOnboardingProfile() {
      if (!user) {
        setOnboardingCompleted(false);
        setOnboardingLoading(false);
        setProfileError("");
        return;
      }

      setOnboardingLoading(true);
      setProfileError("");

      try {
        const profile = await getLearnerProfile();

        if (!cancelled) {
          setOnboardingCompleted(
            profile?.onboarding_completed === true
          );
        }
      } catch (error) {
        console.error("Could not load learner profile:", error);

        if (!cancelled) {
          setProfileError(
            error instanceof Error
              ? error.message
              : "Could not load your learner profile."
          );
        }
      } finally {
        if (!cancelled) {
          setOnboardingLoading(false);
        }
      }
    }

    void loadOnboardingProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // --------------------------------------------------
  // Load course and lesson progress
  // --------------------------------------------------

  const loadProgress = useCallback(async () => {
    if (!user) {
      setCompletedLessons([]);
      setProgress({});
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setMessage("");

    try {
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

      if (lessonsResult.error) {
        throw lessonsResult.error;
      }

      if (coursesResult.error) {
        throw coursesResult.error;
      }

      const lessonRows =
        (lessonsResult.data ?? []) as LessonProgressRow[];

      const courseRows =
        (coursesResult.data ?? []) as CourseProgressRow[];

      const completed = lessonRows
        .filter((lesson) => lesson.completed)
        .map((lesson) => lesson.lesson_id);

      const savedProgress: Record<string, number> = {};

      courseRows.forEach((course) => {
        savedProgress[course.course_id] = course.progress;
      });

      setCompletedLessons(completed);
      setProgress(savedProgress);
    } catch (error) {
      console.error("Could not load learning progress:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load your learning progress."
      );
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  // --------------------------------------------------
  // Load quiz performance
  // --------------------------------------------------

  const loadQuizPerformance = useCallback(async () => {
    if (!user) {
      setQuizPerformance(EMPTY_QUIZ_PERFORMANCE);
      setQuizStatsLoading(false);
      return;
    }

    setQuizStatsLoading(true);

    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("id, started_at, total_questions, status")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("started_at", { ascending: false });

      if (error) {
        throw error;
      }

      const attempts = (data ?? []) as QuizAttemptRow[];

      if (attempts.length === 0) {
        setQuizPerformance(EMPTY_QUIZ_PERFORMANCE);
        return;
      }

      const attemptIds = attempts.map((attempt) => attempt.id);

      const { data: answers, error: answersError } = await supabase
        .from("answers")
        .select("attempt_id, is_correct")
        .in("attempt_id", attemptIds);

      if (answersError) {
        throw answersError;
      }

      const answerRows = (answers ?? []) as QuizAnswerRow[];

      // Group answers by quiz attempt.
      const answersByAttempt = new Map<string, QuizAnswerRow[]>();

      answerRows.forEach((answer) => {
        const existing =
          answersByAttempt.get(answer.attempt_id) ?? [];

        existing.push(answer);

        answersByAttempt.set(answer.attempt_id, existing);
      });

      // Calculate the score for each attempt.
      const scores = attempts.map((attempt) => {
        const attemptAnswers =
          answersByAttempt.get(attempt.id) ?? [];

        const correctCount = attemptAnswers.filter(
          (answer) => answer.is_correct
        ).length;

        if (attempt.total_questions <= 0) {
          return 0;
        }

        return Math.round(
          (correctCount / attempt.total_questions) * 100
        );
      });

      const totalScore = scores.reduce(
        (total, score) => total + score,
        0
      );

      setQuizPerformance({
        completedAttempts: attempts.length,
        averageScore: Math.round(totalScore / scores.length),
        bestScore: Math.max(...scores),
        latestScore: scores[0],
      });
    } catch (error) {
      console.error("Could not load quiz performance:", error);

      setMessage(
        error instanceof Error
          ? `Could not load quiz performance: ${error.message}`
          : "Could not load quiz performance."
      );
    } finally {
      setQuizStatsLoading(false);
    }
  }, [user]);

  // --------------------------------------------------
  // Load learner data after authentication
  // --------------------------------------------------

  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      setQuizStatsLoading(false);
      return;
    }

    void loadProgress();
    void loadQuizPerformance();
  }, [user, loadProgress, loadQuizPerformance]);

  // --------------------------------------------------
  // Save lesson completion
  // --------------------------------------------------

  const toggleLesson = useCallback(
    async (lessonId: string, completed: boolean) => {
      if (!user) {
        throw new Error("Please sign in again.");
      }

      const course = courses.find((item) =>
        item.lessons.some((lesson) => lesson.id === lessonId)
      );

      if (!course) {
        throw new Error("Course not found.");
      }

      const nextCompleted = completed
        ? [...new Set([...completedLessons, lessonId])]
        : completedLessons.filter((id) => id !== lessonId);

      const completedCount = course.lessons.filter((lesson) =>
        nextCompleted.includes(lesson.id)
      ).length;

      const coursePercent = Math.round(
        (completedCount / course.lessons.length) * 100
      );

      // Save lesson completion.
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
          {
            onConflict: "user_id,lesson_id",
          }
        );

      if (lessonError) {
        throw lessonError;
      }

      // Save overall course progress.
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
          {
            onConflict: "user_id,course_id",
          }
        );

      if (courseError) {
        throw courseError;
      }

      setCompletedLessons(nextCompleted);

      setProgress((current) => ({
        ...current,
        [course.id]: coursePercent,
      }));

      setMessage("Lesson progress saved successfully.");
    },
    [user, completedLessons]
  );

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const handleSignOut = async () => {
    setMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(`Sign out failed: ${error.message}`);
    }
  };

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setSelectedCourseId(null);
    setMessage("");

    if (page === "courses") {
      setSearchQuery("");
    }

    if (page === "dashboard") {
      void loadProgress();
      void loadQuizPerformance();
    }
  };

  // --------------------------------------------------
  // Derived course data
  // --------------------------------------------------

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

  const completedCourseCount = courses.filter(
    (course) => (progress[course.id] ?? 0) === 100
  ).length;

  const overallProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) =>
              total + (progress[course.id] ?? 0),
            0
          ) / courses.length
        )
      : 0;

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // --------------------------------------------------
  // Screen: Password reset
  // --------------------------------------------------

  if (isPasswordReset) {
    return <PasswordResetForm />;
  }

  // --------------------------------------------------
  // Screen: Authentication loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="onboarding-page">
        <div className="onboarding-card">
          <h2>Checking authentication...</h2>
          <p>Please wait while we prepare your account.</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Screen: Sign in
  // --------------------------------------------------

  if (!user) {
    return <AuthForm />;
  }

  // --------------------------------------------------
  // Screen: Onboarding loading
  // --------------------------------------------------

  if (onboardingLoading) {
    return (
      <main className="onboarding-page">
        <div className="onboarding-card">
          <h2>Preparing your learning experience...</h2>
          <p>Loading your CloudAce AI profile.</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Screen: Onboarding error
  // --------------------------------------------------

  if (profileError) {
    return (
      <main className="onboarding-page">
        <div className="onboarding-card">
          <h2>Unable to load your profile</h2>

          <p>{profileError}</p>

          <button
            type="button"
            className="continue-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Screen: Learner onboarding
  // --------------------------------------------------

  if (!onboardingCompleted) {
    return (
      <Onboarding
        onComplete={() => {
          setOnboardingCompleted(true);
        }}
      />
    );
  }

  // --------------------------------------------------
  // Screen: Learning progress loading
  // --------------------------------------------------

  if (dataLoading) {
    return (
      <main className="onboarding-page">
        <div className="onboarding-card">
          <h2>Loading your learning progress...</h2>
          <p>Getting your courses and saved progress.</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Screen: Selected course
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Main dashboard layout
  // --------------------------------------------------

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="brand">
          CloudAce <span>AI</span>
        </h1>

        <p className="sidebar-caption">
          Your learning workspace
        </p>

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

          <button
            type="button"
            className={`nav-item ${
              activePage === "study-buddy" ? "active" : ""
            }`}
            onClick={() => navigateTo("study-buddy")}
          >
            ✦ &nbsp; AI Study Buddy
          </button>

          <button
            type="button"
            className={`nav-item ${
              activePage === "flashcards" ? "active" : ""
            }`}
            onClick={() => navigateTo("flashcards")}
          >
            ▣ &nbsp; Flashcards
          </button>
        </nav>

        {/* Account section */}
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

      {/* Main content */}
      <main className="main-panel">
        {/* Practice quiz */}
        {activePage === "quiz" && <QuizPage />}

        {/* AI Study Buddy */}
        {activePage === "study-buddy" && <StudyBuddy />}

        {/* Flashcards */}
        {activePage === "flashcards" && <Flashcards />}

        {/* Dashboard and courses */}
        {(activePage === "dashboard" ||
          activePage === "courses") && (
          <>
            {/* Page header */}
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
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />
            </header>

            {/* Dashboard overview */}
            {activePage === "dashboard" && (
              <>
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

                {/* Quiz performance */}
                <section
                  className="quiz-performance-section"
                  aria-label="AZ-900 quiz performance"
                >
                  <div className="section-heading">
                    <h2>AZ-900 Quiz Performance</h2>

                    <span className="muted">
                      Your practice results
                    </span>
                  </div>

                  {quizStatsLoading ? (
                    <p className="muted">
                      Loading quiz performance...
                    </p>
                  ) : (
                    <div className="stats-grid">
                      <article className="stat-card">
                        <p>Quizzes completed</p>
                        <h3>
                          {quizPerformance.completedAttempts}
                        </h3>
                      </article>

                      <article className="stat-card">
                        <p>Average score</p>
                        <h3>
                          {quizPerformance.averageScore}%
                        </h3>
                      </article>

                      <article className="stat-card">
                        <p>Best score</p>
                        <h3>
                          {quizPerformance.bestScore}%
                        </h3>
                      </article>

                      <article className="stat-card">
                        <p>Latest score</p>
                        <h3>
                          {quizPerformance.latestScore === null
                            ? "—"
                            : `${quizPerformance.latestScore}%`}
                        </h3>
                      </article>
                    </div>
                  )}

                  {!quizStatsLoading &&
                    quizPerformance.completedAttempts === 0 && (
                      <p className="muted">
                        Complete your first practice quiz to start
                        tracking your performance.
                      </p>
                    )}

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigateTo("quiz")}
                  >
                    Start a practice quiz
                  </button>
                </section>

                {/* Topic mastery */}
                <TopicMastery />
              </>
            )}

            {/* Course catalogue */}
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
                    const courseProgress =
                      progress[course.id] ?? 0;

                    const completedCount = course.lessons.filter(
                      (lesson) =>
                        completedLessons.includes(lesson.id)
                    ).length;

                    const courseIcons: Record<string, string> = {
                      "python-basics": "🐍",
                      "data-science": "📊",
                    };

                    const courseIcon =
                      courseIcons[course.id] ?? "🤖";

                    return (
                      <article
                        className="course-card"
                        key={course.id}
                      >
                        <div
                          className="course-icon"
                          aria-hidden="true"
                        >
                          {courseIcon}
                        </div>

                        <h3>{course.title}</h3>

                        <p className="muted">
                          {course.description}
                        </p>

                        <p className="muted">
                          {course.lessons.length} lessons
                        </p>

                        <p className="muted">
                          {completedCount} of{" "}
                          {course.lessons.length} completed
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
                            style={{
                              width: `${courseProgress}%`,
                            }}
                          />
                        </div>

                        <strong>
                          {courseProgress}% complete
                        </strong>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={() =>
                            setSelectedCourseId(course.id)
                          }
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
          </>
        )}

        {/* Application messages */}
        {message && (
          <p className="status-message" role="status">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
