'use client';

import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconChevronDown,
  IconSlash,
} from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { TreatmentPlan } from '@/shared/models';
import ReviewMenu from './review-menu';
import styles from './header.module.css';
import { useDisclosure } from '@mantine/hooks';
import RequestReviewModal from './request-review-modal';

interface TreatmentPlanHeaderProps {
  id: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  mode: 'edit' | 'read';
}

// NOTE: falta considerar se é supervisor ou student; falta ver como puxar o id do treatmentPlan se for Procedure (linha 114); conferir as requisições
export default function TreatmentPlanHeader(props: TreatmentPlanHeaderProps) {
  return (
    <header className={styles.header}>
      <TreatmentPlanHeaderContent {...props} />
    </header>
  );
}

interface TreatmentPlanHeaderContentProps {
  id: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  mode: 'edit' | 'read';
}

function TreatmentPlanHeaderContent(props: TreatmentPlanHeaderContentProps) {
  const { id, queryOptions } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => ({
      patient: data.patient,
      status: data.status,
      updatedAt: data.updatedAt,
      assignee: data.assignee,
      reviews: data.reviews,
    }),
  });

  if (data === undefined || isLoading) {
    return (
      <Stack gap="sm">
        <Skeleton height={16} width="20%" radius="md" />
        <Skeleton height={28} radius="md" />
        <Skeleton height={16} radius="md" />
      </Stack>
    );
  }

  const breadcrumbsData = [
    { title: 'Pacientes', href: '/patients' },
    {
      title: `${data.patient.name}`,
      href: `/patients/${data.patient.id}/procedures`,
    },
    { title: `Plano de tratamento #${id}` },
  ];

  const breadcrumbsItems = breadcrumbsData.map((item, index) => {
    const isLast = index === breadcrumbsData.length - 1;

    if (isLast) {
      return (
        <Text size="sm" c="blue" fw={500} key={index}>
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

  // TODO: Fazer componente genérico
  function getBadgeProps(status: string) {
    switch (status) {
      case 'draft':
        return { color: 'gray', children: 'EM ELABORAÇÃO' };
      case 'in_progress':
        return { color: 'blue', children: 'EM ANDAMENTO' };
      case 'in_review':
        return { color: 'yellow', children: 'EM REVISÃO' };
      case 'finished':
        return { color: 'teal', children: 'CONCLUÍDO' };
      default:
        return { color: 'white', children: null };
    }
  }

  return (
    <Stack>
      <Breadcrumbs separator={<IconSlash size={16} />}>
        {breadcrumbsItems}
      </Breadcrumbs>

      <Group justify="space-between">
        <Stack gap={8}>
          <Title c="gray.9" className={styles.title}>
            Plano de Tratamento <span className={styles.span}>#{id}</span>
          </Title>
          <Group gap="sm">
            <Badge variant="light" {...getBadgeProps(data.status ?? '')} />
            <Text size="sm">
              Última atualização por <b>{data.assignee.name}</b> às{' '}
              {data.updatedAt.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Group>
        </Stack>
        {props.mode === 'edit' ? (
          <Flex align="center" gap={8}>
            {data.reviews.length === 0 ? (
              <Tooltip
                label="Escolha o(s) supervisor(es)"
                color="red"
                position='left'
                withArrow
                arrowSize={6}
              >
                <IconAlertTriangle color="red" size={20} />
              </Tooltip>
            ) : (
              <></>
            )}
            <Button
              fw={500}
              rightSection={<IconChevronDown />}
              className={styles.button}
              onClick={open}
              disabled={data.reviews.length === 0}
            >
              Enviar para validação
            </Button>
            <RequestReviewModal treatmentPlanId={id} close={close} open={open} opened={opened} />
          </Flex>
        ) : (
          <ReviewMenu buttonProps={{ className: styles.button }}>
            Revisar
          </ReviewMenu>
        )}
      </Group>
    </Stack>
  );
}
