export const PLANS = {
  basic: {
    id: "basic",
    name: "Básico",
    price: 2500000,
    priceLabel: "$2.500.000",
    period: "/mes",
    users: "Hasta 3 usuarios",
    support: "Soporte 8×5",
    features: [
      "Dashboard de riesgo operativo",
      "Monitoreo en tiempo real",
      "Alertas automáticas básicas",
      "Hasta 3 usuarios",
      "Soporte 8×5",
    ],
  },
  professional: {
    id: "professional",
    name: "Profesional",
    price: 6000000,
    priceLabel: "$6.000.000",
    period: "/mes",
    users: "Hasta 10 usuarios",
    support: "Soporte 24×7",
    features: [
      "Todo lo del plan Básico",
      "Mapas de calor de riesgo",
      "Análisis predictivo con IA",
      "Hasta 10 usuarios",
      "Reportes personalizados",
      "Soporte 24×7",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Empresarial",
    price: 15000000,
    priceLabel: "$15.000.000",
    period: "/mes",
    users: "Usuarios ilimitados",
    support: "Gerente de cuenta dedicado",
    features: [
      "Todo lo del plan Profesional",
      "Integración API con core bancario",
      "Controles automatizados",
      "Usuarios ilimitados",
      "SLA garantizado 99.9%",
      "Gerente de cuenta dedicado",
    ],
  },
};

export const PLAN_LIST = Object.values(PLANS);
