
import { useState, type FormEvent } from "react";
import { signIn, signUp } from "./lib/auth";
import { supabase } from "./lib/supabase";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/?password-reset=1`,
          }
        );

        if (error) throw error;

        setMessage(
          "If an account exists for that email, a password-reset link will be sent. Check your inbox and spam folder."
        );
        return;
      }

      if (mode === "signup") {
        const data = await signUp(email.trim(), password);

        setMessage(
          data.session
            ? "Account created successfully."
            : "Account created. Check your email if confirmation is required."
        );
      } else {
        await signIn(email.trim(), password);
        setMessage("Signed in successfully.");
      }
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The request could not be completed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword("");
    setMessage("");
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "60px auto",
        padding: 24,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h1>CloudAce AI</h1>

      <h2>
        {mode === "signin"
          ? "Learner Sign In"
          : mode === "signup"
            ? "Create Learner Account"
            : "Reset Your Password"}
      </h2>

      <p>
        {mode === "forgot"
          ? "Enter your registered email address and we'll send you a password-reset link."
          : mode === "signin"
            ? "Welcome back. Continue your learning journey."
            : "Create your CloudAce AI learner account."}
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="learner-email">Email address</label>
        <input
          id="learner-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          style={{
            display: "block",
            boxSizing: "border-box",
            width: "100%",
            margin: "8px 0 16px",
            padding: 12,
          }}
        />

        {mode !== "forgot" && (
          <>
            <label htmlFor="learner-password">Password</label>
            <input
              id="learner-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              minLength={6}
              required
              style={{
                display: "block",
                boxSizing: "border-box",
                width: "100%",
                margin: "8px 0 16px",
                padding: 12,
              }}
            />
          </>
        )}

        <button type="submit" disabled={busy}>
          {busy
            ? "Please wait..."
            : mode === "signin"
              ? "Sign In"
              : mode === "signup"
                ? "Create Account"
                : "Send Reset Link"}
        </button>
      </form>

      <p role="status" aria-live="polite">
        {message}
      </p>

      {mode === "signin" && (
        <p>
          <button type="button" onClick={() => changeMode("forgot")}>
            Forgot password?
          </button>
        </p>
      )}

      {mode === "forgot" && (
        <p>
          <button type="button" onClick={() => changeMode("signin")}>
            Back to Sign In
          </button>
        </p>
      )}

      {mode !== "forgot" && (
        <p>
          <button
            type="button"
            onClick={() =>
              changeMode(mode === "signin" ? "signup" : "signin")
            }
          >
            {mode === "signin"
              ? "New learner? Create an account"
              : "Already registered? Sign in"}
          </button>
        </p>
      )}
    </main>
  );
}
