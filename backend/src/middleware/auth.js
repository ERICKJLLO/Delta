import jwt from 'jsonwebtoken';
import db from '../database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecrettokenkeyforproyectodelta12345';

export const requireAuth = (req, res, next) => {
  // Obtener el header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de autenticación válido.' });
  }

  // Extraer token
  const token = authHeader.split(' ')[1];

  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuario en base de datos
    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado en el sistema.' });
    }

    // Guardar información del usuario (sin password_hash) en req.user
    const { password_hash: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error al verificar token JWT:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
