'use client';

import {
  Anchor,
  Button,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconAlertTriangle, IconChevronDown } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type User } from 'next-auth';

import CustomBreadcrumbs from '@/shared/components/breadcrumbs';
import { StatusBadge, StatusIndicator } from '@/shared/components/status';
import {
  Procedure,
  ProcedureStatus,
  Review,
  Supervisor,
} from '@/shared/models';
import styles from '@/shared/reviewable/header.module.css';
import ReviewModal from '@/shared/reviewable/review-modal';
import ReviewRequestModal from '@/shared/reviewable/review-request-modal';
import {
  canSupervisorReview,
  getLatestActorAndDate,
} from '@/shared/reviewable/utils';
import { startProcedure } from '../requests';

interface ProcedureHeaderProps {
  procedureId: string;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
  user: User;
}

export default function ProcedureHeader(props: ProcedureHeaderProps) {
  return (
    <header className={styles.header}>
      <ProcedureHeaderContent {...props} />
    </header>
  );
}

function ProcedureHeaderContent(props: ProcedureHeaderProps) {
  const { procedureId, queryOptions } = props;

  const { data, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => ({
      name: data.name,
      patient: data.patient,
      status: data.status,
      updatedAt: data.updatedAt,
      assignee: data.assignee,
      reviewers: data.reviewers,
      reviews: data.reviews,
      treatmentPlanId: data.treatmentPlanId,
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
    { title: `Procedimento #${procedureId}` },
  ];

  return (
    <Stack gap="sm">
      <CustomBreadcrumbs data={breadcrumbsData} />

      <Group justify="space-between">
        <Stack gap={8}>
          <Group gap="xs" justify="start" align="center">
            <Title c="gray.9" className={styles.title}>
              {data.name} <span className={styles.span}>#{procedureId}</span>
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
              {data.treatmentPlanId !== undefined && (
                <>
                  {' no '}
                  <Anchor
                    size="sm"
                    fw={500}
                    underline="hover"
                    href={`/patients/${data.patient.id}/treatments/${data.treatmentPlanId}`}
                    c="gray.9"
                  >
                    {`Plano de Tratamento #${data.treatmentPlanId}`}
                  </Anchor>
                </>
              )}
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

interface HeaderActionSection extends ProcedureHeaderProps {
  status: ProcedureStatus;
  reviewers: Supervisor[];
  reviews: Review[];
}

function HeaderActionSection(props: HeaderActionSection) {
  const { user, queryOptions, procedureId, status, reviewers, reviews } = props;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (procedureId: string) => startProcedure(procedureId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
    },
  });

  function openStartProcedureModal() {
    return modals.openConfirmModal({
      title: 'Deseja iniciar este procedimento?',
      children: (
        <Text size="sm">
          Ao confirmar, o procedimento vai ser registrado como executado na data
          de hoje. Apenas inicie o procedimento se for realizá-lo na data de
          inicialização.
        </Text>
      ),
      labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
      onConfirm: () => mutation.mutate(procedureId),
    });
  }

  if (status === 'NOT_STARTED') {
    return (
      <Button
        fw={500}
        rightSection={<IconChevronDown />}
        className={styles.button}
        onClick={() => openStartProcedureModal()}
      >
        Iniciar
      </Button>
    );
  }

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
          reviewableId={procedureId}
          queryOptions={queryOptions}
          disabled={status !== 'IN_PROGRESS' || reviewers.length === 0}
          className={styles.button}
        />
      </>
    );
  }

  return (
    <ReviewModal
      reviewableId={procedureId}
      className={styles.button}
      queryOptions={queryOptions}
      disabled={!canSupervisorReview(user, status, reviewers, reviews)}
    />
  );
}
