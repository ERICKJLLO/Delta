import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecrettokenkeyforproyectodelta12345';

// POST /api/auth/register - Registrar nueva empresa/usuario
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      company_name,
      nit,
      contact_name,
      phone,
      address,
      industry,
      employees,
      plan_id
    } = req.body;

    // Validar campos requeridos
    if (!email || !password || !company_name || !nit || !contact_name) {
      return res.status(400).json({ 
        error: 'Por favor complete todos los campos obligatorios: email, contraseña, nombre de empresa, nit, y nombre de contacto.' 
      });
    }

    // Verificar si el correo ya está registrado
    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario en base de datos
    const newUser = db.createUser({
      email,
      password_hash,
      company_name,
      nit,
      contact_name,
      phone,
      address,
      industry,
      employees,
      plan_id: plan_id || 'basic',
      activated_at: new Date().toISOString()
    });

    // Generar Token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, plan_id: newUser.plan_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar JWT y datos de usuario sin el hash de contraseña
    const { password_hash: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error del servidor al registrar el usuario.' });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor, ingrese correo y contraseña.' });
    }

    // Buscar usuario por correo
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas. El usuario no existe.' });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, plan_id: user.plan_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar JWT y datos de usuario
    const { password_hash: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

// GET /api/auth/me - Obtener información del usuario autenticado actual
router.get('/me', requireAuth, (req, res) => {
  // El usuario ya fue inyectado por el middleware requireAuth en req.user
  res.json({ user: req.user });
});

export default router;
