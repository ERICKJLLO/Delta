import { Bell, Search } from "lucide-react";

function Header() {
  return (
    <div className="h-16 bg-[#0a0a0f] border-b border-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar transacciones, alertas, eventos..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="text-sm text-white">Sistema Activo</p>
          <p className="text-xs text-green-400 flex items-center justify-end gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Monitoreando en tiempo real
          </p>
        </div>

        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </div>
  );
}

export default Header;
