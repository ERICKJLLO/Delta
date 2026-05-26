import React, { useState } from "react";
import { X, Sparkles, Phone, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export function UpgradeModal({ isOpen, onClose, requiredPlanName = "Profesional" }) {
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("morning");
  const [status, setStatus] = useState("idle"); // idle | loading | success

  if (!isOpen) return null;

  const planPrices = {
    "Profesional": "$6.000.000 COP / mes",
    "Empresarial": "$15.000.000 COP / mes"
  };

  const planFeatures = {
    "Profesional": [
      "Modelos predictivos avanzados de fraude con Inteligencia Artificial",
      "Acceso ilimitado al análisis de tendencias históricas de riesgos",
      "Soporte prioritario 24/7 con ingenieros especializados",
      "Hasta 10 usuarios concurrentes con permisos granulares"
    ],
    "Empresarial": [
      "Delta AI Sandbox completo e ilimitado para auditoría",
      "Integración total vía API REST con tu Core Bancario principal",
      "Monitoreo a nivel transaccional corporativo sin límite de volumen",
      "Gerente de cuenta exclusivo y SLA de respuesta de 99.9%"
    ]
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setStatus("loading");
    
    // Simular llamada al backend/envío de solicitud
    await new Promise((r) => setTimeout(r, 1200));
    
    setStatus("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#161722] to-[#0f1017] border border-gray-800 shadow-2xl overflow-hidden flex flex-col p-6 animate-scaleUp">
        
        {/* Glows Decorativos */}
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all active:scale-95"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8 px-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            
            <h3 className="text-white text-2xl font-bold tracking-tight mb-3">
              ¡Solicitud Recibida!
            </h3>
            
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              Hemos registrado tu solicitud para el <span className="text-blue-400 font-bold">Plan {requiredPlanName}</span>. Un especialista en seguridad de Delta se pondrá en contacto contigo en tu horario de preferencia.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Entendido
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header del Modal */}
            <div className="flex items-center gap-2 mb-2 text-purple-400 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Mejora Premium de Cuenta</span>
            </div>
            
            <h2 className="text-white text-xl font-extrabold mb-1">
              Desbloquea el Plan {requiredPlanName}
            </h2>
            
            <p className="text-gray-400 text-xs mb-4">
              Disfruta de la máxima potencia de prevención de riesgos con Inteligencia Artificial.
            </p>

            {/* Precio destacado */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 mb-5">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Precio Estimado</p>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-xl font-black">
                {planPrices[requiredPlanName] || "$6.000.000 COP / mes"}
              </p>
            </div>

            {/* Beneficios */}
            <div className="mb-6 space-y-3">
              <p className="text-white text-xs font-bold uppercase tracking-wider">Beneficios incluidos:</p>
              <div className="space-y-2">
                {(planFeatures[requiredPlanName] || planFeatures["Profesional"]).map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                    <p className="leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleUpgradeSubmit} className="space-y-4 pt-2 border-t border-gray-800/80">
              <p className="text-xs text-gray-400 font-medium">
                Ingresa tu número de contacto para coordinar la activación inmediata de tu plan:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Celular corporativo"
                    className="w-full pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    disabled={status === "loading"}
                  />
                </div>
                
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 appearance-none"
                    disabled={status === "loading"}
                  >
                    <option value="morning">Llamar en la mañana</option>
                    <option value="afternoon">Llamar en la tarde</option>
                    <option value="immediate">Contacto Inmediato</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/10 active:scale-98"
              >
                {status === "loading" ? (
                  <span>Enviando solicitud...</span>
                ) : (
                  <>
                    <span>Solicitar Activación de Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpgradeModal;
