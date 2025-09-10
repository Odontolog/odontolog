'use client';
import { useState } from 'react';
import {
  IconBook,
  //   IconBuildingHospital,
  IconDental,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react';
import { Center, Divider, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './sidebar.module.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

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
        data-active={active || undefined}
      >
        <Icon size={24} />
      </UnstyledButton>
    </Tooltip>
  );
}

const sidebarLinks = [
  //   { icon: IconBuildingHospital, label: 'Clínicas', route: '' },
  { icon: IconDental, label: 'Pacientes', route: '/patients' },
  { icon: IconUsers, label: 'Alunos', route: '/students' },
  { icon: IconBook, label: 'Revisões', route: '/validation' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [active, setActive] = useState<number>(() =>
    sidebarLinks.findIndex((d) => pathname.includes(d.route)),
  );
  const router = useRouter();

  const links = sidebarLinks.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        router.push(link.route);
      }}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Image
          src="/odontolog.svg"
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
            console.log('Fazer logout');
          }}
        />
      </Stack>
    </nav>
  );
}
