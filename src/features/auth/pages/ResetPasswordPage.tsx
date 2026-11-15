import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { OtpField, PasswordField, TextField } from "@/components/ui/TextField";
import { Link, navigate } from "@/app/router";
import { setFlash, takeFlash } from "@/lib/flash";
import { isEmail, isOtp, isPasswordLength, PASSWORD_MESSAGE } from "@/lib/validators";
import { useSubmit } from "@/lib/useSubmit";
import { authApi } from "../authApi";
import { RESET_EMAIL_KEY } from "./ForgotPasswordPage";

export function ResetPasswordPage() {
  const [notice] = useState(takeFlash);
  const [email, setEmail] = useState(() => sessionStorage.getItem(RESET_EMAIL_KEY) ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const { busy, error, fields, setError, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email.trim())) return setError("Enter a valid email address.");
    if (!isOtp(otp)) return setError("Enter the 6-digit code.");
    if (!isPasswordLength(password)) return setError(PASSWORD_MESSAGE);
    void run(async () => {
      await authApi.resetPassword(email.trim(), otp, password);
      sessionStorage.removeItem(RESET_EMAIL_KEY);
      setFlash("Password updated. Sign in with your new password.");
      navigate("/login");
    });
  };

  return (
    <AuthLayout footer={<><Link to="/forgot">Send a new code</Link> &middot; <Link to="/login">Back to sign in</Link></>}>
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Choose a new password</h1>
        <p className="sub">Enter the code from your email and a new password.</p>
        {notice && <Alert kind="ok">{notice}</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        <TextField label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <OtpField autoFocus={!!email} value={otp} onValueChange={setOtp} />
        <PasswordField label="New password" autoComplete="new-password" value={password} invalid={"newPassword" in fields} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" loading={busy}>{busy ? "Resetting" : "Reset password"}</Button>
      </form>
    </AuthLayout>
  );
}
