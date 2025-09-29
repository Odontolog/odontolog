'use client';

import { Center, Divider, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconBook,
  IconDental,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import classes from './sidebar.module.css';

interface NavbarLinkProps {
  icon: typeof IconDental;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data-active={active || undefined}
      >
        <Icon size={24} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  const user = data?.user;

  const sidebarLinks = [
    { icon: IconDental, label: 'Pacientes', route: '/patients' },
  ];
  if (user && user.role !== 'student') {
    sidebarLinks.push(
      ...[
        { icon: IconUsers, label: 'Alunos', route: '/students' },
        { icon: IconBook, label: 'Pedidos de validações', route: '/validations' },
      ],
    );
  }

  const active = sidebarLinks.findIndex((d) => pathname.includes(d.route));

  const links = sidebarLinks.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => router.push(link.route)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Image
          src="/assets/odontolog-icon.svg"
          alt="Odontolog Logo"
          width={40}
          height={40}
          style={{ marginBottom: '0.5rem' }}
        />
      </Center>

      <Divider
        style={{ borderTopColor: 'var(--mantine-color-default-border)' }}
      />

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={8}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconLogout}
          label="Sair da conta"
          onClick={() => {
            void signOut({ redirect: true, callbackUrl: '/login' });
          }}
        />
      </Stack>
    </nav>
  );
}
