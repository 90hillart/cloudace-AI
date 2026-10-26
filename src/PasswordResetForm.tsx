
import { useState, type FormEvent } from "react";
import { supabase } from "./lib/supabase";

export default function PasswordResetForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Your new password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setMessage(
        "Your password has been updated. Sign in using your new password."
      );
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Password reset failed. Request a new reset link and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function returnToSignIn() {
    await supabase.auth.signOut();
    window.history.replaceState({}, "", window.location.pathname);
    window.location.reload();
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
      <h2>Choose a New Password</h2>
      <p>Use a strong password you have not used elsewhere.</p>

      {!success && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              display: "block",
              boxSizing: "border-box",
              width: "100%",
              margin: "8px 0 16px",
              padding: 12,
            }}
          />

          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            style={{
              display: "block",
              boxSizing: "border-box",
              width: "100%",
              margin: "8px 0 16px",
              padding: 12,
            }}
          />

          <button type="submit" disabled={busy}>
            {busy ? "Updating password..." : "Update Password"}
          </button>
        </form>
      )}

      <p role="status" aria-live="polite">{message}</p>

      {success && (
        <button type="button" onClick={() => void returnToSignIn()}>
          Return to Sign In
        </button>
      )}
    </main>
  );
}
