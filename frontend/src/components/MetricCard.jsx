function MetricCard({ title, value, color }) {
    return (
      <div className="bg-slate-900 p-6 rounded-2xl shadow-lg flex flex-col gap-2">
        
        <span className="text-slate-400 text-sm">
          {title}
        </span>
  
        <h2 className={`text-3xl font-bold ${color}`}>
          {value}
        </h2>
  
      </div>
    );
  }
  
  export default MetricCard;