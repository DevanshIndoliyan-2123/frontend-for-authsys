export const env = {
  appName: "Devansh Auth",
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, ""),
} as const;
