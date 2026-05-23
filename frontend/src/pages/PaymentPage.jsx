import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { PLANS } from "../constants/plans";
import { getOnboardingData, activateAccount } from "../utils/storage";
import { formatCurrency } from "../utils/format";

function PaymentPage() {
  const navigate = useNavigate();
  const onboarding = getOnboardingData();
  const business = onboarding.business;
  const plan = PLANS[onboarding.planId];
  const [cardNumber, setCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  if (!business || !plan || !onboarding.quoteAccepted) {
    navigate("/registro");
    return null;
  }

  async function handlePayment(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Ingresa un número de tarjeta válido (16 dígitos)");
      return;
    }

    setStatus("processing");

    await new Promise((r) => setTimeout(r, 1500));

    const lastDigit = parseInt(cardNumber.replace(/\D/g, "").slice(-1), 10);
    if (lastDigit % 2 !== 0) {
      setStatus("error");
      setError("Pago rechazado. Verifica los datos de tu tarjeta e intenta nuevamente.");
      return;
    }

    activateAccount({ business, plan, password });
    setStatus("success");
    setTimeout(() => navigate("/login", { state: { registered: true } }), 2000);
  }

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <OnboardingLayout
      title="Procesar pago"
      subtitle={`Total a pagar: ${formatCurrency(plan.price)}/mes`}
      step={4}
      totalSteps={5}
    >
      {status === "success" ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-white text-xl font-medium mb-2">Pago aprobado</p>
          <p className="text-gray-400">Cuenta creada y servicio activado. Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 rounded-lg bg-[#0a0a0f] border border-gray-800 mb-2">
            <p className="text-sm text-gray-400">Plan: <span className="text-white">{plan.name}</span></p>
            <p className="text-sm text-gray-400">Empresa: <span className="text-white">{business.companyName}</span></p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Número de tarjeta</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="1234 5678 9012 3456"
                disabled={status === "processing"}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Tarjetas con último dígito par = aprobado (demo)</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Contraseña de acceso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Mínimo 8 caracteres"
              disabled={status === "processing"}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Repite la contraseña"
              disabled={status === "processing"}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {status === "processing" ? "Procesando pago..." : "Pagar y activar servicio"}
          </button>
        </form>
      )}
    </OnboardingLayout>
  );
}

export default PaymentPage;
