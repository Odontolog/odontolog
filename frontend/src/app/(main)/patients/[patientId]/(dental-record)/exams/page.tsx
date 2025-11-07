import { Box, Group } from '@mantine/core';

import ProcedureDetailSection from '@/features/procedures/ui/procedures-detail-section';
import PreprocedureHistorySection from '@/features/procedures/ui/preprocedure/preprocedure-history-section';

export default async function PatientPhysicalExamsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group align="flex-start" py="md" px="lg" h="100%" wrap="nowrap">
      <Box flex="1" h="100%">
        <PreprocedureHistorySection patientId={patientId} />
      </Box>
      <Box flex="1" h="100%" visibleFrom="md">
        <ProcedureDetailSection scrollAreaHeight="500px" />
      </Box>
    </Group>
  );
}
