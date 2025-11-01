import { Box, Group } from '@mantine/core';

import styles from '@/features/patient/patient.module.css';
import ProcedureHistorySection from '@/features/procedures/ui/procedure-history-section';
import ProcedureDetailSection from '@/features/procedures/ui/procedures-detail-section';

export default async function PatientProceduresPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group className={styles.subpage}>
      <Box flex="1" h="100%">
        <ProcedureHistorySection patientId={patientId} />
      </Box>
      <Box flex="1" h="100%" visibleFrom="md">
        <ProcedureDetailSection />
      </Box>
    </Group>
  );
}
