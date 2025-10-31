import { Box, Group } from '@mantine/core';

import ProcedureHistorySection from '@/features/procedures/ui/procedure-history-section';
import ProcedureDetailSection from '@/features/procedures/ui/procedures-detail-section';

export default async function PatientProceduresPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group
      align="flex-start"
      py="md"
      px="lg"
      h="100%"
      wrap="nowrap"
      style={{ overflowY: 'hidden' }}
    >
      <Box flex="1" h="100%">
        <ProcedureHistorySection patientId={patientId} />
      </Box>
      <Box flex="1" h="100%" visibleFrom="md">
        <ProcedureDetailSection />
      </Box>
    </Group>
  );
}
