import { useState } from 'react';
import { AlertTriangle, ArrowUp, Square, ArrowDown, Cog, CheckCircle2 } from 'lucide-react';
import type { WindowState } from '@/types';

interface Props {
  state: WindowState;
  onOpenFull: () => void;
  onCloseFull: () => void;
  onStop: () => void;
  onSetOpening: (v: number) => void;
}

function ComandoScreen({ state, onOpenFull, onCloseFull, onStop, onSetOpening }: Props) {
  const [sliderValue, setSliderValue] = useState(state.opening);

  // Keep slider in sync when state changes (motor animation, rain auto-close)
  const displayValue = state.motorRunning ? state.opening : sliderValue;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setSliderValue(v);
  };

  const handleSliderRelease = () => {
    onSetOpening(sliderValue);
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Comando Manual</h1>

      {/* Safety Alert Banner */}
      {state.rainActive && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-5 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-700">Bloqueado - chovendo</p>
            <p className="text-xs text-amber-600 mt-0.5">Fechando automaticamente. Comandos manuais de abertura desativados.</p>
          </div>
        </div>
      )}

      {/* Opening Percentage Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-600">Nível de abertura</h3>
          <span className="text-2xl font-bold text-slate-800">{displayValue}%</span>
        </div>

        {/* Visual Bar Slider */}
        <div className="relative mb-2">
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                state.rainActive ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${displayValue}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={displayValue}
            onChange={handleSliderChange}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            disabled={state.rainActive}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg pointer-events-none transition-all duration-150 ${
              state.rainActive ? 'bg-amber-400' : 'bg-emerald-500'
            }`}
            style={{ left: `${displayValue}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-5">
        <button
          onClick={onOpenFull}
          disabled={state.rainActive}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-white font-semibold transition-all duration-300 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ArrowUp size={20} />
          Abrir totalmente
        </button>
        <button
          onClick={onStop}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-200 text-slate-700 font-semibold transition-all duration-300 hover:bg-slate-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Square size={20} />
          Parar
        </button>
        <button
          onClick={onCloseFull}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 text-white font-semibold transition-all duration-300 hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowDown size={20} />
          Fechar totalmente
        </button>
      </div>

      {/* Hardware Status Indicators */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cog size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-600">Status do hardware</h3>
        </div>

        {/* Motor State */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${state.motorRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
            />
            <span className="text-sm text-slate-600">Motor</span>
          </div>
          <span className={`text-sm font-medium ${state.motorRunning ? 'text-emerald-600' : 'text-slate-400'}`}>
            {state.motorRunning ? (state.motorState === 'opening' ? 'Rodando - abrindo' : 'Rodando - fechando') : 'Motor parado'}
          </span>
        </div>

        {/* Limit Switches */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm text-slate-600">Fim de curso - aberto</span>
          </div>
          <span className={`text-sm font-medium ${state.limitSwitchOpen ? 'text-emerald-600' : 'text-red-500'}`}>
            {state.limitSwitchOpen ? 'OK' : 'Falha'}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm text-slate-600">Fim de curso - fechado</span>
          </div>
          <span className={`text-sm font-medium ${state.limitSwitchClosed ? 'text-emerald-600' : 'text-red-500'}`}>
            {state.limitSwitchClosed ? 'OK' : 'Falha'}
          </span>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm text-slate-600">Fim de curso</span>
          </div>
          <span className="text-sm font-medium text-emerald-600">OK</span>
        </div>
      </div>
    </div>
  );
}

export default ComandoScreen;
