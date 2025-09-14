import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, Flex, mantineHtmlProps } from '@mantine/core';

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
          <Flex direction="row" visibleFrom="md" mih="100vh">
            <Sidebar />
            <Flex
              direction="column"
              style={{
                flex: 1,
              }}
            >
              <Navbar />
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  padding: '0 var(--mantine-spacing-lg)',
                }}
              >
                {children}
              </div>
            </Flex>
          </Flex>

          {/* Versão Mobile */}
          <Flex direction="column" hiddenFrom="md" mih="100vh">
            <NavbarMobile />
            <div
              style={{
                flex: 1,
                backgroundColor: 'var(--mantine-color-gray-0)',
                padding: 'var(--mantine-spacing-md)',
              }}
            >
              {children}
            </div>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
