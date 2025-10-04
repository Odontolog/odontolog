import ProcedureHistorySection from '@/features/procedures/ui/procedure-history-section';
import { Group, Box } from '@mantine/core';

export default async function PatientProceduresPage({
  params,
}: {
  params: { patient_id: string };
}) {
  const { patient_id } = await params;
  return (
    <Group align="flex-start" py="md" px="lg" h="100%" wrap="nowrap">
      <Box flex="1" h="100%">
        <ProcedureHistorySection patientId={patient_id} />
      </Box>
    </Group>
  );
}
