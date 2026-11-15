import type { Session } from "./types";

const KEY = "auth.session";

export const sessionStorageApi = {
  get(): Session | null {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "null") as Session | null; } catch { return null; }
  },
  set(s: Session): void { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } },
  clear(): void { try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ } },
};
