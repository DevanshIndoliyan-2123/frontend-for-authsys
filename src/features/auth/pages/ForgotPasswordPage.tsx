import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Link, navigate } from "@/app/router";
import { setFlash } from "@/lib/flash";
import { isEmail } from "@/lib/validators";
import { useSubmit } from "@/lib/useSubmit";
import { authApi } from "../authApi";

export const RESET_EMAIL_KEY = "reset.email";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { busy, error, setError, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!isEmail(value)) return setError("Enter a valid email address.");
    void run(async () => {
      await authApi.sendResetOtp(value);
      sessionStorage.setItem(RESET_EMAIL_KEY, value);
      setFlash(`If an account exists for ${value}, a code is on its way.`);
      navigate("/reset");
    });
  };

  return (
    <AuthLayout footer={<Link to="/login">Back to sign in</Link>}>
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Reset your password</h1>
        <p className="sub">Enter your email address and we'll send you a code to reset your password.</p>
        {error && <Alert kind="error">{error}</Alert>}
        <TextField label="Email address" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" loading={busy}>{busy ? "Sending" : "Send code"}</Button>
      </form>
    </AuthLayout>
  );
}
