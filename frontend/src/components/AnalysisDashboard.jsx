import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";

const fraudTypeData = [
  { name: "Phishing", value: 35, color: "#ef4444" },
  { name: "Transferencias fraudulentas", value: 28, color: "#f59e0b" },
  { name: "Robo de identidad", value: 20, color: "#f97316" },
  { name: "Tarjetas clonadas", value: 12, color: "#eab308" },
  { name: "Otros", value: 5, color: "#6b7280" },
];

const monthlyLossData = [
  { month: "Ene", perdidas: 125000, eventos: 45 },
  { month: "Feb", perdidas: 98000, eventos: 38 },
  { month: "Mar", perdidas: 152000, eventos: 52 },
  { month: "Abr", perdidas: 87000, eventos: 31 },
  { month: "May", perdidas: 134000, eventos: 47 },
  { month: "Jun", perdidas: 178000, eventos: 63 },
];

const riskByRegion = [
  { region: "Asia", riesgo: 72 },
  { region: "África", riesgo: 85 },
  { region: "Europa del Este", riesgo: 58 },
  { region: "América Latina", riesgo: 45 },
  { region: "América del Norte", riesgo: 23 },
];

const tooltipStyle = {
  backgroundColor: "#1a1a24",
  border: "1px solid #2a2a3a",
  borderRadius: "8px",
  color: "#fff",
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <text x={cx} y={cy - outerRadius - 20} dy={8} textAnchor="middle" fill={fill} className="text-sm font-bold animate-fadeIn">
        {payload.name} ({(payload.percent * 100).toFixed(1)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300 drop-shadow-xl"
      />
    </g>
  );
};

function AnalysisDashboard() {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieClick = (_, index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
          <h3 className="text-white mb-6">Tipos de Fraude Detectados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  activeIndex === null ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onClick={onPieClick}
                style={{ cursor: 'pointer' }}
              >
                {fraudTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
          <h3 className="text-white mb-6">Riesgo por Región Geográfica</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskByRegion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis
                type="category"
                dataKey="region"
                stroke="#6b7280"
                width={120}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="riesgo" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                {riskByRegion.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.riesgo > 70
                        ? "#ef4444"
                        : entry.riesgo > 50
                          ? "#f59e0b"
                          : "#22c55e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
        <h3 className="text-white mb-6">
          Tendencia de Pérdidas y Eventos (6 meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyLossData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="perdidas"
              fill="#ef4444"
              name="Pérdidas ($)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="eventos"
              fill="#3b82f6"
              name="Eventos Detectados"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/5 border border-red-500/30">
          <h4 className="text-gray-400 text-sm mb-2">Total Pérdidas (6 meses)</h4>
          <p className="text-3xl text-white mb-1">$774,000</p>
          <p className="text-sm text-red-400">↑ 18% vs período anterior</p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30">
          <h4 className="text-gray-400 text-sm mb-2">Eventos Totales</h4>
          <p className="text-3xl text-white mb-1">276</p>
          <p className="text-sm text-yellow-400">↑ 12% vs período anterior</p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/30">
          <h4 className="text-gray-400 text-sm mb-2">Tasa de Detección</h4>
          <p className="text-3xl text-white mb-1">94.2%</p>
          <p className="text-sm text-green-400">↑ 5% vs período anterior</p>
        </div>
      </div>
    </div>
  );
}

export default AnalysisDashboard;
