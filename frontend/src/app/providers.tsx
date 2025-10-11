'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/app/get-query-client';
import type * as React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';
import { type Session } from 'next-auth';
import { ModalsProvider } from '@mantine/modals';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
});

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <SessionProvider session={session}>
          <ModalsProvider>{children}</ModalsProvider>
        </SessionProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
