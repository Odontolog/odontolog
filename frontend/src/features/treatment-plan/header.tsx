'use client';

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
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { TreatmentPlan } from '@/shared/models';
import ReviewMenu from './review-menu';

interface TreatmentPlanHeaderProps {
  id: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  mode: 'edit' | 'read';
}

const typeTranslations: { [key: string]: string } = {
  treatmentPlan: 'Plano de Tratamento',
  procedure: 'Procedimento',
};

// NOTE: falta considerar se é supervisor ou student; falta ver como puxar o id do treatmentPlan se for Procedure (linha 114); conferir as requisições
export default function TreatmentPlanHeader(props: TreatmentPlanHeaderProps) {
  const { id, queryOptions } = props;

  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    select: (data) => ({
      patient: data.patient,
      status: data.status,
      updatedAt: data.updatedAt,
      assignee: data.assignee,
    }),
  });

  const breadcrumbsData = [
    { title: 'Pacientes', href: '/patients' },
    { title: `${data?.patient.name}`, href: `/patients/${data?.patient.id}` },
    { title: `Plano de tratamento #${id}` },
  ];
  const breadcrumbsItems = breadcrumbsData.map((item, index) => {
    const isLast = index === breadcrumbsData.length - 1;

    if (isLast) {
      return (
        <Text size="sm" c="gray" fw={600} key={index}>
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
        c="gray.9"
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
      case 'in_review':
        return { color: 'orange', children: 'EM ANDAMENTO' };
      case 'in_progress':
        return { color: 'blue', children: 'EM ANDAMENTO' };
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
            <Title size={titleSize} c="gray.9">
              Plano de Tratamento{' '}
              <span style={{ color: 'var(--mantine-color-dimmed)' }}>
                #{id}
              </span>
            </Title>
            <Group gap={8}>
              <Badge variant="light" {...getBadgeProps(data?.status ?? '')} />
              <Text size="sm">
                Última atualização por <b>{data?.assignee.name}</b> às{' '}
                {data?.updatedAt.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                {/* {props.type === 'procedure' ? (
                  <span>
                    no <b>Plano de Tratamento #{12}</b>
                  </span>
                ) : (
                  ''
                )} */}
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
            <ReviewMenu buttonProps={{ fullWidth: titleSize === 'h3' }}>
              Revisar
            </ReviewMenu>
          )}
        </Group>
      </Stack>
    </header>
  );
}
