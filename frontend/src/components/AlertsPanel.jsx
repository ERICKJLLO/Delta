import { AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";

const alerts = [
  {
    id: "1",
    title: "Patrón de fraude detectado",
    description:
      "Múltiples transferencias desde Nigeria en la última hora",
    time: "Hace 3 min",
    severity: "critical",
    icon: AlertTriangle,
  },
  {
    id: "2",
    title: "Aumento en transacciones sospechosas",
    description: "Incremento del 45% en actividad anómala",
    time: "Hace 8 min",
    severity: "warning",
    icon: TrendingUp,
  },
  {
    id: "3",
    title: "Sistema de protección activado",
    description: "Bloqueo automático de 12 transacciones",
    time: "Hace 15 min",
    severity: "info",
    icon: Shield,
  },
  {
    id: "4",
    title: "Comportamiento inusual detectado",
    description: "Cuenta ****3847 con actividad fuera de patrón normal",
    time: "Hace 22 min",
    severity: "warning",
    icon: Activity,
  },
];

const severityStyles = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
    label: "Crítico",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-400",
    label: "Advertencia",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400",
    label: "Información",
  },
};

function AlertsPanel({ searchQuery }) {
  const filteredAlerts = alerts.filter(alert => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      alert.title.toLowerCase().includes(q) ||
      alert.description.toLowerCase().includes(q) ||
      alert.severity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white">Alertas Recientes</h3>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm animate-pulse">
          {filteredAlerts.filter((a) => a.severity === "critical").length} Críticas
        </span>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500 text-sm">No hay alertas que coincidan con la búsqueda.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const styles = severityStyles[alert.severity];
            const Icon = alert.icon;

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${styles.border} ${styles.bg} hover:bg-opacity-80 transition-all cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${styles.bg}`}>
                  <Icon className={`w-5 h-5 ${styles.icon}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-white">{alert.title}</h4>
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {alert.description}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${styles.badge}`}>
                    {styles.label}
                  </span>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}

export default AlertsPanel;
