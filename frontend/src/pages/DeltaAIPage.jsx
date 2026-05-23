import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bot, Send, FileText, Sparkles } from "lucide-react";
import { getAIRecommendations, getEventHistory, RISK_LEVELS } from "../services/riskEngine";

function DeltaAIPage() {
  const location = useLocation();
  const contextRisk = location.state?.risk;
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(() => {
    const initial = [
      {
        role: "assistant",
        content:
          "Hola, soy Delta AI. Puedo ayudarte con análisis de riesgos, recomendaciones de seguridad y generación de reportes. ¿En qué puedo asistirte?",
      },
    ];
    if (contextRisk) {
      initial.push({
        role: "assistant",
        content: `He detectado un evento de riesgo ${RISK_LEVELS[contextRisk.level]?.label.toLowerCase()}: "${contextRisk.title}". Aquí tienes mis recomendaciones automáticas.`,
      });
    }
    return initial;
  });

  const history = getEventHistory();
  const recommendations = contextRisk
    ? getAIRecommendations(contextRisk.level)
    : getAIRecommendations("medium");

  function handleSend(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setQuery("");

    setTimeout(() => {
      const response = generateResponse(userMsg, contextRisk);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 800);
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-white mb-2 text-2xl font-medium flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-400" />
          Delta AI — Asistente Inteligente
        </h1>
        <p className="text-gray-400">
          Consulta recomendaciones, análisis automático y generación de reportes
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="xl:col-span-2 flex flex-col rounded-xl bg-[#13141b] border border-gray-800 overflow-hidden min-h-[500px]">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <Sparkles className="w-3 h-3 text-blue-400 mb-1" />
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-gray-800 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Consulta análisis, recomendaciones o reportes..."
              className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#13141b] border border-gray-800">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Recomendaciones automáticas
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec) => (
                <li key={rec} className="text-sm text-gray-400 flex gap-2">
                  <span className="text-blue-400">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[#13141b] border border-gray-800">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-400" />
              Historial de eventos ({history.length})
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">Sin eventos registrados aún</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-auto">
                {history.slice(0, 5).map((event) => (
                  <li key={event.id} className="text-xs text-gray-400 border-b border-gray-800 pb-2">
                    <span className={RISK_LEVELS[event.level]?.color}>
                      [{RISK_LEVELS[event.level]?.label}]
                    </span>{" "}
                    {event.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateResponse(query, risk) {
  const q = query.toLowerCase();
  if (q.includes("reporte") || q.includes("informe")) {
    return "He generado un reporte de seguridad con los eventos recientes, clasificación de riesgos y acciones tomadas. Puedes descargarlo desde la sección de Análisis.";
  }
  if (q.includes("bloquear") || q.includes("transaccion")) {
    return "Recomiendo bloquear las transacciones TX-7482 y TX-7481 por actividad sospechosa en zonas de alto riesgo. ¿Deseas que aplique el bloqueo automático?";
  }
  if (q.includes("riesgo") || risk) {
    return `El análisis IA indica un score de riesgo de ${risk?.score || 72}/100. Se detectaron patrones anómalos que requieren atención. Te sugiero revisar las transacciones internacionales de las últimas 2 horas.`;
  }
  return "Basándome en el monitoreo en tiempo real, la actividad general es estable. Hay 2 alertas pendientes de revisión. ¿Quieres que profundice en algún evento específico?";
}

export default DeltaAIPage;
