import { env } from "@/config/env";

export function Brand() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1a1f36" />
      <path d="M16 6l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V9z" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Legal() {
  return <div className="legal">&copy; {new Date().getFullYear()} {env.appName}</div>;
}
