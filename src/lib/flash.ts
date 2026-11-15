/** One-shot message handed from one screen to the next (never persisted). */
let message: string | null = null;
export const setFlash = (m: string): void => { message = m; };
export const takeFlash = (): string | null => { const m = message; message = null; return m; };
