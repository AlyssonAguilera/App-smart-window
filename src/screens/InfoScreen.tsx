import { Cpu, Wifi, CheckCircle2, XCircle, Activity } from 'lucide-react';
import type { WindowState } from '@/types';

interface Props {
  state: WindowState;
}

function InfoScreen({ state }: Props) {
  const sensors = [
    { label: 'Fim de curso - aberto', ok: state.limitSwitchOpen },
    { label: 'Fim de curso - fechado', ok: state.limitSwitchClosed },
    { label: 'Sensor de chuva', ok: state.rainSensorOk },
  ];

  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Informações do Sistema</h1>

      {/* Microcontroller Specs */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
            <Cpu size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-700">Controlador</h3>
            <p className="text-xs text-slate-400">Microcontrolador principal</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-400">Modelo</span>
            <span className="text-sm font-medium text-slate-600">ESP32 DevKit V1</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-400">Firmware</span>
            <span className="text-sm font-medium text-slate-600">{state.firmwareVersion}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-slate-400">Conexão</span>
            <span className="text-sm font-medium text-emerald-600">Online</span>
          </div>
        </div>
      </div>

      {/* Wi-Fi Status */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Wifi size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-700">Wi-Fi</h3>
            <p className="text-xs text-slate-400">Conexão de rede</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-400">Rede (SSID)</span>
            <span className="text-sm font-medium text-slate-600">{state.ssid}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-400">Status</span>
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Conectado
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-slate-400">Sinal</span>
            <span className="text-sm font-medium text-slate-600">Excelente</span>
          </div>
        </div>
      </div>

      {/* Sensor Diagnostics */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-600">Diagnóstico dos sensores</h3>
        </div>
        <div className="space-y-1">
          {sensors.map((sensor) => (
            <div key={sensor.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-600">{sensor.label}</span>
              <div className="flex items-center gap-2">
                {sensor.ok ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <XCircle size={18} className="text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${sensor.ok ? 'text-emerald-600' : 'text-red-500'}`}
                >
                  {sensor.ok ? 'OK' : 'Falha'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Version Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-300">Smart Window Controller</p>
        <p className="text-xs text-slate-400 mt-1">App {state.appVersion}</p>
      </div>
    </div>
  );
}

export default InfoScreen;
