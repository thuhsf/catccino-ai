import axios from "axios";

const AUTH_STORAGE_KEY = "catccino:auth";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.request && !error.response
        ? "Não foi possível conectar ao gateway. Verifique se o backend está no ar e a VITE_API_BASE_URL configurada."
        : error.message);
    return Promise.reject(new Error(message));
  },
);

export { AUTH_STORAGE_KEY };
