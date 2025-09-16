'use client';

import { Stack } from '@mantine/core';
import SupervisorSection from '@/shared/reviewable/supervisor-section';
import NotesSection from '@/shared/reviewable/notes-section';
import {
  getTratmentPlanOptions,
  getTreatmentPlanReviewableOptions,
} from './requests';
import ProcedureSection from './procedure-section';

interface TreatmentPlanProps {
  patientId: string;
  treatmentPlanId: string;
}

export default function TreatmentPlan({
  patientId,
  treatmentPlanId,
}: TreatmentPlanProps) {
  console.log(patientId, treatmentPlanId);

  const reviewableOptions = getTreatmentPlanReviewableOptions(treatmentPlanId);
  const options = getTratmentPlanOptions(treatmentPlanId);

  return (
    <Stack gap="md">
      <SupervisorSection queryOptions={reviewableOptions} />
      <NotesSection queryOptions={reviewableOptions} />
      <ProcedureSection
        queryOptions={options}
        treatmentPlanId={treatmentPlanId}
      />
    </Stack>
  );
}
