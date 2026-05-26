import { useState, useEffect } from "react";
import { Lock, Search, CheckCircle, HelpCircle, ShieldAlert } from "lucide-react";
import { usePlan } from "../context/PlanContext";

const INITIAL_TRANSACTIONS = [
  {
    id: "TX-7482",
    amount: "$45,230.00",
    account: "****3847",
    location: "Nigeria",
    time: "Hace 2 min",
    risk: "high",
    type: "Transferencia internacional",
    actionState: "pending" // pending | blocked | investigating | safe
  },
  {
    id: "TX-7481",
    amount: "$8,450.00",
    account: "****9234",
    location: "Rusia",
    time: "Hace 5 min",
    risk: "high",
    type: "Retiro ATM",
    actionState: "pending"
  },
  {
    id: "TX-7480",
    amount: "$2,340.00",
    account: "****5621",
    location: "México",
    time: "Hace 12 min",
    risk: "medium",
    type: "Compra en línea",
    actionState: "pending"
  },
  {
    id: "TX-7479",
    amount: "$15,780.00",
    account: "****8901",
    location: "China",
    time: "Hace 18 min",
    risk: "medium",
    type: "Transferencia",
    actionState: "pending"
  },
  {
    id: "TX-7478",
    amount: "$890.00",
    account: "****4532",
    location: "España",
    time: "Hace 25 min",
    risk: "low",
    type: "Compra local",
    actionState: "pending"
  },
];

const riskStyles = {
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-green-400 bg-green-500/10 border-green-500/30",
  blocked: "text-red-500 bg-red-600/20 border-red-600/40 font-bold",
  investigating: "text-blue-400 bg-blue-500/10 border-blue-500/30 font-semibold"
};

const riskLabels = {
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
  blocked: "Bloqueada",
  investigating: "En Investigación"
};

function TransactionList({ searchQuery }) {
  const { canAccess } = usePlan();
  const [txList, setTxList] = useState(() => {
    const saved = localStorage.getItem("delta_suspicious_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [toastMessage, setToastMessage] = useState("");

  const filteredTx = txList.filter(tx => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      tx.id.toLowerCase().includes(q) ||
      tx.amount.toLowerCase().includes(q) ||
      tx.account.toLowerCase().includes(q) ||
      tx.location.toLowerCase().includes(q) ||
      tx.type.toLowerCase().includes(q)
    );
  });

  // Guardar en localStorage cuando cambie y disparar evento de sincronización
  const updateList = (newList) => {
    localStorage.setItem("delta_suspicious_transactions", JSON.stringify(newList));
    setTxList(newList);
    window.dispatchEvent(new Event("delta_transactions_updated"));
  };

  // Sincronizar estado entre diferentes instancias del componente en tiempo real
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

  // Agregar una notificación al popover global
  const addNotification = (title, message, type = "info") => {
    const saved = localStorage.getItem("delta_notifications");
    const currentNotifs = saved ? JSON.parse(saved) : [];
    
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      time: "Ahora",
      type,
      read: false,
      timestamp: Date.now()
    };
    
    localStorage.setItem("delta_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    window.dispatchEvent(new Event("delta_notifications_updated"));
  };

  const handleAction = (id, action) => {
    if (!canAccess("transactions_actions")) {
      window.dispatchEvent(new CustomEvent("delta_open_upgrade_modal", {
        detail: { plan: "Profesional" }
      }));
      return;
    }
    const transaction = txList.find(t => t.id === id);
    if (!transaction) return;

    let updatedList = [...txList];
    let toast = "";

    if (action === "safe") {
      // Si es segura, la removemos de la lista sospechosa
      updatedList = txList.filter(t => t.id !== id);
      toast = `Transacción ${id} marcada como Segura y removida de alertas.`;
      addNotification("Transacción Aprobada", `La transacción ${id} por valor de ${transaction.amount} ha sido marcada como Segura.`, "success");
    } else {
      // Actualizar estado de acción (blocked | investigating)
      updatedList = txList.map(t => {
        if (t.id === id) {
          return { ...t, actionState: action };
        }
        return t;
      });

      if (action === "blocked") {
        toast = `Transacción ${id} bloqueada por sospecha de fraude.`;
        addNotification("Transacción Bloqueada 🔒", `Se ha bloqueado preventivamente la transacción ${id} (${transaction.amount}).`, "error");
      } else if (action === "investigating") {
        toast = `Transacción ${id} enviada al panel de investigación de analistas.`;
        addNotification("Bajo Investigación 🔍", `Iniciando protocolo de análisis avanzado en cuenta ${transaction.account} para ${id}.`, "info");
      }
    }

    updateList(updatedList);
    setToastMessage(toast);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const criticalCount = txList.filter(t => t.risk === "high" && t.actionState === "pending").length;

  return (
    <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800 relative overflow-hidden">
      
      {/* Toast Alert de Éxito Interactivo */}
      {toastMessage && (
        <div className="absolute top-4 right-4 left-4 p-3 bg-blue-600 border border-blue-500 rounded-lg text-white text-xs font-semibold flex items-center justify-between shadow-lg shadow-black/50 z-20 animate-slideDown">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage("")} className="text-white/70 hover:text-white">
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">Transacciones Sospechosas</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
          criticalCount > 0 ? "bg-red-500/20 text-red-400" : "bg-gray-800 text-gray-400"
        }`}>
          {criticalCount} críticas pendientes
        </span>
      </div>

      {filteredTx.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg bg-[#0a0a0f]">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3 animate-pulse" />
          <p className="text-white text-sm font-medium">¡Todo Bajo Control!</p>
          <p className="text-gray-500 text-xs mt-1">No hay alertas de transacciones sospechosas pendientes.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredTx.map((transaction) => {
            const isBlocked = transaction.actionState === "blocked";
            const isInvestigating = transaction.actionState === "investigating";
            const isPending = transaction.actionState === "pending" || !transaction.actionState;
            
            // Determinar estilo y etiqueta según acción tomada
            let activeStyle = riskStyles[transaction.risk];
            let activeLabel = riskLabels[transaction.risk];
            if (isBlocked) {
              activeStyle = riskStyles.blocked;
              activeLabel = riskLabels.blocked;
            } else if (isInvestigating) {
              activeStyle = riskStyles.investigating;
              activeLabel = riskLabels.investigating;
            }

            return (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border transition-all ${
                  isBlocked 
                    ? "border-red-900/40 bg-red-950/5 opacity-80" 
                    : isInvestigating 
                      ? "border-blue-900/30 bg-blue-950/5"
                      : "border-gray-800 hover:border-gray-700 bg-[#0a0a0f]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-white font-medium text-sm">{transaction.id}</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${activeStyle}`}>
                        {activeLabel}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">{transaction.type}</p>
                  </div>
                  <span className={`text-lg font-bold ${isBlocked ? "text-gray-500 line-through" : "text-white"}`}>
                    {transaction.amount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-900/30 p-2 rounded border border-gray-800/40">
                  <span>Cuenta: <span className="text-gray-300 font-medium">{transaction.account}</span></span>
                  <span>Origen: <span className="text-gray-300 font-medium">{transaction.location}</span></span>
                  <span>{transaction.time}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!isPending}
                    onClick={() => handleAction(transaction.id, "blocked")}
                    className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium ${
                      isBlocked
                        ? "bg-red-900/10 text-red-500/60 border border-red-950/20 cursor-not-allowed"
                        : isInvestigating
                          ? "bg-gray-800/30 text-gray-600 border border-gray-900 cursor-not-allowed opacity-50"
                          : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 active:scale-95"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {isBlocked ? "Bloqueada" : "Bloquear"}
                  </button>

                  <button
                    type="button"
                    disabled={!isPending}
                    onClick={() => handleAction(transaction.id, "investigating")}
                    className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium ${
                      isInvestigating
                        ? "bg-blue-900/10 text-blue-500/60 border border-blue-950/20 cursor-not-allowed"
                        : isBlocked
                          ? "bg-gray-800/30 text-gray-600 border border-gray-900 cursor-not-allowed opacity-50"
                          : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 active:scale-95"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    {isInvestigating ? "Investigando" : "Investigar"}
                  </button>

                  <button
                    type="button"
                    disabled={isBlocked || isInvestigating}
                    onClick={() => handleAction(transaction.id, "safe")}
                    className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium ${
                      isBlocked || isInvestigating
                        ? "bg-gray-800/30 text-gray-600 border border-gray-900 cursor-not-allowed opacity-30"
                        : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 active:scale-95"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Segura
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Icono simple de X
function XIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default TransactionList;
