import { AlertTriangle } from 'lucide-react';

interface AgeGateProps {
  onConfirm: () => void;
  onDeny: () => void;
}

export default function AgeGate({ onConfirm, onDeny }: AgeGateProps) {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full animate-scale-in">
        <div className="card p-8 text-center">
          <div className="mb-6">
            <img src="/logo.svg" alt="Pod Gorillas" className="w-24 h-24 mx-auto animate-float" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Pod Gorillas</h1>
          <p className="text-dark-400 text-sm mb-6">Matão - SP</p>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-100 text-sm leading-relaxed">
              Este site vende produtos derivados de tabaco. Venda proibida para menores de 18 anos.
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-6">
            Você tem 18 anos ou mais?
          </h2>

          <div className="flex flex-col gap-3">
            <button onClick={onConfirm} className="btn-primary py-4 text-lg">
              Sim, tenho 18+
            </button>
            <button onClick={onDeny} className="btn-ghost py-3 text-sm text-dark-400">
              Não, sou menor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
