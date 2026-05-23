import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RiskIndicator from "./components/RiskIndicator";
import MetricCard from "./components/MetricCard";
import RiskChart from "./components/RiskChart";
import TransactionList from "./components/TransactionList";
import AlertsPanel from "./components/AlertsPanel";
import AnalysisDashboard from "./components/AnalysisDashboard";
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

        <main className="flex-1 overflow-auto p-6">
          {activeSection === "dashboard" && (
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

              <RiskChart />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TransactionList />
                <AlertsPanel />
              </div>
            </div>
          )}

          {activeSection === "transactions" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-white mb-2 text-2xl font-medium">
                  Gestión de Transacciones
                </h1>
                <p className="text-gray-400">
                  Monitoreo y análisis de transacciones sospechosas
                </p>
              </div>
              <TransactionList />
            </div>
          )}

          {activeSection === "alerts" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-white mb-2 text-2xl font-medium">
                  Centro de Alertas
                </h1>
                <p className="text-gray-400">
                  Sistema de alertas y notificaciones en tiempo real
                </p>
              </div>
              <AlertsPanel />
            </div>
          )}

          {activeSection === "analysis" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-white mb-2 text-2xl font-medium">
                  Análisis de Riesgos
                </h1>
                <p className="text-gray-400">
                  Historial, tendencias y patrones de fraude
                </p>
              </div>
              <AnalysisDashboard />
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-white mb-2 text-2xl font-medium">
                  Configuración del Sistema
                </h1>
                <p className="text-gray-400">
                  Ajustes y parámetros de monitoreo
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
                <p className="text-gray-400">
                  Panel de configuración en desarrollo...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
