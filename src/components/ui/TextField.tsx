import { useId, useState, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  invalid?: boolean;
  hint?: string;
}

export function TextField({ label, invalid, hint, className = "", ...rest }: Props) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={`input ${invalid ? "invalid" : ""} ${className}`} aria-invalid={invalid || undefined} {...rest} />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function PasswordField({ label, invalid, ...rest }: Omit<Props, "type">) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input id={id} className={`input ${invalid ? "invalid" : ""}`} type={show ? "text" : "password"} aria-invalid={invalid || undefined} {...rest} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

/** Six-digit numeric code input. */
export function OtpField({ onValueChange, ...rest }: Omit<Props, "onChange" | "label"> & { label?: string; onValueChange: (v: string) => void }) {
  return (
    <TextField
      label="Verification code"
      className="otp"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      placeholder="······"
      onChange={(e) => onValueChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      {...rest}
    />
  );
}
