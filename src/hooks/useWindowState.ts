import { useState, useEffect, useRef, useCallback } from 'react';
import type { WindowState, MotorState, ActivityLogEntry } from '@/types';

const now = () => Date.now();

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export function formatLogTime(ts: number): string {
  const d = new Date(ts);
  const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return `${dateStr} às ${formatTime(ts)}`;
}

export function formatLogTimeShort(ts: number): string {
  return formatTime(ts);
}

const initialState: WindowState = {
  windowName: 'Janela da sala',
  opening: 40,
  motorState: 'stopped',
  lastUpdated: now() - 1000 * 60 * 5,
  rainActive: false,
  rainAutoCloseEnabled: true,
  rainSensitivity: 'medium',
  rainHistory: [
    { id: 'r1', message: 'Fechada automaticamente - chuva detectada', timestamp: now() - 1000 * 60 * 60 * 2 },
    { id: 'r2', message: 'Reaberta manualmente após chuva', timestamp: now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5 },
    { id: 'r3', message: 'Fechada automaticamente - chuva detectada', timestamp: now() - 1000 * 60 * 60 * 24 },
    { id: 'r4', message: 'Sistema reiniciado', timestamp: now() - 1000 * 60 * 60 * 48 },
    { id: 'r5', message: 'Fechada automaticamente - chuva detectada', timestamp: now() - 1000 * 60 * 60 * 72 },
    { id: 'r6', message: 'Reaberta manualmente após chuva', timestamp: now() - 1000 * 60 * 60 * 72 + 1000 * 60 * 10 },
    { id: 'r7', message: 'Fechada automaticamente - chuva detectada', timestamp: now() - 1000 * 60 * 60 * 96 },
    { id: 'r8', message: 'Fechada automaticamente - chuva detectada', timestamp: now() - 1000 * 60 * 60 * 120 },
    { id: 'r9', message: 'Reaberta manualmente após chuva', timestamp: now() - 1000 * 60 * 60 * 120 + 1000 * 60 * 15 },
    { id: 'r10', message: 'Fechada automaticamente - chuva detectada', timestamp: now() - 1000 * 60 * 60 * 144 },
  ],
  activityHistory: [
    { id: 'a1', message: 'Fechada automaticamente às 14:32 - chuva detectada', timestamp: now() - 1000 * 60 * 30 },
    { id: 'a2', message: 'Aberta manualmente aos 40%', timestamp: now() - 1000 * 60 * 60 },
    { id: 'a3', message: 'Fechada manualmente', timestamp: now() - 1000 * 60 * 90 },
    { id: 'a4', message: 'Sistema conectado', timestamp: now() - 1000 * 60 * 120 },
  ],
  motorRunning: false,
  limitSwitchOpen: true,
  limitSwitchClosed: true,
  rainSensorOk: true,
  firmwareVersion: 'v0.9',
  appVersion: 'v1.2.0',
  ssid: 'Casa_2G',
};

export function useWindowState() {
  const [state, setState] = useState<WindowState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const targetRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addActivity = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      activityHistory: [
        { id: `a${Date.now()}`, message, timestamp: now() },
        ...prev.activityHistory,
      ].slice(0, 20),
    }));
  }, []);

  const addRainLog = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      rainHistory: [
        { id: `r${Date.now()}`, message, timestamp: now() },
        ...prev.rainHistory,
      ].slice(0, 30),
    }));
  }, []);

  const stopMotor = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    targetRef.current = null;
    setState((prev) => ({
      ...prev,
      motorState: 'stopped',
      motorRunning: false,
      lastUpdated: now(),
    }));
  }, []);

  const startMotor = useCallback((target: number, onArrive?: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    targetRef.current = target;

    intervalRef.current = setInterval(() => {
      const current = stateRef.current.opening;
      const tgt = targetRef.current;
      if (tgt === null) return;

      const diff = tgt - current;
      const step = 2;

      if (Math.abs(diff) <= step) {
        // Arrived
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        targetRef.current = null;
        setState((prev) => ({
          ...prev,
          opening: tgt,
          motorState: 'stopped',
          motorRunning: false,
          lastUpdated: now(),
        }));
        if (onArrive) onArrive();
      } else {
        const nextOpening = current + Math.sign(diff) * step;
        const motorState: MotorState = diff > 0 ? 'opening' : 'closing';
        setState((prev) => ({
          ...prev,
          opening: nextOpening,
          motorState,
          motorRunning: true,
          lastUpdated: now(),
        }));
      }
    }, 50);
  }, []);

  const openWindow = useCallback((target?: number) => {
    if (stateRef.current.rainActive) return;
    const t = target ?? 100;
    startMotor(t);
    addActivity(`Abrindo para ${t}%`);
  }, [startMotor, addActivity]);

  const closeWindow = useCallback((target?: number) => {
    const t = target ?? 0;
    startMotor(t);
    addActivity(`Fechando para ${t}%`);
  }, [startMotor, addActivity]);

  const stopWindow = useCallback(() => {
    stopMotor();
    addActivity(`Parada em ${stateRef.current.opening}%`);
  }, [stopMotor, addActivity]);

  const setOpening = useCallback((value: number) => {
    if (stateRef.current.rainActive) return;
    startMotor(value);
  }, [startMotor]);

  const setRainActive = useCallback((active: boolean) => {
    setState((prev) => ({
      ...prev,
      rainActive: active,
      lastUpdated: now(),
    }));
    if (active) {
      addRainLog('Chuva detectada - fechamento automático iniciado');
      addActivity('Fechada automaticamente - chuva detectada');
      startMotor(0);
    } else {
      addRainLog('Chuva cessou - fechamento automático desativado');
      addActivity('Sem chuva - fechamento automático inativo');
    }
  }, [addRainLog, addActivity, startMotor]);

  const setRainAutoClose = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, rainAutoCloseEnabled: enabled }));
    addActivity(enabled ? 'Fechamento automático ativado' : 'Fechamento automático desativado');
  }, [addActivity]);

  const setRainSensitivity = useCallback((s: WindowState['rainSensitivity']) => {
    setState((prev) => ({ ...prev, rainSensitivity: s }));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    state,
    openWindow,
    closeWindow,
    stopWindow,
    setOpening,
    setRainActive,
    setRainAutoClose,
    setRainSensitivity,
  };
}
