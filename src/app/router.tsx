import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes } from "react";

// Hash routing keeps static hosting trivial (no rewrite rules needed).
// To switch to react-router later, only this file and routes.tsx need to change.
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const snapshot = () => window.location.hash.replace(/^#/, "").split("?")[0] || "/";

export const usePath = (): string => useSyncExternalStore(subscribe, snapshot);
export const navigate = (to: string): void => { window.location.hash = to; };

export function Link({ to, ...rest }: { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return <a href={`#${to}`} {...rest} />;
}

export function Redirect({ to }: { to: string }) {
  useEffect(() => { navigate(to); }, [to]);
  return null;
}
