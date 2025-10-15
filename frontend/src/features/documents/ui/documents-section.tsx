/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import DocumentPreviewCard from '@/shared/components/document-preview-card';
import { getPatientDocumentsOptions } from '../requests';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Center,
  Divider,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';

interface DocsSectionProps {
  patientId: string;
}

export default function DocsSection({ patientId }: DocsSectionProps) {
  const docs = getPatientDocumentsOptions(patientId);

  const { data, isLoading, isError } = useQuery({
    ...docs,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%">
      <Card.Section inheritPadding py="sm">
        <Text fw={600} size="lg">
          Documentos e exames
        </Text>
      </Card.Section>

      <Divider my="none" />

      <Card.Section>
        <DocsSectionContent
          data={data}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface Document {
  id: string;
  createdAt: Date;
  filename: string;
  location: string;
  type: string;
  size: string;
  uploader: string;
}

interface DocsSectionContentProps {
  data?: Document[];
  isLoading: boolean;
  isError: boolean;
}

function extensionExtractor(type: string) {
  return type.split('/').pop();
}

function DocsSectionContent({
  data,
  isLoading,
  isError,
}: DocsSectionContentProps) {
  if (isError) {
    return (
      <Center py="md" h="100%">
        <Text fw={600} size="lg" c="dimmed" ta="center">
          Algo deu errado. <br />
          Não foi possível carregar os documentos.
        </Text>
      </Center>
    );
  }

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Center py="md" h="100%" px="lg">
        <Stack align="center">
          <Text fw={600} size="lg" c="dimmed" ta="center">
            O paciente não tem documentos associados.
            <br />
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <ScrollArea
      scrollbarSize={6}
      offsetScrollbars
      scrollbars="y"
      w="100%"
      h="560px"
    >
      <Grid p="md">
        {data.map((document) => (
          <Grid.Col span={3} key={document.id}>
            <DocumentPreviewCard
              imageSrc={document.location}
              title={document.filename}
              fileType={extensionExtractor(document.type) ?? ''}
              uploader={document.uploader}
              size={document.size}
              createdAt={document.createdAt}
            />
          </Grid.Col>
        ))}
      </Grid>
    </ScrollArea>
  );
}
