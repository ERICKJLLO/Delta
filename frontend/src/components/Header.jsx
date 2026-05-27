import { useState, useEffect, useRef } from "react";
import { Bell, Search, X, Check, CheckCheck, Trash2 } from "lucide-react";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "NOTIF-INIT-1",
    title: "Sistema Delta Activado",
    message: "Tu monitoreo de riesgo en tiempo real está operando al 100%.",
    time: "Hace 1 min",
    type: "success",
    read: false,
    timestamp: Date.now() - 60000
  },
  {
    id: "NOTIF-INIT-2",
    title: "Alerta de Riesgo Elevado ⚠️",
    message: "Se detectaron 3 transacciones sospechosas desde Nigeria en la última hora.",
    time: "Hace 5 min",
    type: "error",
    read: false,
    timestamp: Date.now() - 300000
  },
  {
    id: "NOTIF-INIT-3",
    title: "Nuevo reporte disponible",
    message: "El reporte mensual de riesgos de mayo ya está listo para descarga.",
    time: "Hace 15 min",
    type: "info",
    read: false,
    timestamp: Date.now() - 900000
  }
];

const typeStyles = {
  success: "border-l-green-500 bg-green-500/5",
  error: "border-l-red-500 bg-red-500/5",
  info: "border-l-blue-500 bg-blue-500/5",
  warning: "border-l-yellow-500 bg-yellow-500/5"
};

const typeDots = {
  success: "bg-green-400",
  error: "bg-red-400",
  info: "bg-blue-400",
  warning: "bg-yellow-400"
};

function Header({ company, monitoring = true, searchQuery, onSearchChange, onNotificationClick }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("delta_notifications");
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sincronizar notificaciones desde localStorage (cuando TransactionList las añade)
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("delta_notifications");
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    };
    window.addEventListener("delta_notifications_updated", handleSync);
    return () => window.removeEventListener("delta_notifications_updated", handleSync);
  }, []);

  // Cerrar popover al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveNotifications = (newList) => {
    localStorage.setItem("delta_notifications", JSON.stringify(newList));
    setNotifications(newList);
    window.dispatchEvent(new Event("delta_notifications_updated"));
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const removeNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  return (
    <div className="bg-[#0a0a0f] border-b border-gray-800 px-4 sm:px-6 py-3 lg:py-0 lg:h-16 flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center lg:justify-between relative z-30">
      {company && (
        <p className="text-sm text-gray-400 hidden lg:block mr-4 shrink-0">
          {company}
        </p>
      )}
      <div className="flex items-center gap-4 flex-1 w-full max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Buscar transacciones, alertas, eventos..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
        <div className="text-left lg:text-right mr-0 lg:mr-4">
          <p className="text-sm text-white">Sistema Activo</p>
          <p className="text-xs text-green-400 flex items-center justify-end gap-1">
            <span className={`w-2 h-2 rounded-full animate-pulse ${monitoring ? "bg-green-400" : "bg-gray-500"}`} />
            {monitoring ? "Monitoreando en tiempo real" : "Monitoreo pausado"}
          </p>
        </div>

        {/* Botón de Notificaciones */}
        <div className="relative">
          <button
            ref={bellRef}
            type="button"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className={`w-5 h-5 transition-colors ${isPopoverOpen ? "text-blue-400" : "text-gray-400"}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popover de Notificaciones */}
          {isPopoverOpen && (
            <div
              ref={popoverRef}
                className="absolute right-0 top-full mt-2 w-[90vw] sm:w-96 max-h-[480px] bg-[#13141b]/95 backdrop-blur-xl border border-gray-700/60 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50"
              style={{
                animation: "popoverIn 0.2s ease-out"
              }}
            >
              {/* Header del Popover */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h4 className="text-white text-sm font-semibold">Notificaciones</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Marcar todas como leídas"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors"
                      title="Borrar todas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de Notificaciones */}
              <div className="overflow-y-auto max-h-[380px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No hay notificaciones</p>
                    <p className="text-xs text-gray-600 mt-1">Las alertas aparecerán aquí</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`relative p-3.5 border-b border-gray-800/50 border-l-2 transition-all hover:bg-white/[0.02] cursor-pointer group ${
                        typeStyles[notif.type] || typeStyles.info
                      } ${notif.read ? "opacity-60" : ""}`}
                      onClick={() => {
                        markAsRead(notif.id);
                        setIsPopoverOpen(false);
                        onNotificationClick?.(notif);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Indicador de no leído */}
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-all ${
                          notif.read ? "bg-gray-700" : (typeDots[notif.type] || typeDots.info)
                        }`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className={`text-xs font-semibold truncate ${notif.read ? "text-gray-400" : "text-white"}`}>
                              {notif.title}
                            </h5>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                              className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-gray-600">{notif.time}</span>
                            {!notif.read && (
                              <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Nueva
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
