import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { configureHttp } from "@/lib/http";
import { setFlash } from "@/lib/flash";
import { authApi } from "./authApi";
import { sessionStorageApi } from "./storage";
import type { Session } from "./types";

interface AuthContextValue {
  session: Session | null;
  login: (email: string, password: string) => Promise<Session>;
  register: (name: string, email: string, password: string) => Promise<Session>;
  logout: () => Promise<void>;
  markVerified: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// The HTTP layer reads the token from storage on every call.
configureHttp({ getToken: () => sessionStorageApi.get()?.token ?? null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => sessionStorageApi.get());

  const save = useCallback((s: Session | null) => {
    if (s) sessionStorageApi.set(s); else sessionStorageApi.clear();
    setSession(s);
  }, []);

  useEffect(() => {
    configureHttp({
      onUnauthorized: () => { setFlash("Your session expired. Please sign in again."); save(null); },
    });
  }, [save]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await authApi.login(email, password);
    const s: Session = { token: r.token, email: r.email, verified: r.isAccountVerified };
    save(s);
    return s;
  }, [save]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authApi.register(name, email, password);
    // The backend emails the OTP on registration but needs a token to verify it, so sign in right away.
    return login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* token is dropped locally either way */ }
    setFlash("You've been signed out.");
    save(null);
  }, [save]);

  const markVerified = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, verified: true };
      sessionStorageApi.set(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ session, login, register, logout, markVerified }), [session, login, register, logout, markVerified]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
