import { createContext, useContext, useState, useEffect } from "react";
import {
  getSession,
  saveSession,
  clearSession,
  getStoredUser,
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    const stored = getStoredUser();
    if (session && stored && session.email === stored.email) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  function login(email, password) {
    const stored = getStoredUser();
    if (!stored || stored.email !== email || stored.password !== password) {
      return false;
    }
    saveSession({ email: stored.email, loggedInAt: new Date().toISOString() });
    setUser(stored);
    return true;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
