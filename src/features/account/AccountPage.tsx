import { useEffect, useState } from "react";
import { Brand, Legal } from "@/components/layout/parts";
import { Alert } from "@/components/ui/Alert";
import { Button, LinkButton } from "@/components/ui/Button";
import { Link } from "@/app/router";
import { ApiError } from "@/lib/http";
import { takeFlash } from "@/lib/flash";
import { env } from "@/config/env";
import { useAuth } from "@/features/auth/AuthContext";
import { authApi } from "@/features/auth/authApi";
import type { Profile } from "@/features/auth/types";

export function AccountPage() {
  const { session, logout, markVerified } = useAuth();
  const [notice] = useState(takeFlash);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    authApi.profile()
      .then((p) => { if (!cancelled) { setProfile(p); if (p.isAccountVerified) markVerified(); } })
      .catch((e: unknown) => {
        // 401 is handled globally (session cleared, redirect to sign-in)
        if (!cancelled && !(e instanceof ApiError && e.status === 401)) setError(e instanceof ApiError ? e.message : "Couldn't load your profile.");
      });
    return () => { cancelled = true; };
  }, [markVerified]);

  return (
    <main className="page">
      <div className="topbar">
        <div className="brand"><Brand />{env.appName}</div>
        <div className="who"><span>{session?.email}</span><LinkButton onClick={() => void logout()}>Sign out</LinkButton></div>
      </div>
      <section className="card wide">
        <div className="sect-h">
          <h1>Account</h1>
          {profile && <span className={`badge ${profile.isAccountVerified ? "ok" : "warn"}`}>{profile.isAccountVerified ? "Verified" : "Unverified"}</span>}
        </div>
        {notice && <Alert kind="ok">{notice}</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        {!profile && !error && (<><div className="skeleton" style={{ width: "60%", margin: "12px 0" }} /><div className="skeleton" style={{ width: "40%" }} /></>)}
        {profile && (
          <>
            {!profile.isAccountVerified && <Alert kind="warn">Your email address isn't verified yet. <Link to="/verify">Verify now</Link></Alert>}
            <div className="kv">
              <div>Name</div><div>{profile.name}</div>
              <div>Email</div><div>{profile.email}</div>
              <div>User ID</div><div className="mono">{profile.userId}</div>
              <div>Email status</div><div>{profile.isAccountVerified ? "Verified" : "Not verified"}</div>
            </div>
            <div style={{ marginTop: 22 }}><Button variant="secondary" inline onClick={() => void logout()}>Sign out</Button></div>
          </>
        )}
      </section>
      <Legal />
    </main>
  );
}
