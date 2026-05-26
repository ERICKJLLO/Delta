import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determinar la ruta de almacenamiento de la base de datos (archivo JSON)
const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '..', process.env.DB_PATH)
  : path.resolve(__dirname, '../data/users.json');

// Asegurar que el directorio de la base de datos exista
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar el archivo JSON con un arreglo vacío si no existe
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([], null, 2), 'utf-8');
  console.log(`[Database] Creada base de datos JSON vacía en: ${dbPath}`);
} else {
  console.log(`[Database] Utilizando base de datos existente en: ${dbPath}`);
}

// Funciones auxiliares para interactuar con la base de datos
export const getUsers = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer la base de datos:', error);
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error);
    return false;
  }
};

export const findUserByEmail = (email) => {
  if (!email) return null;
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

export const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const createUser = (userData) => {
  const users = getUsers();
  
  // Asignar ID autoincremental
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  
  const newUser = {
    id: nextId,
    email: userData.email,
    password_hash: userData.password_hash,
    company_name: userData.company_name,
    nit: userData.nit,
    contact_name: userData.contact_name,
    phone: userData.phone || '',
    address: userData.address || '',
    industry: userData.industry || '',
    employees: userData.employees ? parseInt(userData.employees) : 0,
    plan_id: userData.plan_id || 'basic',
    activated_at: userData.activated_at || new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  console.log(`[Database] Usuario registrado con éxito: ${newUser.email} (ID: ${newUser.id})`);
  return newUser;
};

// Exportar un objeto por defecto para mayor compatibilidad
export default {
  getUsers,
  saveUsers,
  findUserByEmail,
  findUserById,
  createUser
};
