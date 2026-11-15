import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { Link, navigate } from "@/app/router";
import { setFlash } from "@/lib/flash";
import { isEmail, isPasswordLength, PASSWORD_MESSAGE } from "@/lib/validators";
import { useSubmit } from "@/lib/useSubmit";
import { env } from "@/config/env";
import { useAuth } from "../AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { busy, error, fields, setError, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Enter your name.");
    if (!isEmail(email.trim())) return setError("Enter a valid email address.");
    if (!isPasswordLength(password)) return setError(PASSWORD_MESSAGE);
    void run(async () => {
      await register(name.trim(), email.trim(), password);
      setFlash(`We sent a 6-digit code to ${email.trim()}.`);
      navigate("/verify");
    });
  };

  return (
    <AuthLayout footer={<>Already have an account? <Link to="/login">Sign in</Link></>}>
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Create your account</h1>
        <p className="sub">Get started with {env.appName}</p>
        {error && <Alert kind="error">{error}</Alert>}
        <TextField label="Full name" autoComplete="name" autoFocus value={name} invalid={"name" in fields} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email address" type="email" autoComplete="email" value={email} invalid={"email" in fields} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label="Password" autoComplete="new-password" value={password} invalid={"password" in fields} onChange={(e) => setPassword(e.target.value)} />
        <p className="hint" style={{ margin: "-8px 0 18px" }}>Use 8 or more characters.</p>
        <Button type="submit" loading={busy}>{busy ? "Creating account" : "Create account"}</Button>
      </form>
    </AuthLayout>
  );
}
