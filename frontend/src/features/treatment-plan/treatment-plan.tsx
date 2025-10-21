'use client';

import { Box, Group, Loader, ScrollArea, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { type User } from 'next-auth';
import { notFound } from 'next/navigation';

import AssigneeSection from '@/shared/reviewable/assignee-section';
import HistorySection from '@/shared/reviewable/history/history-section';
import NotesSection from '@/shared/reviewable/notes-section';
import SupervisorSection from '@/shared/reviewable/supervisor-section';
import TreatmentPlanHeader from './header';
import ProcedureSection from './procedure-section';
import { getTratmentPlanOptions } from './requests';
import styles from './treatment-plan.module.css';
import { getTreatmentPlanPageMode } from './utils';
import { ServerError } from '@/shared/components/server-error';

interface TreatmentPlanProps {
  patientId: string;
  treatmentPlanId: string;
  user: User;
}

export default function TreatmentPlan({
  treatmentPlanId,
  user,
}: TreatmentPlanProps) {
  const options = getTratmentPlanOptions(treatmentPlanId);

  const {
    data: status,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...options,
    select: (data) => data.status,
  });

  if (isLoading) {
    return (
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack align="center" mt={100} style={{ height: '100%' }}>
          <Loader size="lg" />
          Carregando Plano de Tratamento
        </Stack>
      </Box>
    );
  }

  if (isError) {
    if (error instanceof TypeError) {
      return (
        <div>
          <ServerError
            title="Algo de errado aconteceu"
            description="Nosso servidor não conseguiu suportar essa requisição. Tente recarregar a página."
          />
        </div>
      );
    }
    notFound();
  }

  if (status === undefined) {
    return null;
  }

  const mode = getTreatmentPlanPageMode(status, user.role);

  return (
    <>
      <TreatmentPlanHeader
        treatmentPlanId={treatmentPlanId}
        queryOptions={options}
        user={user}
      />
      <ScrollArea w="100%" style={{ flex: 1 }}>
        <Group className={styles.container}>
          <Stack className={styles.main}>
            <ProcedureSection
              queryOptions={options}
              treatmentPlanId={treatmentPlanId}
              mode={mode}
            />
            <NotesSection
              reviewableId={treatmentPlanId}
              queryOptions={options}
              mode={mode}
            />
            <HistorySection
              reviewableId={treatmentPlanId}
              queryOptions={options}
              mode={mode}
            />
          </Stack>

          <Stack className={styles.side}>
            <SupervisorSection
              reviewableId={treatmentPlanId}
              queryOptions={options}
              mode={mode}
            />
            <AssigneeSection
              reviewableId={treatmentPlanId}
              queryOptions={options}
              mode={mode}
            />
          </Stack>
        </Group>
      </ScrollArea>
    </>
  );
}
