import { Lock, Search, CheckCircle } from "lucide-react";

const transactions = [
  {
    id: "TX-7482",
    amount: "$45,230.00",
    account: "****3847",
    location: "Nigeria",
    time: "Hace 2 min",
    risk: "high",
    type: "Transferencia internacional",
  },
  {
    id: "TX-7481",
    amount: "$8,450.00",
    account: "****9234",
    location: "Rusia",
    time: "Hace 5 min",
    risk: "high",
    type: "Retiro ATM",
  },
  {
    id: "TX-7480",
    amount: "$2,340.00",
    account: "****5621",
    location: "México",
    time: "Hace 12 min",
    risk: "medium",
    type: "Compra en línea",
  },
  {
    id: "TX-7479",
    amount: "$15,780.00",
    account: "****8901",
    location: "China",
    time: "Hace 18 min",
    risk: "medium",
    type: "Transferencia",
  },
  {
    id: "TX-7478",
    amount: "$890.00",
    account: "****4532",
    location: "España",
    time: "Hace 25 min",
    risk: "low",
    type: "Compra local",
  },
];

const riskStyles = {
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-green-400 bg-green-500/10 border-green-500/30",
};

const riskLabels = {
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

function TransactionList() {
  return (
    <div className="p-6 rounded-xl bg-[#13141b] border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white">Transacciones Sospechosas</h3>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
          {transactions.filter((t) => t.risk === "high").length} críticas
        </span>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 rounded-lg bg-[#0a0a0f] border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white">{transaction.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded border text-xs ${riskStyles[transaction.risk]}`}
                  >
                    {riskLabels[transaction.risk]}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{transaction.type}</p>
              </div>
              <span className="text-xl text-white">{transaction.amount}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>Cuenta: {transaction.account}</span>
              <span>{transaction.location}</span>
              <span>{transaction.time}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Bloquear
              </button>
              <button
                type="button"
                className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Investigar
              </button>
              <button
                type="button"
                className="flex-1 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Segura
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
