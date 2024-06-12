'use client';

import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function QueryClientContextProvider({
  children
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
