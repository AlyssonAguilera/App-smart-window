import { useState } from 'react';
import { Home, SlidersHorizontal, CloudRain, Info } from 'lucide-react';
import type { Screen } from '@/types';
import { useWindowState } from '@/hooks/useWindowState';
import HomeScreen from '@/screens/HomeScreen';
import ComandoScreen from '@/screens/ComandoScreen';
import ChuvaScreen from '@/screens/ChuvaScreen';
import InfoScreen from '@/screens/InfoScreen';
import SimulationToolbar from '@/components/SimulationToolbar';

const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'comando', label: 'Comando', icon: SlidersHorizontal },
  { id: 'chuva', label: 'Chuva', icon: CloudRain },
  { id: 'info', label: 'Info', icon: Info },
];

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const {
    state,
    openWindow,
    closeWindow,
    stopWindow,
    setOpening,
    setRainActive,
    setRainAutoClose,
    setRainSensitivity,
  } = useWindowState();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Simulation Toolbar */}
      <SimulationToolbar state={state} onToggleRain={() => setRainActive(!state.rainActive)} />

      {/* Phone Frame */}
      <div className="w-full max-w-[420px] min-h-screen bg-slate-50 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Screen Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {screen === 'home' && (
            <HomeScreen state={state} onOpen={() => openWindow(100)} onClose={() => closeWindow(0)} onStop={stopWindow} />
          )}
          {screen === 'comando' && (
            <ComandoScreen
              state={state}
              onOpenFull={() => openWindow(100)}
              onCloseFull={() => closeWindow(0)}
              onStop={stopWindow}
              onSetOpening={setOpening}
            />
          )}
          {screen === 'chuva' && (
            <ChuvaScreen
              state={state}
              onToggleAutoClose={() => setRainAutoClose(!state.rainAutoCloseEnabled)}
              onSetSensitivity={setRainSensitivity}
            />
          )}
          {screen === 'info' && <InfoScreen state={state} />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-2 py-2 pb-3 flex justify-around items-center z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                  active
                    ? 'text-emerald-600 bg-emerald-50 scale-105'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[11px] font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default App;
