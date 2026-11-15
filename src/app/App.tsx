import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { Redirect, usePath } from "./router";
import { routes, DEFAULT_PRIVATE, DEFAULT_PUBLIC } from "./routes";
import { env } from "@/config/env";

function Routes() {
  const path = usePath();
  const { session } = useAuth();
  const route = routes.find((r) => r.path === path);

  useEffect(() => {
    document.title = `${route?.title ?? "Sign in"} · ${env.appName}`;
    window.scrollTo(0, 0);
  }, [route]);

  if (!route) return <Redirect to={session ? DEFAULT_PRIVATE : DEFAULT_PUBLIC} />;
  if (route.access === "private" && !session) return <Redirect to={DEFAULT_PUBLIC} />;
  if (route.access === "guest" && session) return <Redirect to={DEFAULT_PRIVATE} />;
  return route.element;
}

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
