const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBusinessData(data) {
  const errors = {};

  if (!data.companyName?.trim() || data.companyName.trim().length < 3) {
    errors.companyName = "El nombre de la empresa debe tener al menos 3 caracteres";
  }

  if (!data.nit?.trim() || !/^\d{9,12}$/.test(data.nit.replace(/\D/g, ""))) {
    errors.nit = "El NIT debe contener entre 9 y 12 dígitos numéricos";
  }

  if (!data.contactName?.trim() || data.contactName.trim().length < 3) {
    errors.contactName = "El nombre del contacto es obligatorio";
  }

  if (!data.email?.trim() || !EMAIL_REGEX.test(data.email)) {
    errors.email = "Ingresa un correo electrónico válido";
  }

  if (!data.phone?.trim() || data.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "El teléfono debe tener al menos 10 dígitos";
  }

  if (!data.address?.trim() || data.address.trim().length < 10) {
    errors.address = "La dirección debe tener al menos 10 caracteres";
  }

  if (!data.industry?.trim()) {
    errors.industry = "Selecciona un sector empresarial";
  }

  if (!data.employees || Number(data.employees) < 1) {
    errors.employees = "Indica el número de empleados";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCredentials(email, password, storedUser) {
  if (!storedUser) {
    return { isValid: false, error: "No existe una cuenta registrada con ese correo" };
  }

  if (storedUser.email !== email.trim().toLowerCase()) {
    return { isValid: false, error: "Correo o contraseña incorrectos" };
  }

  if (storedUser.password !== password) {
    return { isValid: false, error: "Correo o contraseña incorrectos" };
  }

  return { isValid: true };
}

export const INDUSTRIES = [
  "Banca y finanzas",
  "Seguros",
  "Comercio",
  "Manufactura",
  "Tecnología",
  "Salud",
  "Otro",
];
