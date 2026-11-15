import type { ReactNode } from "react";

export function Alert({ kind, children }: { kind: "error" | "ok" | "warn"; children: ReactNode }) {
  return <div className={`alert ${kind}`} role={kind === "error" ? "alert" : "status"}>{children}</div>;
}
