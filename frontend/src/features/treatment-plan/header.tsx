'use client';

import {
  Anchor,
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
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconChevronDown,
  IconSlash,
} from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { StatusBadge, StatusIndicator } from '@/shared/components/status';
import { Mode, TreatmentPlan } from '@/shared/models';
import { type User } from 'next-auth';
import styles from './header.module.css';
import RequestReviewModal from './request-review-modal';
import ReviewMenu from './review-menu';
import { getLatestActorAndDate } from './utils';

interface TreatmentPlanHeaderProps {
  id: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  mode: Mode;
  user: User;
}

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
  mode: Mode;
  user: User;
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
      latest: getLatestActorAndDate(data.history),
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

  // For the case where a treatment plan has no activities (empty history)
  const latest = {
    actor: data.latest ? data.latest.actor : data.assignee.name,
    updatedAt: data.latest ? data.latest.createdAt : data.updatedAt,
  };

  const breadcrumbsData = [
    { title: 'Pacientes', href: '/patients' },
    {
      title: `${data.patient.name}`,
      href: `/patients/${data.patient.id}/procedures`,
    },
    { title: `Plano #${id}` },
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

  return (
    <Stack gap="sm">
      <Breadcrumbs separatorMargin="2" separator={<IconSlash size={16} />}>
        {breadcrumbsItems}
      </Breadcrumbs>

      <Group justify="space-between">
        <Stack gap={8}>
          <Group gap="xs" justify="start" align="center">
            <Title c="gray.9" className={styles.title}>
              Plano de Tratamento <span className={styles.span}>#{id}</span>
            </Title>
            <StatusIndicator
              className={styles.indicator}
              status={data.status}
            />
          </Group>
          <Group gap="sm">
            <StatusBadge className={styles.badge} status={data.status} />
            <Text size="sm" c="gray.9">
              Última atualização por <b>{latest.actor}</b>{' '}
              <Tooltip
                label={format(latest.updatedAt, 'dd/MM/yyyy HH:mm')}
                withArrow
                position="right"
                transitionProps={{ duration: 200 }}
              >
                <Text span>
                  {formatDistanceToNow(latest.updatedAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </Text>
              </Tooltip>
            </Text>
          </Group>
        </Stack>
        {props.user.role === 'STUDENT' ? (
          <Flex align="center" gap={8}>
            {data.reviews.length === 0 && (
              <Tooltip
                label="Escolha o(s) supervisor(es)"
                color="red"
                position="left"
                withArrow
                arrowSize={6}
              >
                <IconAlertTriangle color="red" size={20} />
              </Tooltip>
            )}
            <Button
              fw={500}
              rightSection={<IconChevronDown />}
              className={styles.button}
              onClick={open}
              disabled={props.mode === 'read' || data.reviews.length === 0}
            >
              Enviar para validação
            </Button>
            <RequestReviewModal
              treatmentPlanId={id}
              close={close}
              open={open}
              opened={opened}
            />
          </Flex>
        ) : (
          <ReviewMenu
            buttonProps={{
              className: styles.button,
              disabled: props.mode === 'read' || data.status === 'IN_PROGRESS',
            }}
          >
            Revisar
          </ReviewMenu>
        )}
      </Group>
    </Stack>
  );
}
