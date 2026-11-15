import type { ReactElement } from "react";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { AccountPage } from "@/features/account/AccountPage";

export interface AppRoute {
  path: string;
  title: string;
  element: ReactElement;
  /** public: anyone · guest: signed-out only · private: signed-in only */
  access: "public" | "guest" | "private";
}

export const DEFAULT_PUBLIC = "/login";
export const DEFAULT_PRIVATE = "/account";

// Add a new screen by adding one line here.
export const routes: AppRoute[] = [
  { path: "/login", title: "Sign in", element: <LoginPage />, access: "guest" },
  { path: "/register", title: "Sign up", element: <RegisterPage />, access: "guest" },
  { path: "/forgot", title: "Reset password", element: <ForgotPasswordPage />, access: "public" },
  { path: "/reset", title: "Reset password", element: <ResetPasswordPage />, access: "public" },
  { path: "/verify", title: "Verify email", element: <VerifyEmailPage />, access: "private" },
  { path: "/account", title: "Account", element: <AccountPage />, access: "private" },
];
