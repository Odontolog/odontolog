import { Box, Group } from '@mantine/core';

import TreatmentPlanDetailSection from '@/features/treatment-plans/treatment-plan-detail-section';
import TreatmentPlansSection from '@/features/treatment-plans/treatment-plans-section';

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
      <Box flex="1" h="100%">
        <TreatmentPlansSection patientId={patientId} />
      </Box>

      <Box flex="1" h="100%" visibleFrom="md">
        <TreatmentPlanDetailSection />
      </Box>
    </Group>
  );
}
