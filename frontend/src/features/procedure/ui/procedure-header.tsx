import { getPatientById } from '@/features/patient/requests';
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

interface ProcedureHeaderProps {
  type: 'procedure' | 'treatmentPlan';
  mode: 'edit' | 'read';
  procedureId: string;
  patientId: string;
}

const typeTranslations: { [key: string]: string } = {
  treatmentPlan: 'Plano de Tratamento',
  procedures: 'Procedimentos',
};

export default async function ProcedureHeader(props: ProcedureHeaderProps) {
  const { procedureId, patientId } = props;

  const patient = await getPatientById(patientId);

  const breadcrumbsData = [
    { title: 'Pacientes', href: '/patients' },
    { title: `${patient.name}`, href: `/patients/${patientId}` },
    { title: `${typeTranslations[props.type]} #${procedureId}` },
  ];

  const breadcrumbsItems = breadcrumbsData.map((item, index) => {
    const isLast = index === breadcrumbsData.length - 1;

    if (isLast) {
      return (
        <Text size="sm" fw={700} key={index}>
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

  const data = {
    id: procedureId,
    status: 'not_started',
    studentName: 'Pedro Sebastião',
    creationDate: new Date(),
  };

  return (
    <header
      style={{
        padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Stack>
        <Breadcrumbs separator={<IconSlash size={16} />}>
          {breadcrumbsItems}
        </Breadcrumbs>
        <Group justify="space-between">
          <Stack gap={0}>
            <Title>
              Criação de Plano de Tratamento{' '}
              <span style={{ color: 'var(--mantine-color-dimmed)' }}>
                #{data.id}
              </span>
            </Title>
            <Group gap={8}>
              <Badge variant="light" {...getBadgeProps(data.status)} />
              <Text size="sm">
                Criado por <b>{data.studentName}</b> às{' '}
                {data.creationDate.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Group>
          </Stack>
          {/* <Menu
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
          </Menu> */}
        </Group>
      </Stack>
    </header>
  );
}
