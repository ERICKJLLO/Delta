import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Middlewares
app.use(cors({
  origin: '*', // Permitir cualquier origen por ahora (o http://localhost:5173 para restringir a React)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logger simple para ver peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Ruta de diagnóstico simple
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Delta Backend API' 
  });
});

// Ruta fallback para 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en la API de Delta' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[Error de Servidor]', err);
  res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`   DELTA BACKEND API RUNNING SUCCESSFULLY`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Environment variables loaded`);
  console.log(`=========================================`);
});
