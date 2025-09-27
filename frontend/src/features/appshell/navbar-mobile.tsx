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
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconBook,
  IconChevronRight,
  IconDental,
  IconLogout,
  IconPlus,
  IconUsers,
} from '@tabler/icons-react';

import { loggedUser } from '@/mocks/students';
import Search from './search';
import classes from './navbar-mobile.module.css';

const navLinks = [
  { icon: <IconDental />, label: 'Pacientes', route: '/patients' },
  { icon: <IconUsers />, label: 'Alunos', route: '/students' },
  { icon: <IconBook />, label: 'Revisões', route: '/validation' },
];

export default function NavbarMobile() {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();

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
            src="/odontolog.svg"
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
                  router.push(`/students/${loggedUser?.id}`);
                }}
              >
                <Group justify="space-between" w="100%">
                  <Group>
                    <Avatar
                      size="lg"
                      color="dark"
                      variant="light"
                      name={loggedUser.name}
                    />
                    <Stack gap={0}>
                      <Title order={4}>{loggedUser.name}</Title>
                      <Text size="xs" c="dimmed">
                        {loggedUser.email}
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
                    console.log('Sair da conta');
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
