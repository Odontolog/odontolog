import { getPatientById } from '@/features/patient/requests';
import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronDown, IconSlash } from '@tabler/icons-react';
import ReviewMenu from './review-menu';

interface ProcedureHeaderProps {
  type: 'procedure' | 'treatmentPlan';
  mode: 'edit' | 'read';
  procedureId: string;
  patientId: string;
}

const typeTranslations: { [key: string]: string } = {
  treatmentPlan: 'Plano de Tratamento',
  procedure: 'Procedimento',
};

// NOTE: falta considerar se é supervisor ou student; falta ver como puxar o id do treatmentPlan se for Procedure (linha 114)
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
          <Stack gap={8}>
            <Title>
              {props.mode === 'edit' ? 'Criação de ' : ''}
              {typeTranslations[props.type]}{' '}
              <span style={{ color: 'var(--mantine-color-dimmed)' }}>
                #{procedureId}
              </span>
            </Title>
            <Group gap={8}>
              <Badge variant="light" {...getBadgeProps(patient.status)} />
              <Text size="sm">
                Última atualização por <b>{patient.assignee.name}</b> às{' '}
                {patient.lastModified.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                {props.type === 'procedure' ? (
                  <span>
                    no <b>Plano de Tratamento #{12}</b>
                  </span>
                ) : (
                  ''
                )}
              </Text>
            </Group>
          </Stack>
          {props.mode === 'edit' ? (
            <Button fw={500} rightSection={<IconChevronDown />}>
              Enviar para validação
            </Button>
          ) : (
            <ReviewMenu />
          )}
        </Group>
      </Stack>
    </header>
  );
}
