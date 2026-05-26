import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Intentar restaurar sesión al montar el componente
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = api.getToken();
        if (token) {
          const response = await api.getMe();
          if (response && response.user) {
            setUser(response.user);
          } else {
            // Token inválido o expirado
            api.logout();
          }
        }
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        api.logout();
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

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
    setUser(null);
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

