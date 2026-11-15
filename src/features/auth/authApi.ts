import { request } from "@/lib/http";
import type { LoginResponse, Profile } from "./types";

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/login", { method: "POST", body: { email, password } }),
  register: (name: string, email: string, password: string) =>
    request<Profile>("/register", { method: "POST", body: { name, email, password } }),
  profile: () => request<Profile>("/profile", { auth: true }),
  sendOtp: () => request<unknown>("/send-otp", { method: "POST", auth: true }),
  verifyOtp: (otp: string) => request<unknown>("/verify-otp", { method: "POST", auth: true, body: { otp } }),
  sendResetOtp: (email: string) => request<unknown>("/send-reset-otp", { method: "POST", query: { email } }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    request<unknown>("/reset-password", { method: "POST", body: { email, otp, newPassword } }),
  logout: () => request<unknown>("/logout", { method: "POST", auth: true }),
};
