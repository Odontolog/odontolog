import { Flex } from '@mantine/core';

import styles from './appshell.module.css';
import Navbar from './navbar';
import NavbarMobile from './navbar-mobile';
import SearchProvider from './search-provider';
import { Sidebar } from './sidebar';

export default function Appshell({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <Flex direction="row" h="100vh">
        <Sidebar />
        <div className={styles.main}>
          <Navbar />
          <div className={styles.navbarMobile}>
            <NavbarMobile />
          </div>
          <div className={styles.container}>
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      </Flex>
    </SearchProvider>
  );
}
