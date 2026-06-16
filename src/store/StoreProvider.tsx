'use client';

/**
 * StoreProvider
 *
 * Wraps the application in the Redux Provider.
 * Must be a Client Component because Redux uses React context internally.
 *
 * A new store instance is created per request on the server (if this were
 * ever rendered server-side), but in practice this component is only
 * rendered on the client because it is nested inside the root layout's
 * Providers wrapper which is also 'use client'.
 */
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import type { AppStore } from './store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Use a ref so the same store instance is reused across re-renders
  const storeRef = useRef<AppStore>(store);
  return <Provider store={storeRef.current}>{children}</Provider>;
}
