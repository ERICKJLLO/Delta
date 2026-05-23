import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { validateBusinessData, INDUSTRIES } from "../utils/validation";
import { saveOnboardingData } from "../utils/storage";

const emptyForm = {
  companyName: "",
  nit: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  industry: "",
  employees: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = validateBusinessData(form);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    saveOnboardingData({ business: form });
    navigate("/registro/plan");
  }

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <OnboardingLayout
      title="Registro empresarial"
      subtitle="Crea tu cuenta empresarial e ingresa los datos de tu organización"
      step={1}
      totalSteps={5}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre de la empresa" error={errors.companyName}>
            <input name="companyName" value={form.companyName} onChange={handleChange} className={inputClass} placeholder="Ej: Delta Financial S.A.S." />
          </Field>
          <Field label="NIT" error={errors.nit}>
            <input name="nit" value={form.nit} onChange={handleChange} className={inputClass} placeholder="900123456-7" />
          </Field>
          <Field label="Nombre del contacto" error={errors.contactName}>
            <input name="contactName" value={form.contactName} onChange={handleChange} className={inputClass} placeholder="Nombre completo" />
          </Field>
          <Field label="Correo electrónico" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="contacto@empresa.com" />
          </Field>
          <Field label="Teléfono" error={errors.phone}>
            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+57 300 123 4567" />
          </Field>
          <Field label="Número de empleados" error={errors.employees}>
            <input name="employees" type="number" min="1" value={form.employees} onChange={handleChange} className={inputClass} placeholder="50" />
          </Field>
        </div>
        <Field label="Sector empresarial" error={errors.industry}>
          <select name="industry" value={form.industry} onChange={handleChange} className={inputClass}>
            <option value="">Seleccionar sector</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </Field>
        <Field label="Dirección" error={errors.address}>
          <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Calle, ciudad, país" />
        </Field>

        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
          Continuar — Seleccionar plan
        </button>
      </form>
    </OnboardingLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
  );
}

export default RegisterPage;
