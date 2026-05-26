// Client API centralizado para comunicarse con el Delta Backend Express API
const API_URL = 'http://localhost:3001/api';

/**
 * Obtener los headers por defecto, incluyendo el token JWT si está disponible.
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('delta_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Manejo unificado de respuestas fetch
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // Si la API devuelve un mensaje de error, lanzarlo
    throw new Error(data.error || 'Ocurrió un error en la solicitud.');
  }
  return data;
};

export const api = {
  /**
   * Iniciar sesión en el backend
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('delta_token', data.token);
    }
    return data;
  },

  /**
   * Registrar una nueva empresa en el backend
   * @param {object} userData Datos completos de registro (email, password, company_name, nit, etc.)
   */
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('delta_token', data.token);
    }
    return data;
  },

  /**
   * Obtener datos del usuario actual utilizando el token guardado
   */
  getMe: async () => {
    const token = localStorage.getItem('delta_token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  /**
   * Cerrar sesión en el frontend (limpiar token)
   */
  logout: () => {
    localStorage.removeItem('delta_token');
  },

  /**
   * Obtener el token JWT actual
   */
  getToken: () => {
    return localStorage.getItem('delta_token');
  },

  /**
   * Enviar un mensaje a Delta AI y recibir respuesta semántica
   * @param {string} message - El mensaje del usuario
   * @param {string} plan - El plan actual del usuario
   * @param {Array} transactions - Lista de transacciones para contexto
   * @param {object} context - Contexto adicional (riesgo, etc.)
   */
  chatWithAI: async (message, plan = 'basic', transactions = [], context = {}) => {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, plan, transactions, context }),
    });
    return await handleResponse(response);
  }
};

export default api;
