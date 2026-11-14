
import { useState, type FormEvent } from "react";
import { signIn, signUp } from "./lib/auth";
import { supabase } from "./lib/supabase";
import "./AuthForm.css";

type AuthMode = "signin" | "signup" | "forgot";
type MessageType = "success" | "error" | "info";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  const passwordChecks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const passwordStrength = passwordChecks.filter(Boolean).length;

  const strengthLabel =
    passwordStrength <= 2
      ? "Weak"
      : passwordStrength === 3
        ? "Fair"
        : passwordStrength === 4
          ? "Good"
          : "Strong";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: `${window.location.origin}/?password-reset=1`,
          }
        );

        if (error) throw error;

        setMessage(
          "If an account exists for that email, a password reset link will be sent. Check your inbox and spam folder."
        );
        setMessageType("success");
        return;
      }

      if (isSignup) {
        const cleanName = fullName.trim();

        if (cleanName.length < 2) {
          throw new Error("Please enter your full name.");
        }

        if (password.length < 8) {
          throw new Error("Use a password with at least 8 characters.");
        }

        if (passwordStrength < 3) {
          throw new Error(
            "Please strengthen your password with uppercase letters, numbers or symbols."
          );
        }

        if (password !== confirmPassword) {
          throw new Error("Your passwords do not match.");
        }

        const data = await signUp(cleanEmail, password, cleanName);

        setMessage(
          data.session
            ? `Your account has been created. Welcome to CloudAce AI, ${cleanName.split(" ")[0]}!`
            : "Registration successful! Please check your email to confirm your account before signing in."
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
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMessage("");
  }

  return (
    <main className="auth-page">
      <div className="auth-grid" aria-hidden="true" />
      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />
      <div className="auth-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`particle particle-${index + 1}`} />
        ))}
      </div>

      <div className="auth-container">
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
              Your next level starts here. Learn smarter with AI-powered
              study assistance, interactive Azure quizzes and intelligent
              progress tracking.
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

        <section className="auth-form-section">
          <div className="auth-card">
            <div className="mobile-brand">
              <span className="brand-icon">✦</span>
              <span>CloudAce <strong>AI</strong></span>
            </div>

            <div className="auth-visual" aria-hidden="true">
              <div className="orb-orbit orbit-one" />
              <div className="orb-orbit orbit-two" />
              <div className="orb-orbit orbit-three" />
              <div className="holographic-orb">
                <span>✦</span>
              </div>
              <span className="orb-spark spark-one">✧</span>
              <span className="orb-spark spark-two">✦</span>
              <span className="orb-spark spark-three">·</span>
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">
                {mode === "signin"
                  ? "WELCOME BACK"
                  : mode === "signup"
                    ? "YOUR FUTURE STARTS HERE"
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
                  ? "Sign in and continue building your cloud skills."
                  : mode === "signup"
                    ? "Join the next generation of intelligent learners."
                    : "Enter your email to receive a secure reset link."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {isSignup && (
                <div className="form-group">
                  <label htmlFor="learner-name">Full name</label>
                  <div className="input-shell">
                    <span className="input-icon" aria-hidden="true">♙</span>
                    <input
                      id="learner-name"
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      autoComplete="name"
                      minLength={2}
                      required
                      disabled={busy}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="learner-email">Email address</label>
                <div className="input-shell">
                  <span className="input-icon" aria-hidden="true">✉</span>
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
              </div>

              {mode !== "forgot" && (
                <>
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

                    <div className="input-shell password-input-wrapper">
                      <span className="input-icon" aria-hidden="true">⌑</span>
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
                        minLength={isSignup ? 8 : 6}
                        required
                        disabled={busy}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </button>
                    </div>

                    {isSignup && password.length > 0 && (
                      <div className="password-strength">
                        <div
                          className="strength-bars"
                          aria-label={`Password strength: ${strengthLabel}`}
                        >
                          {passwordChecks.map((passed, index) => (
                            <span
                              key={index}
                              className={passed ? "filled" : ""}
                            />
                          ))}
                        </div>

                        <small>
                          Password strength: <strong>{strengthLabel}</strong>
                        </small>
                        <small className="password-hint">
                          Use 8+ characters with uppercase, lowercase,
                          numbers and symbols for better security.
                        </small>
                      </div>
                    )}
                  </div>

                  {isSignup && (
                    <div className="form-group">
                      <label htmlFor="confirm-password">
                        Confirm password
                      </label>
                      <div className="input-shell password-input-wrapper">
                        <span className="input-icon" aria-hidden="true">⌑</span>
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          autoComplete="new-password"
                          minLength={8}
                          required
                          disabled={busy}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirmation password"
                              : "Show confirmation password"
                          }
                        >
                          {showConfirmPassword ? "HIDE" : "SHOW"}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && (
                        <small
                          className={
                            password === confirmPassword
                              ? "match-status matched"
                              : "match-status"
                          }
                        >
                          {password === confirmPassword
                            ? "✓ Passwords match"
                            : "Passwords do not match"}
                        </small>
                      )}
                    </div>
                  )}
                </>
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
                  "SIGN IN  →"
                ) : mode === "signup" ? (
                  "CREATE MY ACCOUNT  →"
                ) : (
                  "SEND RESET LINK  →"
                )}
              </button>
            </form>

            {message && (
              <div
                className={`auth-message ${messageType}`}
                role={messageType === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <div className="auth-divider">
              <span>SECURE ACCESS</span>
            </div>

            {mode === "forgot" ? (
              <p className="auth-switch">
                Remember your password?
                <button type="button" onClick={() => changeMode("signin")}>
                  Sign in
                </button>
              </p>
            ) : (
              <p className="auth-switch">
                {mode === "signin"
                  ? "New to CloudAce AI?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => changeMode(isSignup ? "signin" : "signup")}
                >
                  {isSignup ? "Sign in" : "Create account"}
                </button>
              </p>
            )}

            <div className="auth-security">
              <span>◇</span>
              Protected by Supabase secure authentication.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
