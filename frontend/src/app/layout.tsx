import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import Providers from './providers';
import Navbar from '@/features/appshell/navbar';

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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
