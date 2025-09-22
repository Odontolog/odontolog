import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import PatientTreatmentPlans from '@/features/treatment-plans/treatment-plans';
import { Group } from '@mantine/core';
import TreatmentPlansSection from '@/features/treatment-plans/treatment-plans-section';
import TreatmentPlanDetailSection from '@/features/treatment-plans/treatment-plan-detail-section';

interface PatientTreatmentPlansParams {
  patientId: string;
}

export default async function PatientTreatmentPlansPage({
  params,
}: {
  params: PatientTreatmentPlansParams;
}) {
  const { patientId } = await params;

  return (
    <Group align="flex-start" py="md" px="lg" h="100%">
      <div style={{ flex: 1, height: '100%' }}>
        <TreatmentPlansSection patientId={patientId} />
      </div>

      <div style={{ flex: 1, height: '100%' }}>
        <TreatmentPlanDetailSection patientId={patientId} />
      </div>
    </Group>
  );
}
