import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { PLANS } from "../constants/plans";

const PlanContext = createContext(null);

// Mapeo de accesos permitidos para cada nivel de plan
const PLAN_FEATURES = {
  basic: [
    'dashboard',          // Dashboard general
    'monitoring',         // Monitoreo en tiempo real
    'transactions_view',  // Solo visualización de transacciones
    'alerts_basic',       // Alertas simples sin filtros avanzados
  ],
  professional: [
    'dashboard',
    'monitoring',
    'transactions_view',
    'transactions_actions', // Ejecutar acciones en transacciones (bloquear/aprobar)
    'alerts_basic',
    'alerts_advanced',    // Alertas avanzadas
    'analysis',           // Análisis predictivo e interactivo, mapa de calor
    'delta_ai_limited',   // Delta AI (asistente limitado)
    'reports',            // Exportación y creación de reportes personalizados
  ],
  enterprise: [
    'dashboard',
    'monitoring',
    'transactions_view',
    'transactions_actions',
    'alerts_basic',
    'alerts_advanced',
    'analysis',
    'delta_ai_full',       // Delta AI completo e ilimitado
    'reports',
    'settings_advanced',  // Configuración de API / Core bancario
  ]
};

export function PlanProvider({ children }) {
  const { user } = useAuth();
  
  // Si no hay usuario autenticado, por defecto se considera plan "basic"
  const planId = user?.plan_id || 'basic';
  const planDetails = PLANS[planId] || PLANS.basic;

  /**
   * Verifica si el plan actual tiene acceso a una característica específica.
   * Soporta chequeos de features heredadas o jerárquicas.
   */
  const canAccess = (feature) => {
    const features = PLAN_FEATURES[planId] || PLAN_FEATURES.basic;
    
    // Si la característica buscada está directamente en el plan
    if (features.includes(feature)) return true;
    
    // Reglas de fallback y permisos jerárquicos
    if (feature === 'delta_ai') {
      return features.includes('delta_ai_limited') || features.includes('delta_ai_full');
    }
    if (feature === 'transactions') {
      return features.includes('transactions_view');
    }
    if (feature === 'alerts') {
      return features.includes('alerts_basic') || features.includes('alerts_advanced');
    }
    
    return false;
  };

  const isFeatureLocked = (feature) => !canAccess(feature);

  return (
    <PlanContext.Provider value={{ planId, planDetails, canAccess, isFeatureLocked }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan debe usarse dentro de un PlanProvider");
  }
  return context;
}
