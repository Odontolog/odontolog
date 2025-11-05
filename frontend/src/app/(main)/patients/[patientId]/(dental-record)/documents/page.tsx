import { Group } from '@mantine/core';

import DocsSection from '@/features/documents/ui/documents-section';

export default async function PatientDocumentsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;
  return (
    <Group p="md" flex="1" h="100%" style={{ overflowY: 'hidden' }}>
      <DocsSection patientId={patientId} />
    </Group>
  );
}
