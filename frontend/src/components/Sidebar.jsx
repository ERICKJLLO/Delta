import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  BarChart3,
  Settings,
  Bot,
  LogOut,
  Lock,
} from "lucide-react";
import { usePlan } from "../context/PlanContext";

function Sidebar({ activeSection, setActiveSection, user, onLogout }) {
  const { canAccess, planDetails } = usePlan();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, feature: "dashboard" },
    { id: "transactions", label: "Transacciones", icon: Activity, feature: "transactions_view" },
    { id: "alerts", label: "Alertas", icon: AlertTriangle, feature: "alerts_basic" },
    { id: "analysis", label: "Análisis", icon: BarChart3, feature: "analysis" },
    { id: "delta-ai", label: "Delta AI", icon: Bot, feature: "delta_ai" },
    { id: "settings", label: "Configuración", icon: Settings, feature: "dashboard" },
  ];

  const contactName = user?.contact_name || user?.contactName || "Usuario Delta";
  const initials = contactName
    ? contactName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "UD";

  return (
    <div className="w-full lg:w-64 bg-[#0a0a0f] border-b lg:border-b-0 lg:border-r border-gray-800 h-auto lg:h-screen flex flex-col justify-between lg:flex-shrink-0">
      <div>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl text-white font-bold tracking-tight">Proyecto Delta</h1>
          <p className="text-xs text-gray-400 mt-1">Gestión de Riesgos IA</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isLocked = !canAccess(item.feature);
            
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isLocked && (
                  <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col">
        {/* Plan Badge */}
        <div className="mx-4 my-2 p-3.5 rounded-xl bg-gradient-to-r from-gray-900 to-[#12131a] border border-gray-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Tu Plan</span>
            <span className={`text-xs font-bold mt-0.5 ${
              planDetails.id === 'enterprise' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500' 
                : planDetails.id === 'professional' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 font-medium'
            }`}>
              {planDetails.name}
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 font-semibold">ACTIVO</span>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-3 px-4 py-1.5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">{contactName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "admin@delta.ai"}</p>
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

