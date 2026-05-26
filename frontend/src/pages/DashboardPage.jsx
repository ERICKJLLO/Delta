import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RiskIndicator from "../components/RiskIndicator";
import MetricCard from "../components/MetricCard";
import RiskChart from "../components/RiskChart";
import TransactionList from "../components/TransactionList";
import AlertsPanel from "../components/AlertsPanel";
import AnalysisDashboard from "../components/AnalysisDashboard";
import RiskProtocolPanel from "../components/RiskProtocolPanel";
import DeltaAIPage from "./DeltaAIPage";
import { useAuth } from "../context/AuthContext";
import { usePlan } from "../context/PlanContext";
import { useRiskMonitor } from "../hooks/useRiskMonitor";
import LockedFeature from "../components/LockedFeature";
import { DollarSign, TrendingUp, Shield, Activity } from "lucide-react";

function DashboardPage() {
  const { user, logout } = useAuth();
  const { planDetails } = usePlan();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const { currentRisk, resolveRisk, dismissRisk, lastScan, monitoring } =
    useRiskMonitor(true);

  const isDeltaAI = location.pathname.endsWith("/delta-ai");

  const companyName = user?.company_name || user?.companyName || "Tu Empresa";

  function handleSectionChange(section) {
    if (section === "delta-ai") {
      navigate("/dashboard/delta-ai");
      return;
    }
    setActiveSection(section);
    if (isDeltaAI) navigate("/dashboard");
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex bg-[#0d0e14] min-h-screen">
      <Sidebar
        activeSection={isDeltaAI ? "delta-ai" : activeSection}
        setActiveSection={handleSectionChange}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          monitoring={monitoring}
          lastScan={lastScan}
          company={companyName}
        />

        <main className="flex-1 overflow-auto p-6">
          {isDeltaAI ? (
            <LockedFeature feature="delta_ai">
              <DeltaAIPage />
            </LockedFeature>
          ) : (
            <>
              {activeSection === "dashboard" && <DashboardHome user={user} planDetails={planDetails} />}
              {activeSection === "transactions" && (
                <Section
                  title="Gestión de Transacciones"
                  subtitle="Monitoreo y análisis de transacciones sospechosas"
                >
                  <TransactionList />
                </Section>
              )}
              {activeSection === "alerts" && (
                <Section
                  title="Centro de Alertas"
                  subtitle="Sistema de alertas y notificaciones en tiempo real"
                >
                  <AlertsPanel />
                </Section>
              )}
              {activeSection === "analysis" && (
                <Section
                  title="Análisis de Riesgos"
                  subtitle="Historial, tendencias y patrones de fraude"
                >
                  <LockedFeature feature="analysis">
                    <AnalysisDashboard />
                  </LockedFeature>
                </Section>
              )}
              {activeSection === "settings" && (
                <Section
                  title="Configuración del Sistema"
                  subtitle="Ajustes y parámetros de monitoreo"
                >
                  <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800 space-y-3">
                    <p className="text-gray-400">
                      Empresa: <span className="text-white">{companyName}</span>
                    </p>
                    <p className="text-gray-400">
                      Plan actual: <span className="text-blue-400 font-bold">{planDetails.name}</span>
                    </p>
                    <p className="text-gray-400">
                      NIT: <span className="text-white">{user?.nit}</span>
                    </p>
                    <p className="text-gray-400">
                      Contacto: <span className="text-white">{user?.contact_name || user?.contactName}</span>
                    </p>
                  </div>
                </Section>
              )}
            </>
          )}
        </main>
      </div>

      {currentRisk && (
        <RiskProtocolPanel
          risk={currentRisk}
          onResolve={resolveRisk}
          onDismiss={dismissRisk}
        />
      )}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2 text-2xl font-medium">{title}</h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function DashboardHome({ user, planDetails }) {
  const companyName = user?.company_name || user?.companyName || "Tu Empresa";
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2 text-2xl font-medium">Dashboard de Riesgos</h1>
        <p className="text-gray-400">
          Monitoreo en tiempo real — {companyName} · Plan <span className="text-blue-400 font-semibold">{planDetails.name}</span>
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
  );
}

export default DashboardPage;
