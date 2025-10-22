'use client';

import {
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type User } from 'next-auth';

import CustomBreadcrumbs from '@/shared/components/breadcrumbs';
import { StatusBadge, StatusIndicator } from '@/shared/components/status';
import {
  Review,
  Supervisor,
  TreatmentPlan,
  TreatmentPlanStatus,
} from '@/shared/models';
import styles from '@/shared/reviewable/header.module.css';
import ReviewModal from '@/shared/reviewable/review-modal';
import ReviewRequestModal from '@/shared/reviewable/review-request-modal';
import {
  canSupervisorReview,
  getLatestActorAndDate,
} from '@/shared/reviewable/utils';

interface TreatmentPlanHeaderProps {
  treatmentPlanId: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  user: User;
}

export default function TreatmentPlanHeader(props: TreatmentPlanHeaderProps) {
  return (
    <header className={styles.header}>
      <TreatmentPlanHeaderContent {...props} />
    </header>
  );
}

function TreatmentPlanHeaderContent(props: TreatmentPlanHeaderProps) {
  const { treatmentPlanId, queryOptions } = props;

  const { data, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => ({
      patient: data.patient,
      status: data.status,
      updatedAt: data.updatedAt,
      assignee: data.assignee,
      reviewers: data.reviewers,
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
    { title: `Plano #${treatmentPlanId}` },
  ];

  return (
    <Stack gap="sm">
      <CustomBreadcrumbs data={breadcrumbsData} />

      <Group justify="space-between">
        <Stack gap={8}>
          <Group gap="xs" justify="start" align="center">
            <Title c="gray.9" className={styles.title}>
              Plano de Tratamento{' '}
              <span className={styles.span}>#{treatmentPlanId}</span>
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
        <Flex align="center" gap={8}>
          <HeaderActionSection
            {...props}
            status={data.status}
            reviewers={data.reviewers}
            reviews={data.reviews}
          />
        </Flex>
      </Group>
    </Stack>
  );
}

interface HeaderActionSection extends TreatmentPlanHeaderProps {
  status: TreatmentPlanStatus;
  reviewers: Supervisor[];
  reviews: Review[];
}

function HeaderActionSection(props: HeaderActionSection) {
  const { user, queryOptions, treatmentPlanId, status, reviewers, reviews } =
    props;

  if (user.role === 'STUDENT') {
    return (
      <>
        {reviewers.length === 0 && (
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
        <ReviewRequestModal
          reviewableId={treatmentPlanId}
          queryOptions={queryOptions}
          disabled={status !== 'DRAFT' || reviewers.length === 0}
          className={styles.button}
        />
      </>
    );
  }

  return (
    <ReviewModal
      reviewableId={treatmentPlanId}
      className={styles.button}
      queryOptions={queryOptions}
      disabled={!canSupervisorReview(user, status, reviewers, reviews)}
    />
  );
}
