import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { PLAN_LIST } from "../constants/plans";
import { getOnboardingData, saveOnboardingData } from "../utils/storage";

function PlanSelectionPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(getOnboardingData().planId || "");
  const [error, setError] = useState("");

  function handleContinue() {
    if (!selected) {
      setError("Selecciona un plan para continuar");
      return;
    }
    saveOnboardingData({ planId: selected });
    navigate("/registro/cotizacion");
  }

  return (
    <OnboardingLayout
      title="Selecciona tu plan"
      subtitle="Elige el plan que mejor se adapte a las necesidades de tu empresa"
      step={2}
      totalSteps={5}
    >
      <div className="space-y-4">
        {PLAN_LIST.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => {
              setSelected(plan.id);
              setError("");
            }}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              selected === plan.id
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-800 hover:border-gray-700 bg-[#0a0a0f]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-medium text-lg">{plan.name}</h3>
                <p className="text-blue-400 text-xl font-bold mt-1">
                  {plan.priceLabel}
                  <span className="text-sm text-gray-400 font-normal">{plan.period}</span>
                </p>
              </div>
              {selected === plan.id && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <ul className="space-y-1.5">
              {plan.features.map((feature) => (
                <li key={feature} className="text-sm text-gray-400 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="flex-1 py-3 border border-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Continuar — Ver cotización
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}

export default PlanSelectionPage;
