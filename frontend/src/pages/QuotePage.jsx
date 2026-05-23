import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { PLANS } from "../constants/plans";
import { validateBusinessData } from "../utils/validation";
import { getOnboardingData, saveOnboardingData } from "../utils/storage";
import { formatCurrency } from "../utils/format";

function QuotePage() {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const onboarding = getOnboardingData();
  const business = onboarding.business;
  const plan = PLANS[onboarding.planId];

  useEffect(() => {
    if (!business || !plan) {
      navigate("/registro");
      return;
    }
    const result = validateBusinessData(business);
    setValidationErrors(result.errors);
    setIsValid(result.isValid);
  }, [business, plan, navigate]);

  if (!business || !plan) return null;

  function handleAccept(accepted) {
    if (!isValid) return;
    if (!accepted) {
      navigate("/");
      return;
    }
    saveOnboardingData({ quoteAccepted: true });
    navigate("/registro/pago");
  }

  return (
    <OnboardingLayout
      title="Cotización"
      subtitle="Revisa el precio y beneficios de tu plan seleccionado"
      step={3}
      totalSteps={5}
    >
      {!isValid ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium mb-2">
                Datos empresariales inválidos
              </p>
              <p className="text-sm text-gray-400 mb-3">
                Corrige los siguientes errores para continuar:
              </p>
              <ul className="space-y-1">
                {Object.values(validationErrors).map((err) => (
                  <li key={err} className="text-sm text-red-400">• {err}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Corregir datos empresariales
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#0a0a0f] border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Empresa</p>
            <p className="text-white font-medium">{business.companyName}</p>
            <p className="text-gray-500 text-sm mt-1">NIT: {business.nit}</p>
          </div>

          <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-gray-400 text-sm mb-1">Plan seleccionado</p>
            <p className="text-white text-xl font-bold">{plan.name}</p>
            <p className="text-blue-400 text-3xl font-bold mt-2">
              {formatCurrency(plan.price)}
              <span className="text-sm text-gray-400 font-normal">/mes</span>
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-3">Beneficios incluidos:</p>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAccept(false)}
              className="flex-1 py-3 border border-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              No, cancelar
            </button>
            <button
              type="button"
              onClick={() => handleAccept(true)}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Sí, aceptar plan
            </button>
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
}

export default QuotePage;
