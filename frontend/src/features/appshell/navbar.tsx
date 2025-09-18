'use client';

import { ActionIcon, Avatar, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { loggedUser } from '@/mocks/students';
import styles from './navbar.module.css';
import Search from './search';

export default function Navbar() {
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
            href={`/students/${loggedUser.id}`}
            color="initials"
            name={loggedUser.name}
            src={loggedUser.avatarUrl}
          />
        </Group>
      </Group>
    </nav>
  );
}
