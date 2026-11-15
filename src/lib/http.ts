import { env } from "@/config/env";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface HttpHooks {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

let hooks: HttpHooks = { getToken: () => null, onUnauthorized: () => {} };

/** Lets the auth feature plug into the HTTP layer without this module depending on it. */
export function configureHttp(next: Partial<HttpHooks>): void {
  hooks = { ...hooks, ...next };
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  query?: Record<string, string>;
  /** Send the Bearer token and treat 401 as "session expired". */
  auth?: boolean;
}

interface ErrorBody { message?: string; fields?: Record<string, string> }

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = false } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = hooks.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let url = env.apiBaseUrl + path;
  if (query) url += `?${new URLSearchParams(query).toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const err = (typeof data === "object" && data !== null ? data : {}) as ErrorBody;
    if (res.status === 401 && auth) hooks.onUnauthorized();
    throw new ApiError(res.status, err.message ?? "Something went wrong. Please try again.", err.fields);
  }
  return data as T;
}
