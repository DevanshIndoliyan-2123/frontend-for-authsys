export interface LoginResponse { email: string; token: string; isAccountVerified: boolean }
export interface Profile { userId: string; name: string; email: string; isAccountVerified: boolean }
export interface Session { token: string; email: string; verified: boolean }
