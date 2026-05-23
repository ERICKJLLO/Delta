import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Lock,
  Bot,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import { RISK_LEVELS, getAIRecommendations } from "../services/riskEngine";

const LEVEL_ICONS = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: AlertTriangle,
  low: Info,
};

function RiskProtocolPanel({ risk, onResolve, onDismiss }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("alert");
  const [threatConfirmed, setThreatConfirmed] = useState(null);
  const styles = RISK_LEVELS[risk.level];
  const Icon = LEVEL_ICONS[risk.level];
  const isCriticalOrHigh = risk.level === "critical" || risk.level === "high";
  const recommendations = getAIRecommendations(risk.level);

  function finish(actions) {
    onResolve(actions);
    setStep("done");
  }

  function goToDeltaAI() {
    onResolve({ viewedAI: true });
    navigate("/dashboard/delta-ai", { state: { risk } });
  }

  if (step === "done") return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-lg rounded-xl border ${styles.border} ${styles.bg} p-6 backdrop-blur-sm`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${styles.color}`} />
            <div>
              <p className={`text-xs font-medium uppercase ${styles.color}`}>
                Riesgo {styles.label}
              </p>
              <h3 className="text-white font-medium">{risk.title}</h3>
            </div>
          </div>
          {!isCriticalOrHigh && (
            <button type="button" onClick={onDismiss} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4">{risk.description}</p>
        <p className="text-gray-500 text-xs mb-4">Anomalía: {risk.anomaly}</p>

        {step === "alert" && isCriticalOrHigh && (
          <div className="space-y-3">
            {risk.level === "critical" && (
              <p className="text-red-400 text-sm font-medium">
                Protocolo de seguridad activado — Analista de seguridad notificado
              </p>
            )}
            {risk.level === "high" && (
              <p className="text-orange-400 text-sm font-medium">
                Alerta urgente generada — Analista de seguridad notificado
              </p>
            )}
            <button
              type="button"
              onClick={() => setStep("evaluate")}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium"
            >
              Evaluar incidente
            </button>
          </div>
        )}

        {step === "alert" && !isCriticalOrHigh && (
          <div className="space-y-3">
            <p className={`text-sm ${styles.color}`}>
              {risk.level === "medium"
                ? "Alerta preventiva — Dashboard actualizado"
                : "Alerta informativa — Dashboard actualizado"}
            </p>
            <button
              type="button"
              onClick={goToDeltaAI}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Consultar Delta AI
            </button>
            <button
              type="button"
              onClick={() => finish({ reportGenerated: true })}
              className="w-full py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generar reporte y guardar historial
            </button>
          </div>
        )}

        {step === "evaluate" && (
          <div className="space-y-3">
            <p className="text-white text-sm font-medium">¿Amenaza confirmada?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setThreatConfirmed(true);
                  setStep("measures");
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
              >
                Sí, confirmada
              </button>
              <button
                type="button"
                onClick={() => {
                  setThreatConfirmed(false);
                  finish({ threatConfirmed: false });
                }}
                className="flex-1 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm"
              >
                No, falsa alarma
              </button>
            </div>
          </div>
        )}

        {step === "measures" && threatConfirmed && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Medidas aplicadas: accesos y transacciones bloqueados
              </p>
            </div>
            <button
              type="button"
              onClick={goToDeltaAI}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Acceder a Delta AI
            </button>
            <button
              type="button"
              onClick={() => finish({ threatConfirmed: true, measuresApplied: true, reportGenerated: true })}
              className="w-full py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Generar reporte y finalizar
            </button>
          </div>
        )}

        {step === "alert" && isCriticalOrHigh && (
          <ul className="mt-4 space-y-1">
            {recommendations.slice(0, 2).map((rec) => (
              <li key={rec} className="text-xs text-gray-500">• {rec}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RiskProtocolPanel;
