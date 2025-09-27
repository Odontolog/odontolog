'use client';

import { Group, ScrollArea, Stack } from '@mantine/core';

import SupervisorSection from '@/shared/reviewable/supervisor-section';
import NotesSection from '@/shared/reviewable/notes-section';
import AssigneeSection from '@/shared/reviewable/assignee-section';
import HistorySection from '@/shared/reviewable/history/history-section';
import { getTratmentPlanOptions } from './requests';
import ProcedureSection from './procedure-section';
import TreatmentPlanHeader from './header';
import styles from './treatment-plan.module.css';

interface TreatmentPlanProps {
  patientId: string;
  treatmentPlanId: string;
}

export default function TreatmentPlan({ treatmentPlanId }: TreatmentPlanProps) {
  const options = getTratmentPlanOptions(treatmentPlanId);

  return (
    <>
      <TreatmentPlanHeader
        id={treatmentPlanId}
        queryOptions={options}
        mode="edit"
      />
      <ScrollArea w="100%" style={{ flex: 1 }}>
        <Group className={styles.container}>
          <Stack className={styles.main}>
            <ProcedureSection
              queryOptions={options}
              treatmentPlanId={treatmentPlanId}
            />
            <NotesSection
              reviewableId={treatmentPlanId}
              queryOptions={options}
            />
            <HistorySection
              reviewableId={treatmentPlanId}
              queryOptions={options}
            />
          </Stack>

          <Stack className={styles.side}>
            <SupervisorSection
              reviewableId={treatmentPlanId}
              queryOptions={options}
            />
            <AssigneeSection
              reviewableId={treatmentPlanId}
              queryOptions={options}
            />
          </Stack>
        </Group>
      </ScrollArea>
    </>
  );
}
