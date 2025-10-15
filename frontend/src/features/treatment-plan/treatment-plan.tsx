'use client';

import { Box, Group, Loader, ScrollArea, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { type User } from 'next-auth';

import AssigneeSection from '@/shared/reviewable/assignee-section';
import HistorySection from '@/shared/reviewable/history/history-section';
import NotesSection from '@/shared/reviewable/notes-section';
import SupervisorSection from '@/shared/reviewable/supervisor-section';
import TreatmentPlanHeader from './header';
import ProcedureSection from './procedure-section';
import { getTratmentPlanOptions } from './requests';
import styles from './treatment-plan.module.css';
import { getTreatmentPlanPageMode } from './utils';

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

  const { data: status, isLoading } = useQuery({
    ...options,
    select: (data) => data.status,
  });

  if (isLoading || status === undefined) {
    return (
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack align="center" mt={100} style={{ height: '100%' }}>
          <Loader size="lg" />
          Carregando Plano de Tratamento
        </Stack>
      </Box>
    );
  }

  const mode = getTreatmentPlanPageMode(status, user.role);

  return (
    <>
      <TreatmentPlanHeader
        id={treatmentPlanId}
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
