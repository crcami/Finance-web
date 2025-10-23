import { api, ApiEnvelope } from "@/lib/http";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string; full_name?: string }; // 👈 snake_case no payload
export type LoginResponse = { accessToken: string; refreshToken: string; userId?: string };
export type SessionResponse = { authenticated: boolean; userId: string | null };

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function persistTokens(tokens: Pick<LoginResponse, "accessToken" | "refreshToken">) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function register(request: RegisterRequest): Promise<LoginResponse> {
  const { data } = await api.post<ApiEnvelope<LoginResponse>>("/auth/register", request);
  persistTokens(data.data);
  return data.data;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<ApiEnvelope<LoginResponse>>("/auth/login", request);
  persistTokens(data.data);
  return data.data;
}

export async function getSession(): Promise<SessionResponse> {
  const { data } = await api.get<ApiEnvelope<SessionResponse>>("/auth/session");
  return data.data;
}

export async function Logout(): Promise<void> {
  try {
    await api.post<ApiEnvelope<void>>("/auth/logout");
  } finally {
    clearTokens();
  }
}
