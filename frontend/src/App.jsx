import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import RiskIndicator from "./components/RiskIndicator";
import { DollarSign, TrendingUp, Shield, Activity } from "lucide-react";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex bg-[#0d0e14] min-h-screen">
      
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

      <main className="flex-1 overflow-auto p-6 text-white">

        <div className="space-y-6">
          <div>
            <h1 className="text-white mb-2 text-2xl font-medium">
              Dashboard de Riesgos
            </h1>
            <p className="text-gray-400">
              Monitoreo en tiempo real de riesgos financieros
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RiskIndicator level="high" value={72} />
            <MetricCard
              title="Pérdidas Estimadas (Hoy)"
              value="$45,230"
              change="+18%"
              icon={DollarSign}
              trend="up"
            />
            <MetricCard
              title="Eventos Detectados"
              value="127"
              change="+23"
              icon={Activity}
              trend="up"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Exposición al Riesgo"
              value="$2.4M"
              change="+5%"
              icon={TrendingUp}
              trend="up"
            />
            <MetricCard
              title="Transacciones Bloqueadas"
              value="34"
              change="-12%"
              icon={Shield}
              trend="down"
            />
            <MetricCard
              title="Tasa de Detección"
              value="94.2%"
              change="+2.1%"
              icon={Shield}
              trend="down"
            />
          </div>
        </div>

      </main>
      </div>

    </div>
  );
}

export default App;