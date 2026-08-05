import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import PlanSelectionPage from "./pages/PlanSelectionPage";
import QuotePage from "./pages/QuotePage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function HomeRedirect() {
  // Redirigir siempre al dashboard (sin login)
  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/registro/plan" element={<PlanSelectionPage />} />
      <Route path="/registro/cotizacion" element={<QuotePage />} />
      <Route path="/registro/pago" element={<PaymentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
