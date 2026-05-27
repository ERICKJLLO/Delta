import { useState, useEffect } from "react";
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
import UpgradeModal from "../components/UpgradeModal";
import { DollarSign, TrendingUp, Shield, Activity } from "lucide-react";

function DashboardPage() {
  const { user, logout } = useAuth();
  const { planDetails } = usePlan();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const { currentRisk, resolveRisk, dismissRisk, lastScan, monitoring } =
    useRiskMonitor(true);

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState("Profesional");

  useEffect(() => {
    const handleOpenUpgrade = (e) => {
      if (e.detail?.plan) {
        setRequiredPlan(e.detail.plan);
      }
      setIsUpgradeOpen(true);
    };
    window.addEventListener("delta_open_upgrade_modal", handleOpenUpgrade);
    return () => window.removeEventListener("delta_open_upgrade_modal", handleOpenUpgrade);
  }, []);

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

  const handleNotificationClick = (notif) => {
    if (activeSection !== "dashboard" && !isDeltaAI) {
      setActiveSection("dashboard");
    }
    
    const txMatch = notif.message.match(/TX-\d+/);
    if (txMatch) {
      setSearchQuery(txMatch[0]);
    } else if (notif.title.toLowerCase().includes("nigeria") || notif.message.toLowerCase().includes("nigeria")) {
      setSearchQuery("Nigeria");
    } else {
      setSearchQuery("riesgo");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#0d0e14] min-h-screen lg:h-screen lg:overflow-hidden">
      <Sidebar
        activeSection={isDeltaAI ? "delta-ai" : activeSection}
        setActiveSection={handleSectionChange}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col lg:overflow-hidden">
        <Header
          monitoring={monitoring}
          lastScan={lastScan}
          company={companyName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNotificationClick={handleNotificationClick}
        />

        <main className="flex-1 overflow-visible lg:overflow-auto p-4 sm:p-6">
          {isDeltaAI ? (
            <LockedFeature feature="delta_ai">
              <DeltaAIPage />
            </LockedFeature>
          ) : (
            <>
              {activeSection === "dashboard" && <DashboardHome user={user} planDetails={planDetails} searchQuery={searchQuery} />}
              {activeSection === "transactions" && (
                <Section
                  title="Gestión de Transacciones"
                  subtitle="Monitoreo y análisis de transacciones sospechosas"
                >
                  <TransactionList searchQuery={searchQuery} />
                </Section>
              )}
              {activeSection === "alerts" && (
                <Section
                  title="Centro de Alertas"
                  subtitle="Sistema de alertas y notificaciones en tiempo real"
                >
                  <AlertsPanel searchQuery={searchQuery} />
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

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        requiredPlanName={requiredPlan}
      />
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

function DashboardHome({ user, planDetails, searchQuery }) {
  const companyName = user?.company_name || user?.companyName || "Tu Empresa";
  
  const [txList, setTxList] = useState(() => {
    const saved = localStorage.getItem("delta_suspicious_transactions");
    return saved ? JSON.parse(saved) : [
      { id: "TX-7482", amount: "$45,230.00", risk: "high", actionState: "pending" },
      { id: "TX-7481", amount: "$8,450.00", risk: "high", actionState: "pending" },
      { id: "TX-7480", amount: "$2,340.00", risk: "medium", actionState: "pending" },
      { id: "TX-7479", amount: "$15,780.00", risk: "medium", actionState: "pending" },
      { id: "TX-7478", amount: "$890.00", risk: "low", actionState: "pending" }
    ];
  });

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("delta_suspicious_transactions");
      if (saved) {
        setTxList(JSON.parse(saved));
      }
    };
    window.addEventListener("delta_transactions_updated", handleSync);
    return () => window.removeEventListener("delta_transactions_updated", handleSync);
  }, []);

  // Funciones de cálculo dinámico para métricas
  const parseAmount = (amt) => {
    if (!amt) return 0;
    return parseFloat(amt.replace(/[^0-9.]/g, ''));
  };

  const blockedCount = txList.filter(t => t.actionState === 'blocked').length;
  const safeCount = 5 - txList.length; // Transacciones removidas al ser marcadas seguras
  
  // Pérdidas estimadas: se descuenta el valor de lo bloqueado (pérdida evitada)
  const baseLosses = 45230;
  const blockedAmount = txList
    .filter(t => t.actionState === 'blocked')
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);
  const finalLosses = Math.max(0, baseLosses - blockedAmount);
  const formattedLosses = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(finalLosses);

  // Eventos detectados: disminuye a medida que se resuelven (bloqueados o seguros)
  const activeEvents = Math.max(0, 127 - blockedCount - safeCount);

  // Transacciones bloqueadas totales
  const totalBlocked = 34 + blockedCount;

  // Tasa de detección dinámica
  const baseRate = 94.2;
  const rateIncrease = blockedCount * 0.8 + safeCount * 0.4;
  const detectionRate = Math.min(100, baseRate + rateIncrease).toFixed(1) + "%";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2 text-2xl font-medium">Dashboard de Riesgos</h1>
        <p className="text-gray-400">
          Monitoreo en tiempo real — {companyName} · Plan <span className="text-blue-400 font-semibold">{planDetails.name}</span>
        </p>
      </div>

      {/* Si hay búsqueda activa, mostrar resultados filtrados */}
      {searchQuery && searchQuery.trim().length > 0 ? (
        <SearchResults query={searchQuery} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RiskIndicator level="high" value={72} />
            <MetricCard
              title="Pérdidas Estimadas (Hoy)"
              value={formattedLosses}
              change={blockedCount > 0 ? "-100%" : "+18%"}
              icon={DollarSign}
              trend={blockedCount > 0 ? "down" : "up"}
            />
            <MetricCard
              title="Eventos Detectados"
              value={String(activeEvents)}
              change={blockedCount > 0 || safeCount > 0 ? `-${blockedCount + safeCount}` : "+23"}
              icon={Activity}
              trend={blockedCount > 0 || safeCount > 0 ? "down" : "up"}
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
              value={String(totalBlocked)}
              change={blockedCount > 0 ? `+${blockedCount}` : "0%"}
              icon={Shield}
              trend={blockedCount > 0 ? "up" : "down"}
            />
            <MetricCard
              title="Tasa de Detección"
              value={detectionRate}
              change={blockedCount > 0 || safeCount > 0 ? `+${rateIncrease.toFixed(1)}%` : "+2.1%"}
              icon={Shield}
              trend="up"
            />
          </div>

          <RiskChart />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TransactionList searchQuery={searchQuery} />
            <AlertsPanel searchQuery={searchQuery} />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Panel de resultados de búsqueda global
 */
function SearchResults({ query }) {
  const q = query.toLowerCase().trim();

  // Buscar en transacciones
  const savedTx = localStorage.getItem("delta_suspicious_transactions");
  const allTransactions = savedTx ? JSON.parse(savedTx) : [];
  const matchedTx = allTransactions.filter(tx =>
    tx.id.toLowerCase().includes(q) ||
    tx.amount.toLowerCase().includes(q) ||
    tx.account.toLowerCase().includes(q) ||
    tx.location.toLowerCase().includes(q) ||
    tx.type.toLowerCase().includes(q) ||
    (tx.actionState && tx.actionState.toLowerCase().includes(q))
  );

  // Buscar en alertas estáticas
  const alerts = [
    { id: "1", title: "Patrón de fraude detectado", description: "Múltiples transferencias desde Nigeria en la última hora", severity: "critical" },
    { id: "2", title: "Aumento en transacciones sospechosas", description: "Incremento del 45% en actividad anómala", severity: "warning" },
    { id: "3", title: "Sistema de protección activado", description: "Bloqueo automático de 12 transacciones", severity: "info" },
    { id: "4", title: "Comportamiento inusual detectado", description: "Cuenta ****3847 con actividad fuera de patrón normal", severity: "warning" },
  ];
  const matchedAlerts = alerts.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.severity.toLowerCase().includes(q)
  );

  const totalResults = matchedTx.length + matchedAlerts.length;

  const riskStyles = {
    high: "text-red-400 bg-red-500/10 border-red-500/30",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    low: "text-green-400 bg-green-500/10 border-green-500/30",
    blocked: "text-red-500 bg-red-600/20 border-red-600/40",
    investigating: "text-blue-400 bg-blue-500/10 border-blue-500/30"
  };

  const severityStyles = {
    critical: "bg-red-500/20 text-red-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    info: "bg-blue-500/20 text-blue-400"
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 rounded-lg bg-[#13141b] border border-gray-800">
        <p className="text-sm text-gray-400">
          Resultados para <span className="text-white font-semibold">"{query}"</span>
          <span className="ml-2 text-gray-500">— {totalResults} encontrados</span>
        </p>
      </div>

      {totalResults === 0 && (
        <div className="p-12 text-center rounded-xl bg-[#13141b] border border-gray-800">
          <p className="text-gray-400 text-sm">No se encontraron resultados para esta búsqueda.</p>
          <p className="text-gray-600 text-xs mt-2">Intenta con términos como "Nigeria", "ATM", "fraude", etc.</p>
        </div>
      )}

      {matchedTx.length > 0 && (
        <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Transacciones ({matchedTx.length})
          </h3>
          <div className="space-y-3">
            {matchedTx.map(tx => (
              <div key={tx.id} className="p-3 rounded-lg bg-[#0a0a0f] border border-gray-800 flex items-center justify-between hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium text-sm">{tx.id}</span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold uppercase ${riskStyles[tx.actionState !== "pending" ? tx.actionState : tx.risk] || riskStyles[tx.risk]}`}>
                    {tx.actionState !== "pending" ? tx.actionState : tx.risk}
                  </span>
                  <span className="text-gray-500 text-xs">{tx.type}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{tx.location}</span>
                  <span className="text-white font-medium">{tx.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matchedAlerts.length > 0 && (
        <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-yellow-400" />
            Alertas ({matchedAlerts.length})
          </h3>
          <div className="space-y-3">
            {matchedAlerts.map(alert => (
              <div key={alert.id} className="p-3 rounded-lg bg-[#0a0a0f] border border-gray-800 flex items-center justify-between hover:border-gray-700 transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">{alert.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{alert.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-semibold ${severityStyles[alert.severity]}`}>
                  {alert.severity === "critical" ? "Crítico" : alert.severity === "warning" ? "Advertencia" : "Info"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
