import type { ReactNode } from "react";
import { env } from "@/config/env";
import { Brand, Legal } from "./parts";

/** Centered card used by the sign-in style screens. */
export function AuthLayout({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="page">
      <div className="brand"><Brand />{env.appName}</div>
      {children}
      {footer && <div className="foot">{footer}</div>}
      <Legal />
    </main>
  );
}
