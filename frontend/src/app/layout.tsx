import '@mantine/core/styles.css';

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import Providers from './providers';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
