'use client';

/**
 * Providers
 *
 * Single client-boundary wrapper that composes all global providers.
 * Placed at the root layout level so every page in the app has access to:
 *   - Redux store (via StoreProvider)
 *   - TanStack React Query (via QueryClientProvider)
 *   - Radix UI Tooltip context (via TooltipProvider)
 *   - Theme context for Sonner (via ThemeProvider from next-themes)
 *   - Toast notifications (Sonner)
 *
 * Rules:
 *   - This file must stay 'use client' — it uses browser-only React context.
 *   - Do NOT add server-only logic here.
 *   - Do NOT import feature modules here.
 *   - Keep this file thin — it is a composition root only.
 */

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { StoreProvider } from '@/store/StoreProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sonner } from '@/components/ui/sonner';
import { AuthInitializer } from '@/components/shared/AuthInitializer';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  /**
   * QueryClient is created with useState so each component tree gets its own
   * instance. This is the recommended App Router pattern — it prevents the
   * client from sharing state with the server and avoids cross-request
   * data leakage if server rendering is ever used.
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 0 — matches TanStack Query v5 library default.
            // V1 set no global staleTime; some pages override per-query
            // (e.g. wallet: 30 s / 60 s, users: 0). Carry those overrides
            // forward when migrating those feature pages.
            staleTime: 0,
            // retry: false — INTENTIONAL DIVERGENCE FROM V1.
            // V1 set no global retry config, so it inherited the library
            // default of retry: 3. V2 disables retries globally because:
            //   1. Our API layer already handles 401/403 with a baseToken
            //      retry internally (see src/lib/api/request.ts).
            //   2. Silent retries on auth errors mask real failures.
            //   3. Per-query retry can be re-enabled where genuinely needed
            //      (e.g. retry: 1 on the users list — see V1 settings/users).
            retry: false,
          },
        },
      })
  );

  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AuthInitializer />
            {children}
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}
