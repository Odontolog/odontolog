'use client';

import SupervisorSection from '@/shared/reviewable/supervisor-section';
import NotesSection from '@/shared/reviewable/notes-section';
import { getTreatmentPlanReviewableOptions } from './requests';
import AssigneeSection from '@/shared/reviewable/assignee-section';

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
      <AssigneeSection queryOptions={options} />
      <SupervisorSection queryOptions={options} />
      <NotesSection queryOptions={options} />
    </div>
  );
}
