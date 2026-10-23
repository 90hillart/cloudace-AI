
import { useState, type FormEvent } from "react";
import { signIn, signUp } from "./lib/auth";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (mode === "signup") {
        const data = await signUp(email, password);

        setMessage(
          data.session
            ? "Account created successfully."
            : "Account created. Check your email if confirmation is required."
        );
      } else {
        await signIn(email, password);
        setMessage("Signed in successfully.");
      }
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Authentication failed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 24 }}>
      <h1>CloudAce AI</h1>
      <h2>
        {mode === "signin" ? "Learner Sign In" : "Create Learner Account"}
      </h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="learner-email">Email address</label>
        <input
          id="learner-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          style={{ display: "block", width: "100%", marginBottom: 16 }}
        />

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
          style={{ display: "block", width: "100%", marginBottom: 16 }}
        />

        <button type="submit" disabled={busy}>
          {busy
            ? "Please wait..."
            : mode === "signin"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      <p role="status">{message}</p>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage("");
        }}
      >
        {mode === "signin"
          ? "New learner? Create an account"
          : "Already registered? Sign in"}
      </button>
    </main>
  );
}
