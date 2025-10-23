'use client';

import { ActionIcon, Avatar, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

import styles from './navbar.module.css';
import SearchTrigger from './search-trigger';
import RecordModal from '../patient/record-modal';
import { useState } from 'react';

export default function Navbar() {
  const { data } = useSession();
  const [opened, setOpen] = useState<boolean>(false);

  const user = data?.user;

  return (
    <nav className={styles.navbar}>
      <Group justify="space-between" h="100%">
        <div className={styles.search}>
          <SearchTrigger variant="desktop" />
        </div>
        <Group>
          {user?.role !== 'STUDENT' && (
            <>
              <ActionIcon variant="default" onClick={() => setOpen(true)}>
                <IconPlus size={14} />
              </ActionIcon>
              <RecordModal opened={opened} onClose={() => setOpen(false)} />
            </>
          )}
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
