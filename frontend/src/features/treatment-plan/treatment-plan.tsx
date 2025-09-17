'use client';

import { Group, Stack } from '@mantine/core';
import SupervisorSection from '@/shared/reviewable/supervisor-section';
import NotesSection from '@/shared/reviewable/notes-section';
import { getTratmentPlanOptions } from './requests';
import AssigneeSection from '@/shared/reviewable/assignee-section';
import ProcedureSection from './procedure-section';
import TreatmentPlanHeader from './header';

interface TreatmentPlanProps {
  patientId: string;
  treatmentPlanId: string;
}

export default function TreatmentPlan({
  patientId,
  treatmentPlanId,
}: TreatmentPlanProps) {
  console.log(patientId, treatmentPlanId);

  const options = getTratmentPlanOptions(treatmentPlanId);

  return (
    <>
      <TreatmentPlanHeader
        id={treatmentPlanId}
        queryOptions={options}
        mode="edit"
      />
      <Group
        py="md"
        // px="128px"
        px="xl"
        gap="lg"
        align="flex-start"
        justify="space-between"
        style={{ boxSizing: 'border-box' }}
      >
        <Stack miw={440} style={{ flex: 1 }}>
          <ProcedureSection
            queryOptions={options}
            treatmentPlanId={treatmentPlanId}
          />
          <NotesSection queryOptions={options} />
        </Stack>

        <Stack miw={220} style={{ flexBasis: '16%' }}>
          <AssigneeSection queryOptions={options} />
          <SupervisorSection queryOptions={options} />
        </Stack>
      </Group>
    </>
  );
}
