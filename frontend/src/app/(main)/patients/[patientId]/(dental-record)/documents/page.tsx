'use client';

import DocumentPreviewCard from '@/shared/components/document-preview-card';
import { Box, Group } from '@mantine/core';

export default function PatientDocumentsPage() {
  const imageSrc =
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png';
  const title =
    'Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1Teste1';
  const type = 'PDF';
  const createdAt = '22/09/1999';
  const size = '69kb';
  const uploader = 'Robertinho do Gelo';

  return (
    <Group px={500} py={80} w={350} align="flex-start" h="100%" wrap="nowrap">
      <Box w={350} flex="1" h="100%">
        <DocumentPreviewCard
          imageSrc={imageSrc}
          title={title}
          fileType={type}
          createdAt={createdAt}
          size={size}
          uploader={uploader}
        />
      </Box>
    </Group>
  );
}
