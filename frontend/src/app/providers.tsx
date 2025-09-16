'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/app/get-query-client';
import type * as React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </QueryClientProvider>
  );
}
