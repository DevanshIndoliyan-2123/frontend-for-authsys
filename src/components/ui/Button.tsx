import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary";
  inline?: boolean;
}

export function Button({ loading, variant = "primary", inline, className = "", children, disabled, ...rest }: Props) {
  const cls = ["btn", variant === "secondary" && "secondary", inline && "inline", className].filter(Boolean).join(" ");
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="spin" />}
      {children}
    </button>
  );
}

export function LinkButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className="link-btn" {...props} />;
}
