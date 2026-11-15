import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { Link, navigate } from "@/app/router";
import { takeFlash } from "@/lib/flash";
import { isEmail } from "@/lib/validators";
import { useSubmit } from "@/lib/useSubmit";
import { env } from "@/config/env";
import { useAuth } from "../AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const [notice] = useState(takeFlash);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { busy, error, setError, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email.trim())) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    void run(async () => {
      const s = await login(email.trim(), password);
      navigate(s.verified ? "/account" : "/verify");
    });
  };

  return (
    <AuthLayout footer={<>Don't have an account? <Link to="/register">Sign up</Link></>}>
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Sign in</h1>
        <p className="sub">to continue to {env.appName}</p>
        {notice && <Alert kind="ok">{notice}</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        <TextField label="Email address" type="email" autoComplete="username" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="row"><span /><Link to="/forgot">Forgot password?</Link></div>
        <Button type="submit" loading={busy}>{busy ? "Signing in" : "Continue"}</Button>
      </form>
    </AuthLayout>
  );
}
