import Sidebar from "./components/Sidebar";
import MetricCard from "./components/MetricCard";

function App() {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      
      <Sidebar />

      <main className="flex-1 p-8 text-white">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2 mb-8">
          Welcome to Proyecto Delta
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <MetricCard
            title="Active Risks"
            value="128"
            color="text-red-500"
          />

          <MetricCard
            title="Critical Alerts"
            value="23"
            color="text-yellow-400"
          />

          <MetricCard
            title="Protected Assets"
            value="1,204"
            color="text-green-500"
          />

          <MetricCard
            title="Security Score"
            value="92%"
            color="text-blue-500"
          />

        </div>

      </main>

    </div>
  );
}

export default App;