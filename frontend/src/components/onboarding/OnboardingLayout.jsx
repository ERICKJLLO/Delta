import { Shield } from "lucide-react";

function OnboardingLayout({ title, subtitle, step, totalSteps, children }) {
  return (
    <div className="min-h-screen bg-[#0d0e14] flex flex-col items-center justify-start px-4 py-8 sm:px-6 sm:py-10 sm:justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">Proyecto Delta</span>
          </div>
          {step && (
            <p className="text-sm text-gray-500 mb-2">
              Paso {step} de {totalSteps}
            </p>
          )}
          <h1 className="text-2xl font-medium text-white mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
        <div className="p-6 sm:p-8 rounded-xl bg-[#13141b] border border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}

export default OnboardingLayout;
