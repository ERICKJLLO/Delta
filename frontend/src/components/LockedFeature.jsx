import React from "react";
import { Lock, Sparkles, ArrowUpRight } from "lucide-react";
import { usePlan } from "../context/PlanContext";

/**
 * Componente que envuelve características bloqueadas por plan de suscripción.
 * Si el usuario no tiene los permisos, muestra un overlay premium y glassmorphic.
 */
export function LockedFeature({ feature, children, fallback = null, message = "" }) {
  const { canAccess, planDetails } = usePlan();

  const hasAccess = canAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Determinar qué nivel de plan se requiere
  let requiredPlanName = "Profesional";
  if (feature === 'settings_advanced' || feature === 'delta_ai_full' || feature === 'delta_ai') {
    if (feature === 'settings_advanced' || feature === 'delta_ai_full') {
      requiredPlanName = "Empresarial";
    }
  }

  const handleUpgradeClick = () => {
    window.dispatchEvent(new CustomEvent("delta_open_upgrade_modal", {
      detail: { plan: requiredPlanName }
    }));
  };

  const defaultMessage = message || (
    <span>
      Esta funcionalidad requiere el Plan <strong className="text-blue-400 font-semibold">{requiredPlanName}</strong>. Tu plan actual es <strong className="text-gray-300 font-semibold">{planDetails.name}</strong>.
    </span>
  );

  return (
    <div className="relative min-h-[320px] rounded-xl overflow-hidden border border-red-500/10 bg-gradient-to-b from-[#161722]/80 to-[#0e0f15]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:border-blue-500/20">
      
      {/* Elementos decorativos de fondo con gradientes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-10 right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -z-10"></div>

      {/* Contenedor del ícono con un borde brillante y gradiente */}
      <div className="relative mb-5 p-4 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/60 shadow-xl">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm"></div>
        <Lock className="w-7 h-7 text-blue-400 relative z-10 animate-bounce" style={{ animationDuration: '4s' }} />
      </div>

      {/* Títulos y textos */}
      <div className="px-3 py-1 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3 uppercase tracking-wider">
        Acceso Restringido
      </div>

      <h3 className="text-white text-lg font-bold tracking-wide flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        Función Premium Bloqueada
      </h3>
      
      <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
        {defaultMessage}
      </p>

      {/* Botón premium de Call to Action */}
      <button 
        type="button"
        onClick={handleUpgradeClick}
        className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
      >
        <span>Mejorar mi plan</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>

      {/* Fondo borroso para contenido hijo original si es visible */}
      <div className="absolute inset-0 opacity-5 pointer-events-none filter blur-md -z-20 scale-95 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
export default LockedFeature;
