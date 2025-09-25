'use client';

import { ActionIcon, Avatar, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import styles from './navbar.module.css';
import Search from './search';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data } = useSession();

  const user = data?.user;

  return (
    <nav className={styles.navbar}>
      <Group justify="space-between" h="100%">
        <div className={styles.search}>
          <Search />
        </div>
        <Group>
          <ActionIcon
            variant="default"
            color="black"
            onClick={() => console.log('Criar novo prontuário')}
          >
            <IconPlus />
          </ActionIcon>
          <Avatar
            component="a"
            href={`/students/${user?.id}`}
            color="initials"
            name={user?.name}
            src={user?.photoUrl}
          />
        </Group>
      </Group>
    </nav>
  );
}
