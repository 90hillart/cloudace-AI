
import { useState, type FormEvent } from "react";
import { signIn, signUp } from "./lib/auth";
import { supabase } from "./lib/supabase";
import "./AuthForm.css";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [busy, setBusy] = useState(false);

  const passwordStrength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const strengthLabel =
    passwordStrength <= 2
      ? "Weak"
      : passwordStrength <= 3
        ? "Fair"
        : passwordStrength <= 4
          ? "Good"
          : "Strong";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setBusy(true);

    try {
      const cleanEmail = email.trim();

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: `${window.location.origin}/?password-reset=1`,
          }
        );

        if (error) throw error;

        setMessage(
          "If an account exists for that email, a reset link will be sent. Check your inbox and spam folder."
        );
        setMessageType("success");
        return;
      }

      if (mode === "signup") {
        if (password.length < 6) {
          throw new Error("Your password must contain at least 6 characters.");
        }

        const data = await signUp(cleanEmail, password);

        setMessage(
          data.session
            ? "Your account has been created successfully. Welcome to CloudAce AI!"
            : "Registration successful! Check your email if confirmation is required."
        );

        setMessageType("success");
      } else {
        await signIn(cleanEmail, password);

        setMessage("Welcome back! Signing you in...");
        setMessageType("success");
      }
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword("");
    setShowPassword(false);
    setMessage("");
  }

  const isSignup = mode === "signup";

  return (
    <main className="auth-page">
      <div className="auth-background-glow" />

      <div className="auth-container">

        {/* LEFT BRANDING SECTION */}
        <section className="auth-branding">
          <div className="brand-logo">
            <span className="brand-icon">✦</span>
            <span>CloudAce <strong>AI</strong></span>
          </div>

          <div className="branding-content">
            <span className="branding-tag">
              YOUR SMARTER LEARNING JOURNEY
            </span>

            <h1>
              Master the Cloud.
              <br />
              <span>Unlock Your Potential.</span>
            </h1>

            <p>
              Learn smarter with AI-powered study assistance,
              interactive Azure quizzes, personalized study plans,
              and intelligent progress tracking.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span>✦</span>
                <div>
                  <strong>AI-powered learning</strong>
                  <small>Get intelligent study assistance.</small>
                </div>
              </div>

              <div className="feature-item">
                <span>◈</span>
                <div>
                  <strong>Interactive AZ-900 quizzes</strong>
                  <small>Practice and strengthen your knowledge.</small>
                </div>
              </div>

              <div className="feature-item">
                <span>↗</span>
                <div>
                  <strong>Track your progress</strong>
                  <small>Stay focused on your learning goals.</small>
                </div>
              </div>
            </div>
          </div>

          <div className="branding-footer">
            Empowering the next generation of cloud learners.
          </div>
        </section>

        {/* RIGHT AUTHENTICATION SECTION */}
        <section className="auth-form-section">
          <div className="auth-card">

            <div className="mobile-brand">
              ✦ CloudAce <strong>AI</strong>
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">
                {mode === "signin"
                  ? "WELCOME BACK"
                  : mode === "signup"
                    ? "GET STARTED"
                    : "ACCOUNT RECOVERY"}
              </span>

              <h2>
                {mode === "signin"
                  ? "Welcome back"
                  : mode === "signup"
                    ? "Create your account"
                    : "Reset your password"}
              </h2>

              <p>
                {mode === "signin"
                  ? "Sign in to continue your learning journey."
                  : mode === "signup"
                    ? "Join CloudAce AI and take control of your learning."
                    : "Enter your email to receive a password reset link."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="form-group">
                <label htmlFor="learner-email">Email address</label>

                <input
                  id="learner-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  disabled={busy}
                />
              </div>

              {mode !== "forgot" && (
                <div className="form-group">
                  <div className="password-label-row">
                    <label htmlFor="learner-password">Password</label>

                    {mode === "signin" && (
                      <button
                        type="button"
                        className="text-action"
                        onClick={() => changeMode("forgot")}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <div className="password-input-wrapper">
                    <input
                      id="learner-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete={
                        mode === "signin"
                          ? "current-password"
                          : "new-password"
                      }
                      minLength={6}
                      required
                      disabled={busy}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {isSignup && password.length > 0 && (
                    <div className="password-strength">
                      <div className="strength-bars">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <span
                            key={bar}
                            className={
                              bar <= passwordStrength ? "filled" : ""
                            }
                          />
                        ))}
                      </div>

                      <small>
                        Password strength: <strong>{strengthLabel}</strong>
                      </small>

                      <small className="password-hint">
                        Use at least 8 characters, numbers, and symbols
                        for a stronger password.
                      </small>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="loading-spinner" />
                    Please wait...
                  </>
                ) : mode === "signin" ? (
                  "Sign In →"
                ) : mode === "signup" ? (
                  "Create My Account →"
                ) : (
                  "Send Reset Link →"
                )}
              </button>
            </form>

            {message && (
              <div
                className={`auth-message ${messageType}`}
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <div className="auth-divider">
              <span>OR</span>
            </div>

            {mode === "forgot" ? (
              <p className="auth-switch">
                Remember your password?{" "}
                <button onClick={() => changeMode("signin")}>
                  Sign in
                </button>
              </p>
            ) : (
              <p className="auth-switch">
                {mode === "signin"
                  ? "New to CloudAce AI?"
                  : "Already have an account?"}

                <button
                  onClick={() =>
                    changeMode(isSignup ? "signin" : "signup")
                  }
                >
                  {isSignup ? "Sign in" : "Create account"}
                </button>
              </p>
            )}

            <div className="auth-security">
              <span>🔒</span>
              Your learning journey is protected by secure authentication.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
