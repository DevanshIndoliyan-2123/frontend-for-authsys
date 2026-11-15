// Mirrors the backend's validation rules (ProfileRequest / ResetPasswordRequest).
export const EMAIL_RE = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const isEmail = (v: string): boolean => EMAIL_RE.test(v);
export const isOtp = (v: string): boolean => /^\d{6}$/.test(v);
export const isPasswordLength = (v: string): boolean => v.length >= 8 && v.length <= 72;
export const PASSWORD_MESSAGE = "Password must be between 8 and 72 characters long.";
