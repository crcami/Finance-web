import axios from "axios";

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


let refreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const rt = localStorage.getItem("refresh_token");
      if (!rt) return Promise.reject(error);

      if (!refreshing) {
        refreshing = true;
        try {
          const { data } = await api.post<ApiEnvelope<{ accessToken: string; refreshToken?: string }>>(
            "/auth/refresh",
            { refreshToken: rt }
          );
          localStorage.setItem("access_token", data.data.accessToken);
          if (data.data.refreshToken) localStorage.setItem("refresh_token", data.data.refreshToken);
          queue.splice(0).forEach((cb) => cb(data.data.accessToken));
        } finally {
          refreshing = false;
        }
      }

      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }
    return Promise.reject(error);
  }
);
