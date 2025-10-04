'use client';

import {
  ActionIcon,
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
import { useDisclosure } from '@mantine/hooks';
import {
  IconBook,
  IconChevronRight,
  IconDental,
  IconLogout,
  IconPlus,
  IconUsers,
} from '@tabler/icons-react';
import { type User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import classes from './navbar-mobile.module.css';
import Search from './search';

export default function NavbarMobile() {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  const user = data?.user;

  function getUserPageLink(user: User) {
    switch (user.role) {
      case 'STUDENT':
        return `/students/${user?.id}`;
      default:
        return '#';
    }
  }

  const userPageLink = user ? getUserPageLink(user) : '#';

  const navLinks = [
    { icon: <IconDental />, label: 'Pacientes', route: '/patients' },
  ];

  if (user && user.role !== 'STUDENT') {
    navLinks.push(
      ...[
        { icon: <IconUsers />, label: 'Alunos', route: '/students' },
        { icon: <IconBook />, label: 'Pedidos de validação', route: '/validations' },
      ],
    );
  }

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
        <Group>
          <Burger
            opened={opened}
            onClick={open}
            aria-label="Toggle navigation"
          />
          <Image
            src="/assets/odontolog-icon.svg"
            alt="Odontolog Logo"
            width={40}
            height={40}
          />
          <Drawer.Root
            position="left"
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
                  close();
                  router.push(userPageLink);
                }}
              >
                <Group justify="space-between" w="100%">
                  <Group>
                    <Avatar
                      size="lg"
                      color="dark"
                      variant="light"
                      name={user?.name}
                    />
                    <Stack gap={0}>
                      <Title order={4}>{user?.name}</Title>
                      <Text size="xs" c="dimmed">
                        {user?.email}
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
                  onClick={() => {
                    void signOut({ redirect: true, callbackUrl: '/login' });
                  }}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </Group>
        <Group>
          <Search />
          <ActionIcon
            variant="default"
            color="black"
            size="lg"
            aria-label="Criar um novo prontuário"
            onClick={() => console.log('Criar novo prontuário')}
          >
            <IconPlus />
          </ActionIcon>
        </Group>
      </Group>
    </nav>
  );
}
