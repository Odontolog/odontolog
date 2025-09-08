'use client';
import { ActionIcon, Avatar, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import styles from './navbar.module.css';
import Search from './search';
import { Student } from '@/shared/models';

export default function Navbar() {
  const user: Student  = {
    role: 'student',
    name: 'Pedro Sebastião',
    email: 'pedro.sebastiao@foufal.ufal.br',
    clinic: 5,
    enrollment: 21109965,
    semester: 2025.1,
    avatarUrl: undefined,
  };

  return (
    <nav className={styles.navbar}>
      <Group justify="space-between" h="100%">
        <div className={styles.search}>
          <Search />
        </div>
        <Group>
          <ActionIcon
            variant="subtle"
            c="gray"
            radius="xl"
            onClick={() => console.log('Criar novo prontuário')}
          >
            <IconPlus />
          </ActionIcon>
          <Avatar
            component="a"
            href={`/students/${user?.enrollment}`}
            color="initials"
            name={user.name}
            src={user.avatarUrl}
          />
        </Group>
      </Group>
    </nav>
  );
}
