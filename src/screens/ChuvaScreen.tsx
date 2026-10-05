import { CloudRain, CloudOff, History } from 'lucide-react';
import type { WindowState, RainSensitivity } from '@/types';
import { formatLogTime } from '@/hooks/useWindowState';

interface Props {
  state: WindowState;
  onToggleAutoClose: () => void;
  onSetSensitivity: (s: RainSensitivity) => void;
}

const sensitivityLabels: Record<RainSensitivity, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

function ChuvaScreen({ state, onToggleAutoClose, onSetSensitivity }: Props) {
  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Automação de Chuva</h1>

      {/* Toggle Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
              state.rainAutoCloseEnabled ? 'bg-emerald-100' : 'bg-slate-100'
            }`}
          >
            {state.rainAutoCloseEnabled ? (
              <CloudRain size={26} className="text-emerald-600" />
            ) : (
              <CloudOff size={26} className="text-slate-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-700">Fechar ao chover</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {state.rainAutoCloseEnabled ? 'Ativado' : 'Desativado'}
            </p>
          </div>
          {/* Toggle Switch */}
          <button
            onClick={onToggleAutoClose}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
              state.rainAutoCloseEnabled ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                state.rainAutoCloseEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Sensitivity Selector */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">Sensibilidade do sensor</h3>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as RainSensitivity[]).map((s) => (
            <button
              key={s}
              onClick={() => onSetSensitivity(s)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                state.rainSensitivity === s
                  ? 'bg-emerald-500 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {sensitivityLabels[s]}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          {state.rainSensitivity === 'low' && 'Detecta apenas chuva forte.'}
          {state.rainSensitivity === 'medium' && 'Detecta chuva moderada e forte.'}
          {state.rainSensitivity === 'high' && 'Detecta qualquer gota de chuva.'}
        </p>
      </div>

      {/* Current Rain Status */}
      <div
        className={`rounded-2xl p-4 mb-4 flex items-center gap-3 transition-all duration-300 ${
          state.rainActive
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-emerald-50 border border-emerald-100'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            state.rainActive ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
        >
          <CloudRain size={18} className="text-white" />
        </div>
        <div>
          <p className={`text-sm font-semibold ${state.rainActive ? 'text-amber-700' : 'text-emerald-700'}`}>
            {state.rainActive ? 'Chuva ativa' : 'Sem chuva detectada'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {state.rainActive ? 'Fechamento automático em execução' : 'Monitoramento ativo'}
          </p>
        </div>
      </div>

      {/* Log History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-600">Histórico de acionamentos</h3>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {state.rainHistory.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">{entry.message}</p>
                <p className="text-xs text-slate-300 mt-0.5">{formatLogTime(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChuvaScreen;
