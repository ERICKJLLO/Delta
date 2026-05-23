import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

const configs = {
  low: {
    color: "text-green-400",
    borderColor: "border-green-500/30",
    icon: CheckCircle,
    label: "Riesgo Bajo",
    gradient: "from-green-500/20 to-green-600/5",
    barGradient: "from-green-500 to-green-400",
  },
  medium: {
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    icon: AlertTriangle,
    label: "Riesgo Medio",
    gradient: "from-yellow-500/20 to-yellow-600/5",
    barGradient: "from-yellow-500 to-yellow-400",
  },
  high: {
    color: "text-red-400",
    borderColor: "border-red-500/30",
    icon: AlertCircle,
    label: "Riesgo Alto",
    gradient: "from-red-500/20 to-red-600/5",
    barGradient: "from-red-500 to-red-400",
  },
};

function RiskIndicator({ level, value }) {
  const config = configs[level];
  const Icon = config.icon;

  return (
    <div
      className={`p-6 rounded-xl border ${config.borderColor} bg-gradient-to-br ${config.gradient} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400">Indicador Global de Riesgo</h3>
        <Icon className={`w-6 h-6 ${config.color}`} />
      </div>
      <div className="flex items-end gap-3">
        <span className={`text-5xl ${config.color}`}>{value}%</span>
        <span className={`text-xl pb-2 ${config.color}`}>{config.label}</span>
      </div>
      <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${config.barGradient}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default RiskIndicator;
