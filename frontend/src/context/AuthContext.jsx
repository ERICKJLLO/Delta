import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Usuario predeterminado — elimina la necesidad de login.
  // Atención: esto deja la app sin autenticación. Usar solo si
  // realmente quieres que el dashboard sea público.
  const [user, setUser] = useState({ name: "Usuario Predeterminado", email: "default@delta.local" });
  const [loading, setLoading] = useState(false);

  /**
   * Iniciar sesión llamando a la API
   */
  async function login(email, password) {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Registrar una nueva empresa y realizar login directo con el token recibido
   */
  async function register(userData) {
    try {
      const data = await api.register(userData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Login directo con token (útil para el flujo de Onboarding tras validación y pago)
   */
  function loginWithToken(token, userData) {
    localStorage.setItem("delta_token", token);
    setUser(userData);
  }

  /**
   * Cerrar sesión limpiando el token de API y la variable de estado
   */
  function logout() {
    api.logout();
    // Mantener al usuario por defecto incluso si se llama logout en este modo
    setUser({ name: "Usuario Predeterminado", email: "default@delta.local" });
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        loginWithToken, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

