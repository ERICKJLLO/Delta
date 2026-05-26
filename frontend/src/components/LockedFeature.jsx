import React, { useState } from "react";
import { Lock, Sparkles, ArrowUpRight } from "lucide-react";
import { usePlan } from "../context/PlanContext";
import UpgradeModal from "./UpgradeModal";

/**
 * Componente que envuelve características bloqueadas por plan de suscripción.
 * Si el usuario no tiene los permisos, muestra un overlay premium y glassmorphic.
 */
export function LockedFeature({ feature, children, fallback = null, message = "" }) {
  const { canAccess } = usePlan();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const hasAccess = canAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Si se provee un fallback específico, mostrarlo
  if (fallback) {
    return <>{fallback}</>;
  }

  // Determinar qué nivel de plan se requiere para esta característica
  let requiredPlanName = "Profesional";
  if (feature === 'settings_advanced' || feature === 'delta_ai_full' || feature === 'delta_ai') {
    // Si es delta_ai completo se requiere Empresarial, si es análisis profesional.
    if (feature === 'settings_advanced' || feature === 'delta_ai_full') {
      requiredPlanName = "Empresarial";
    }
  }

  const defaultMessage = message || `Esta funcionalidad requiere el Plan ${requiredPlanName} o superior. Tu plan actual es Básico.`;

  return (
    <>
      <div className="relative min-h-[300px] rounded-xl overflow-hidden border border-gray-800 bg-[#13141b]/40 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:border-blue-500/30">
        
        {/* Elementos decorativos de fondo con gradientes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -z-10"></div>

        {/* Contenedor del ícono con un borde brillante y gradiente */}
        <div className="relative mb-5 p-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl shadow-black/40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm"></div>
          <Lock className="w-8 h-8 text-blue-400 relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        {/* Títulos y textos */}
        <h3 className="text-white text-lg font-bold tracking-wide flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Función Premium Bloqueada
        </h3>
        
        <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
          {defaultMessage}
        </p>

        {/* Botón premium de Call to Action */}
        <button 
          type="button"
          onClick={() => setIsUpgradeOpen(true)}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <span>Mejorar mi plan</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        {/* Fondo borroso para contenido hijo original si es visible */}
        <div className="absolute inset-0 opacity-10 pointer-events-none filter blur-md -z-20 scale-95 overflow-hidden">
          {children}
        </div>
      </div>

      <UpgradeModal 
        isOpen={isUpgradeOpen} 
        onClose={() => setIsUpgradeOpen(false)} 
        requiredPlanName={requiredPlanName} 
      />
    </>
  );
}

export default LockedFeature;
