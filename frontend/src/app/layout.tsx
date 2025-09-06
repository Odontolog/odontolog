import '@mantine/core/styles.css';

import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from '@mantine/core';

export const metadata = {
  title: 'Odontolog',
  description: 'Sistema de gestão de prontuários da FOUFAL',
};

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
});

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
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
