import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/notifications/styles.css';

import {
  ColorSchemeScript,
  Flex,
  mantineHtmlProps,
  ScrollArea,
} from '@mantine/core';

import Providers from './providers';
import Navbar from '@/features/appshell/navbar';
import { Sidebar } from '@/features/appshell/sidebar';
import NavbarMobile from '@/features/appshell/navbar-mobile';

export const metadata = {
  title: 'Odontolog',
  description: 'Sistema de gestão de prontuários da FOUFAL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          {/* Versão Desktop */}
          <Flex direction="row" visibleFrom="md" h="100vh">
            <Sidebar />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                flex: 1,
              }}
            >
              <Navbar />
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  minHeight: 0,
                }}
              >
                {children}
              </div>
            </div>
          </Flex>

          {/* Versão Mobile */}
          <Flex direction="column" hiddenFrom="md" h="100vh">
            <NavbarMobile />
            <div
              style={{
                flex: 1,
                backgroundColor: 'var(--mantine-color-gray-0)',
              }}
            >
              <ScrollArea>{children}</ScrollArea>
            </div>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
