import { CloudRain, Sun, Radio } from 'lucide-react';
import type { WindowState } from '@/types';

interface Props {
  state: WindowState;
  onToggleRain: () => void;
}

function SimulationToolbar({ state, onToggleRain }: Props) {
  return (
    <div className="w-full max-w-[420px] px-3 py-2 flex items-center gap-2 bg-slate-800 text-white text-xs">
      <div className="flex items-center gap-1.5 text-slate-300">
        <Radio size={14} className="text-emerald-400 animate-pulse" />
        <span className="font-medium">Simulação</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span className="text-slate-400">
          {state.motorRunning ? (
            <span className="text-amber-400">Motor: {state.motorState === 'opening' ? 'Abrindo' : 'Fechando'}…</span>
          ) : (
            <span className="text-slate-500">Motor parado</span>
          )}
        </span>
        <button
          onClick={onToggleRain}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all duration-300 ${
            state.rainActive
              ? 'bg-sky-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {state.rainActive ? <CloudRain size={14} /> : <Sun size={14} />}
          {state.rainActive ? 'Chovendo' : 'Sem chuva'}
        </button>
      </div>
    </div>
  );
}

export default SimulationToolbar;
