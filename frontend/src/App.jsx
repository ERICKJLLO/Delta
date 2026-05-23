import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex bg-[#0d0e14] min-h-screen">
      
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

      <main className="flex-1 overflow-auto p-6 text-white">

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

    </div>
  );
}

export default App;