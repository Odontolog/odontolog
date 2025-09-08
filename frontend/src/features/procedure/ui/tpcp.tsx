'use client';

import SupervisorSection from './supervisor-section';
import DetailSection from './detail-section';

interface TreatmentPlanCreationProcedureProps {
  procedureId: string;
}

export default function TreatmentPlanCreationProcedure({
  procedureId,
}: TreatmentPlanCreationProcedureProps) {
  return (
    <div>
      <SupervisorSection procedureId={procedureId} />
      <DetailSection procedureId={procedureId} />
    </div>
  );
}
