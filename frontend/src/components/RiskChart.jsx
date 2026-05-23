import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { time: "00:00", riesgo: 25, fraudes: 5, anomalias: 12 },
  { time: "04:00", riesgo: 32, fraudes: 8, anomalias: 15 },
  { time: "08:00", riesgo: 45, fraudes: 12, anomalias: 22 },
  { time: "12:00", riesgo: 58, fraudes: 18, anomalias: 28 },
  { time: "16:00", riesgo: 72, fraudes: 25, anomalias: 35 },
  { time: "20:00", riesgo: 55, fraudes: 15, anomalias: 26 },
  { time: "23:59", riesgo: 38, fraudes: 10, anomalias: 18 },
];

function RiskChart() {
  return (
    <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
      <h3 className="text-white mb-6">Tendencia de Riesgos en el Tiempo</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRiesgo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFraudes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAnomalias" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #2a2a3a",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="riesgo"
            stroke="#ef4444"
            fill="url(#colorRiesgo)"
            name="Nivel de Riesgo"
          />
          <Area
            type="monotone"
            dataKey="fraudes"
            stroke="#f59e0b"
            fill="url(#colorFraudes)"
            name="Fraudes Detectados"
          />
          <Area
            type="monotone"
            dataKey="anomalias"
            stroke="#3b82f6"
            fill="url(#colorAnomalias)"
            name="Anomalías"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskChart;
