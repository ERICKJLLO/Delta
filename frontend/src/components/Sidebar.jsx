import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transacciones", icon: Activity },
    { id: "alerts", label: "Alertas", icon: AlertTriangle },
    { id: "analysis", label: "Análisis", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#0a0a0f] border-r border-gray-800 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl text-white">Proyecto Delta</h1>
        <p className="text-xs text-gray-400 mt-1">Gestión de Riesgos IA</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@delta.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
