/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import DocsSection from '@/features/documents/ui/documents-section';
import { Box, Card, Group } from '@mantine/core';

export default function PatientDocumentsPage() {
  return (
    <Box p="md" flex="1" h="100%">
      <DocsSection patientId="patientId" />
    </Box>
  );
}
