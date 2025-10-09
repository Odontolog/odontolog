import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import { auth } from '@/shared/auth';
import Providers from './providers';

export const metadata = {
  title: 'Odontolog',
  description: 'Sistema de gestão de prontuários da FOUFAL',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="pt-br" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
