'use client';

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
  useMatches,
} from '@mantine/core';
import { IconChevronDown, IconSlash } from '@tabler/icons-react';
import ReviewMenu from './review-menu';
import { useQuery } from '@tanstack/react-query';
import { Patient } from '@/shared/models';

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

// NOTE: falta considerar se é supervisor ou student; falta ver como puxar o id do treatmentPlan se for Procedure (linha 114); conferir as requisições
export default function ProcedureHeader(props: ProcedureHeaderProps) {
  const { procedureId, patientId } = props;

  const { data: patient } = useQuery<Patient>({
    queryKey: ['patient', patientId],
    queryFn: async () => getPatientById(patientId),
  });

  const breadcrumbsData = [
    { title: 'Pacientes', href: '/patients' },
    { title: `${patient?.name}`, href: `/patients/${patientId}` },
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

  const titleSize = useMatches({
    base: 'h3',
    md: 'h1',
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
            <Title size={titleSize}>
              {props.mode === 'edit' ? 'Criação de ' : ''}
              {typeTranslations[props.type]}{' '}
              <span style={{ color: 'var(--mantine-color-dimmed)' }}>
                #{procedureId}
              </span>
            </Title>
            <Group gap={8}>
              <Badge
                variant="light"
                {...getBadgeProps(patient?.status ?? '')}
              />
              <Text size="sm">
                Última atualização por <b>{patient?.assignee.name}</b> às{' '}
                {patient?.lastModified.toLocaleString('pt-BR', {
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
            <Button
              fw={500}
              rightSection={<IconChevronDown />}
              fullWidth={titleSize === 'h3'}
            >
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
