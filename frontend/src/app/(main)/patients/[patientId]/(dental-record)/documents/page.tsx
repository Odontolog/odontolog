import { Group } from '@mantine/core';

import DocsSection from '@/features/documents/ui/documents-section';
import styles from '@/features/patient/patient.module.css';

export default async function PatientDocumentsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group className={styles.subpage}>
      <DocsSection patientId={patientId} />
    </Group>
  );
}
