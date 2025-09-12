'use client';

import SupervisorSection from '@/shared/reviewable/supervisor-section';
import { getTreatmentPlanReviewableOptions } from './requests';
import NotesSection from '@/shared/reviewable/notes-section';

interface TreatmentPlanProps {
  patientId: string;
  treatmentPlanId: string;
}

export default function TreatmentPlan({
  patientId,
  treatmentPlanId,
}: TreatmentPlanProps) {
  console.log(patientId, treatmentPlanId);

  const options = getTreatmentPlanReviewableOptions(treatmentPlanId);

  return (
    <div>
      <SupervisorSection queryOptions={options} />
      <NotesSection queryOptions={options} />
    </div>
  );
}
