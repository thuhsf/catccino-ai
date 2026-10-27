import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/services.js";
import { AUTH_STORAGE_KEY } from "../api/client.js";

const AuthContext = createContext(null);

function readStoredSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return { token: null, customer: null };
  try {
    return JSON.parse(raw);
  } catch {
    return { token: null, customer: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    if (session.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    setSession({ token: res.token, customer: res.customer });
    return res.customer;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    setSession({ token: res.token, customer: res.customer });
    return res.customer;
  }, []);

  const logout = useCallback(() => {
    setSession({ token: null, customer: null });
  }, []);

  const value = {
    token: session.token,
    customer: session.customer,
    isAuthenticated: Boolean(session.token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
