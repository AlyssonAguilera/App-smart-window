import { MoreVertical, CloudRain, Sun, ArrowUp, Square, ArrowDown, Clock, Activity } from 'lucide-react';
import type { WindowState } from '@/types';
import { formatLogTimeShort } from '@/hooks/useWindowState';

interface Props {
  state: WindowState;
  onOpen: () => void;
  onClose: () => void;
  onStop: () => void;
}

function HomeScreen({ state, onOpen, onClose, onStop }: Props) {
  const openingLabel =
    state.opening === 0
      ? 'Fechada'
      : state.opening === 100
      ? 'Aberta'
      : `Aberta ${state.opening}%`;

  const motorLabel =
    state.motorState === 'opening'
      ? 'Abrindo…'
      : state.motorState === 'closing'
      ? 'Fechando…'
      : openingLabel;

  const lastUpdatedStr = (() => {
    const diff = Date.now() - state.lastUpdated;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora mesmo';
    if (mins < 60) return `há ${mins} min`;
    const hours = Math.floor(mins / 60);
    return `há ${hours}h`;
  })();

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Smart Window</p>
          <h1 className="text-2xl font-bold text-slate-800">{state.windowName}</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">Estado atual</span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            <span>{lastUpdatedStr}</span>
          </div>
        </div>

        {/* Animated Visual Indicator */}
        <div className="flex items-center justify-center my-6">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={state.rainActive ? '#f59e0b' : '#10b981'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(state.opening / 100) * 327} 327`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{state.opening}%</span>
              <span className="text-xs text-slate-400 mt-1">{state.motorRunning ? motorLabel : 'abertura'}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700">{motorLabel}</p>
        </div>
      </div>

      {/* Rain Status Widget */}
      <div
        className={`rounded-2xl p-4 mb-4 flex items-center gap-3 transition-all duration-300 ${
          state.rainActive
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-white border border-slate-100 shadow-sm'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            state.rainActive ? 'bg-amber-400' : 'bg-emerald-100'
          }`}
        >
          {state.rainActive ? (
            <CloudRain size={22} className="text-white" />
          ) : (
            <Sun size={22} className="text-emerald-500" />
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${state.rainActive ? 'text-amber-700' : 'text-slate-700'}`}>
            {state.rainActive ? 'Chuva detectada' : 'Sem chuva'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {state.rainActive
              ? 'Fechamento automático ativo'
              : 'Fechamento automático inativo'}
          </p>
        </div>
        {state.rainActive && (
          <span className="px-2.5 py-1 bg-amber-400 text-white text-[10px] font-bold rounded-full uppercase tracking-wide animate-pulse">
            Alerta
          </span>
        )}
      </div>

      {/* Quick Action Controls */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={onOpen}
          disabled={state.rainActive}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-semibold text-sm transition-all duration-300 hover:bg-emerald-100 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ArrowUp size={24} />
          Abrir
        </button>
        <button
          onClick={onStop}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-slate-100 text-slate-600 font-semibold text-sm transition-all duration-300 hover:bg-slate-200 hover:scale-105 active:scale-95"
        >
          <Square size={22} />
          Parar
        </button>
        <button
          onClick={onClose}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-slate-800 text-white font-semibold text-sm transition-all duration-300 hover:bg-slate-900 hover:scale-105 active:scale-95"
        >
          <ArrowDown size={24} />
          Fechar
        </button>
      </div>

      {/* Activity Badge / Recent History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-600">Atividade recente</h3>
        </div>
        <div className="space-y-3">
          {state.activityHistory.slice(0, 4).map((entry) => (
            <div key={entry.id} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">{entry.message}</p>
                <p className="text-xs text-slate-300 mt-0.5">{formatLogTimeShort(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
