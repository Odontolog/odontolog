
import { ActionIcon, Avatar, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import styles from './navbar.module.css';
import Search from './search';

export default function Navbar() {
  const user = {
    role: 'student',
    name: 'Pedro Sebastião',
    email: 'pedro.sebastiao@foufal.ufal.br',
    clinic: 5,
    enrollment: 21109965,
    semester: 2025.1,
    image: null
  };

  return (
    <nav className={styles.navbar}>
      <Group justify="space-between" h="100%">
        <div className={styles.search}>
          <Search />
        </div>
        <Group>
          <ActionIcon variant="subtle" color="gray/90" radius="xl">
            <IconPlus />
          </ActionIcon>
          <Avatar
            component="a"
            href={`/students/${user?.enrollment}`}
            color="initials"
            name={user.name}
            src={user.image}
          />
        </Group>
      </Group>
    </nav>
  );
}
