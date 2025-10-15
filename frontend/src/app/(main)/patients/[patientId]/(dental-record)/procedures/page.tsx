import { Box, Group } from '@mantine/core';

import ProcedureHistorySection from '@/features/procedures/ui/procedure-history-section';
import ProcedureDetailSection from '@/features/procedures/procedures-detail-section';

export default async function PatientProceduresPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group align="flex-start" py="md" px="lg" h="100%" wrap="nowrap">
      <Box flex="1" h="100%">
        <ProcedureHistorySection
          patientId={patientId}
          scrollAreaHeight="413px"
        />
      </Box>
      <Box flex="1" h="100%" visibleFrom="md">
        <ProcedureDetailSection scrollAreaHeight="500px" />
      </Box>
    </Group>
  );
}
