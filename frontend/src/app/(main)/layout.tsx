import { Flex, ScrollArea } from '@mantine/core';

import Navbar from '@/features/appshell/navbar';
import { Sidebar } from '@/features/appshell/sidebar';
import NavbarMobile from '@/features/appshell/navbar-mobile';
import SearchProvider from '@/features/appshell/search-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
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
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'white',
          }}
        >
          <NavbarMobile />
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <ScrollArea style={{ flex: 1, minHeight: 0 }}>{children}</ScrollArea>
        </div>
      </Flex>
    </SearchProvider>
  );
}
