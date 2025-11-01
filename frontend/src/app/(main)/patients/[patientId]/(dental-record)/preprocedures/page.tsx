import { Box, Group } from '@mantine/core';

import styles from '@/features/patient/patient.module.css';
import PreprocedureHistorySection from '@/features/procedures/ui/preprocedure/preprocedure-history-section';
import ProcedureDetailSection from '@/features/procedures/ui/procedures-detail-section';

export default async function PatientPreproceduresPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group className={styles.subpage}>
      <Box flex="1" h="100%">
        <PreprocedureHistorySection patientId={patientId} />
      </Box>
      <Box flex="1" h="100%" visibleFrom="md">
        <ProcedureDetailSection />
      </Box>
    </Group>
  );
}
