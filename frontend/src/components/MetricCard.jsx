const trendColors = {
  up: "text-red-400",
  down: "text-green-400",
  neutral: "text-gray-400",
};

function MetricCard({ title, value, change, icon: Icon, trend = "neutral" }) {
  return (
    <div className="p-5 rounded-xl bg-[#13141b] border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
        )}
        {change && (
          <span className={`text-sm ${trendColors[trend]}`}>{change}</span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl text-white">{value}</p>
    </div>
  );
}

export default MetricCard;
