"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Device } from "./types";

const STORAGE_KEY = "lastro.devices.v1";

type DevicesContextValue = {
  devices: Device[];
  serialExists: (serial: string) => boolean;
  addDevice: (device: Device) => void;
  addDevices: (devices: Device[]) => void;
  clearAll: () => void;
  hydrated: boolean;
};

const DevicesContext = createContext<DevicesContextValue | null>(null);

export function DevicesProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDevices(JSON.parse(raw) as Device[]);
      }
    } catch {
      // ignore parse errors — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch {
      // ignore quota errors — MVP
    }
  }, [devices, hydrated]);

  const serialExists = useCallback(
    (serial: string) =>
      devices.some(
        (d) => d.serial.trim().toLowerCase() === serial.trim().toLowerCase(),
      ),
    [devices],
  );

  const addDevice = useCallback(
    (device: Device) => setDevices((prev) => [device, ...prev]),
    [],
  );

  const addDevices = useCallback(
    (batch: Device[]) => setDevices((prev) => [...batch, ...prev]),
    [],
  );

  const clearAll = useCallback(() => setDevices([]), []);

  const value = useMemo(
    () => ({ devices, serialExists, addDevice, addDevices, clearAll, hydrated }),
    [devices, serialExists, addDevice, addDevices, clearAll, hydrated],
  );

  return (
    <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
  );
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error("useDevices must be used inside DevicesProvider");
  return ctx;
}
