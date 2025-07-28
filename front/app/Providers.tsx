'use client';

import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

type ProvidersProps = PropsWithChildren;

export default function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NuqsAdapter>
  );
}
