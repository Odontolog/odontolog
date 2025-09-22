'use client';

import TreatmentPlansSection from './treatment-plans-section';
import TreatmentPlanDetailSection from './treatment-plan-detail-section';
import { Group } from '@mantine/core';

interface PatientTreatmentPlansProps {
  patientId: string;
}

export default function PatientTreatmentPlans({
  patientId,
}: PatientTreatmentPlansProps) {
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
