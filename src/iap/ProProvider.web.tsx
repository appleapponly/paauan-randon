/**
 * TEMP web stub (for local screenshot generation only) — expo-iap has no web
 * native module, so useIAP() throws at runtime. Mirrors ProProvider's context
 * shape with no-op buy/restore so screens that call usePro() don't crash.
 */
import { createContext, useContext, useMemo } from 'react';

interface ProContextValue {
  prices: Record<string, string>;
  connected: boolean;
  buy: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
}

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<ProContextValue>(
    () => ({
      prices: {},
      connected: false,
      buy: async () => {},
      restore: async () => {},
    }),
    []
  );
  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used within ProProvider');
  return ctx;
}
