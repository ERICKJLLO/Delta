import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      
      <Sidebar />

      <main className="flex-1 p-8 text-white">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome to Proyecto Delta
        </p>
      </main>

    </div>
  );
}

export default App;