import {
    LayoutDashboard,
    ShieldAlert,
    BarChart3,
    Settings,
  } from "lucide-react";
  
  function Sidebar() {
    return (
      <div className="w-64 h-screen bg-slate-900 text-white p-6 flex flex-col">
        
        <h1 className="text-2xl font-bold text-blue-500 mb-10">
          Proyecto Delta
        </h1>
  
        <nav className="flex flex-col gap-4">
  
          <button className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
  
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition">
            <ShieldAlert size={20} />
            Alerts
          </button>
  
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition">
            <BarChart3 size={20} />
            Analytics
          </button>
  
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition mt-auto">
            <Settings size={20} />
            Settings
          </button>
  
        </nav>
      </div>
    );
  }
  
  export default Sidebar;