import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const justRegistered = location.state?.registered;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = await login(email.trim().toLowerCase(), password);
    if (!result.success) {
      setError(result.error || "Correo o contraseña incorrectos. Verifica tus credenciales.");
      return;
    }
    navigate("/dashboard");
  }

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="min-h-screen bg-[#0d0e14] flex flex-col items-center justify-start px-4 py-8 sm:px-6 sm:py-10 sm:justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">Proyecto Delta</span>
          </div>
          <h1 className="text-2xl font-medium text-white mb-2">Inicio de sesión</h1>
          <p className="text-gray-400">Ingresa con tu correo y contraseña empresarial</p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[#13141b] border border-gray-800">
          {justRegistered && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">Cuenta activada. Ya puedes iniciar sesión.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="contacto@empresa.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Ingresar al dashboard
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-blue-400 hover:text-blue-300">
              Registra tu empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
