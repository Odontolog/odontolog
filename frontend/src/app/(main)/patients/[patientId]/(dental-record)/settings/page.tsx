import { Box, Group } from '@mantine/core';

import PermissionSection from '@/features/settings/ui/permission-section';

interface PatientSettingsParams {
  patientId: string;
}

export default async function PatientSettingsPage({
  params,
}: {
  params: PatientSettingsParams;
}) {
  const { patientId } = await params;

  return (
    <Group align="flex-start" py="md" px="lg" h="100%" wrap="nowrap">
      <Box flex="1" h="100%">
        <PermissionSection patientId={patientId} />
      </Box>
    </Group>
  );
}
