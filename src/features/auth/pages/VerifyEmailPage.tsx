import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert } from "@/components/ui/Alert";
import { Button, LinkButton } from "@/components/ui/Button";
import { OtpField } from "@/components/ui/TextField";
import { navigate } from "@/app/router";
import { setFlash, takeFlash } from "@/lib/flash";
import { isOtp } from "@/lib/validators";
import { useSubmit } from "@/lib/useSubmit";
import { useAuth } from "../AuthContext";
import { authApi } from "../authApi";

export function VerifyEmailPage() {
  const { session, logout, markVerified } = useAuth();
  const [notice, setNotice] = useState<string | null>(takeFlash);
  const [otp, setOtp] = useState("");
  const [cooling, setCooling] = useState(false);
  const { busy, error, setError, run } = useSubmit();
  const resend = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isOtp(otp)) return setError("Enter the 6-digit code.");
    void run(async () => {
      await authApi.verifyOtp(otp);
      markVerified();
      setFlash("Your email is verified.");
      navigate("/account");
    });
  };

  const onResend = () => {
    setCooling(true);
    setTimeout(() => setCooling(false), 30_000); // soft cooldown; the server rate-limits too
    void resend.run(async () => {
      await authApi.sendOtp();
      setNotice("A new code is on its way.");
    });
  };

  return (
    <AuthLayout footer={<LinkButton onClick={() => void logout()}>Sign out</LinkButton>}>
      <form className="card" onSubmit={onSubmit} noValidate>
        <h1>Verify your email</h1>
        <p className="sub">Enter the 6-digit code we sent to <b>{session?.email}</b>.</p>
        {notice && <Alert kind="ok">{notice}</Alert>}
        {(error ?? resend.error) && <Alert kind="error">{error ?? resend.error}</Alert>}
        <OtpField autoFocus value={otp} invalid={!!error} onValueChange={setOtp} />
        <p className="note">
          <strong>Can't find the email?</strong> Please check your <strong>Spam</strong> or <strong>Junk</strong> folder in Gmail. The code can take a minute to arrive.
        </p>
        <Button type="submit" loading={busy}>{busy ? "Verifying" : "Verify"}</Button>
        <div className="foot" style={{ marginTop: 18 }}>
          Didn't get it? <LinkButton disabled={cooling} onClick={onResend}>Send a new code</LinkButton>
        </div>
      </form>
    </AuthLayout>
  );
}