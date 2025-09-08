import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';

import { ColorSchemeScript, Flex, mantineHtmlProps } from '@mantine/core';

import Providers from './providers';
import Navbar from '@/features/appshell/navbar';
import { Sidebar } from '@/features/appshell/sidebar';

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
          <Flex>
            <Sidebar />
            <div style={{ flex: 1 }}>
              <Navbar />
              {children}
            </div>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
