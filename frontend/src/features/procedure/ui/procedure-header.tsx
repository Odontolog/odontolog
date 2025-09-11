'use client';
import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconCheck,
  IconChevronDown,
  IconSlash,
  IconX,
} from '@tabler/icons-react';
import { procedureStatus } from '../models';
import { usePathname } from 'next/navigation';

interface ProcedureHeaderProps {
  type: 'procedure' | 'treatmentPlan';
  mode: 'edit' | 'read';
  id: number;
  status: procedureStatus;
  studentName: string;
  creationDate: Date;
}

export default function ProcedureHeader(props: ProcedureHeaderProps) {
  const pathname = usePathname().split('/');

  const breadcrumbsData = [
    { title: 'Pacientes', href: '/patients' },
    { title: 'João da Silva', href: '/patients/2' },
    { title: 'Plano de Tratamento #2', href: '' },
  ];

  const items = breadcrumbsData.map((item, index) => {
    const isLast = index === breadcrumbsData.length - 1;

    if (isLast) {
      return (
        <Text size="xs" fw={700} key={index}>
          {item.title}
        </Text>
      );
    }

    return (
      <Anchor
        size="sm"
        underline="hover"
        href={item.href}
        key={index}
        c="black"
      >
        {item.title}
      </Anchor>
    );
  });

  function getBadgeProps(status: string) {
    switch (status) {
      case 'draft':
        return { color: 'gray', children: 'EM ELABORAÇÃO' };
      case 'not_started':
        return { color: 'indigo', children: 'NÃO INICIADO' };
      case 'in_progress':
        return { color: 'blue', children: 'EM ANDAMENTO' };
      case 'in_review':
        return { color: 'orange', children: 'EM ANDAMENTO' };
      case 'finished':
        return { color: 'teal', children: 'CONCLUÍDO' };
      default:
        return { color: 'white', children: null };
    }
  }

  return (
    <header
      style={{
        padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
      }}
    >
      <Stack>
        <Breadcrumbs separator={<IconSlash size={16} />}>{items}</Breadcrumbs>
        <p>{pathname}</p>
        <Group justify="space-between">
          <Stack gap={0}>
            <Title>
              Criação de Plano de Tratamento{' '}
              <span style={{ color: 'var(--mantine-color-dimmed)' }}>
                #{props.id}
              </span>
            </Title>
            <Group gap={8}>
              <Badge variant="light" {...getBadgeProps(props.status)} />
              <Text size="sm">
                Criado por <b>{props.studentName}</b> às{' '}
                {props.creationDate.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Group>
          </Stack>
          <Menu
            trigger="click-hover"
            openDelay={100}
            closeDelay={400}
            shadow="md"
            width={200}
          >
            <Menu.Target>
              <Button fw={500} rightSection={<IconChevronDown />}>
                a
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconCheck size={14} />}>
                Aprovar
              </Menu.Item>
              <Menu.Item leftSection={<IconX size={14} />}>
                Pedir ajustes
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
    </header>
  );
}
