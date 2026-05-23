const HISTORY_KEY = "delta_event_history";

export function getEventHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveEvent(event) {
  const history = getEventHistory();
  history.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

export const RISK_LEVELS = {
  critical: {
    label: "Crítico",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  high: {
    label: "Alto",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  medium: {
    label: "Medio",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
  low: {
    label: "Bajo",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
};

const SCENARIOS = [
  {
    level: "critical",
    title: "Amenaza crítica detectada",
    description: "Múltiples transferencias internacionales desde zona de alto riesgo",
    anomaly: "Patrón de fraude coordinado",
  },
  {
    level: "high",
    title: "Alerta urgente",
    description: "Transacción de alto monto fuera del horario habitual",
    anomaly: "Comportamiento atípico en cuenta corporativa",
  },
  {
    level: "medium",
    title: "Alerta preventiva",
    description: "Incremento del 30% en actividad de retiros ATM",
    anomaly: "Desviación estadística moderada",
  },
  {
    level: "low",
    title: "Alerta informativa",
    description: "Nuevo dispositivo registrado para acceso empresarial",
    anomaly: "Evento de acceso inusual",
  },
];

export function analyzeRisk() {
  const roll = Math.random();

  if (roll > 0.55) {
    return { detected: false };
  }

  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  return {
    detected: true,
    ...scenario,
    score: scenario.level === "critical" ? 92 : scenario.level === "high" ? 78 : scenario.level === "medium" ? 55 : 28,
  };
}

export function getAIRecommendations(level) {
  const base = {
    critical: [
      "Bloquear inmediatamente las transacciones identificadas",
      "Activar protocolo de contención nivel 1",
      "Notificar al equipo de respuesta a incidentes",
      "Preservar evidencia digital para auditoría forense",
    ],
    high: [
      "Marcar cuentas afectadas para revisión manual",
      "Incrementar frecuencia de monitoreo a cada 30 segundos",
      "Solicitar verificación adicional al titular de la cuenta",
    ],
    medium: [
      "Monitorear de cerca la actividad en las próximas 24 horas",
      "Revisar patrones históricos de la cuenta",
      "Configurar alerta automática si persiste la anomalía",
    ],
    low: [
      "Registrar evento en historial de seguridad",
      "Verificar que el acceso fue autorizado por el usuario",
      "No se requieren acciones inmediatas",
    ],
  };
  return base[level] || [];
}
