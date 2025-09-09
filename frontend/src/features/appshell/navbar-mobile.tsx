'use client';
import {
  Avatar,
  Burger,
  Divider,
  Drawer,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Image from 'next/image';
import classes from './navbar-mobile.module.css';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBook,
  IconChevronRight,
  IconDental,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { Student } from '@/shared/models';

const navLinks = [
  { icon: <IconDental />, label: 'Pacientes', route: '/patients' },
  { icon: <IconUsers />, label: 'Alunos', route: '/students' },
  { icon: <IconBook />, label: 'Revisões', route: '/validation' },
];

export default function NavbarMobile() {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();

  const user: Student = {
    role: 'student',
    name: 'Pedro Sebastião',
    email: 'pedro.sebastiao@foufal.ufal.br',
    clinic: 5,
    enrollment: 21109965,
    semester: 2025.1,
    avatarUrl: undefined,
  };

  const links = navLinks.map((link) => (
    <NavLink
      key={link.label}
      href={link.route}
      label={link.label}
      leftSection={link.icon}
      onClick={close}
      active={pathname.includes(link.route)}
    />
  ));
  return (
    <nav className={classes.navbar}>
      <Group justify="space-between" h="100%">
        <Image
          src="/odontolog.svg"
          alt="Odontolog Logo"
          width={40}
          height={40}
          style={{ marginBottom: '0.5rem' }}
        />
        <Drawer.Root
          position="right"
          opened={opened}
          onClose={close}
          size="80%"
          padding="md"
        >
          <Drawer.Overlay />
          <Drawer.Content>
            <Drawer.Header
              className={classes.user}
              onClick={() => {
                router.push(`/students/${user?.enrollment}`);
              }}
            >
              <Group justify="space-between" w="100%">
                <Group>
                  <Avatar
                    size="lg"
                    color="blue"
                    variant="light"
                    name={user.name}
                  />
                  <Stack gap={0}>
                    <Title order={4}>{user.name}</Title>
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </Stack>
                </Group>
                <IconChevronRight color="gray" />
              </Group>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap="sm">{links}</Stack>
              <Divider my="sm" />
              <NavLink
                label="Sair"
                leftSection={<IconLogout />}
                c="red"
                color="red"
                onClick={() => {console.log('Sair da conta')}}
              />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
        <Burger opened={opened} onClick={open} aria-label="Toggle navigation" />
      </Group>
    </nav>
  );
}
