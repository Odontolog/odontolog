'use client';

import {
  Card,
  Center,
  Divider,
  Grid,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import DocumentPreviewCard from '@/features/documents/ui/document-preview-card';
import AttachmentsDisplayModal from '@/shared/attachments/ui/att-display-modal';
import AttachmentUploadModal from '@/shared/attachments/ui/att-upload-modal';
import { Attachments } from '@/shared/models';
import { getPatientDocumentsOptions } from '../requests';

interface DocsSectionProps {
  patientId: string;
}

export default function DocsSection({ patientId }: DocsSectionProps) {
  const options = getPatientDocumentsOptions(patientId);

  const { data, isLoading, isError } = useQuery({
    ...options,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" flex="1">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Documentos e exames
          </Text>
          <Tooltip label="Envio de arquivos">
            <AttachmentUploadModal
              patientId={patientId}
              queryKey={options.queryKey}
            />
          </Tooltip>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section h="100%">
        <DocsSectionContent
          data={data}
          isLoading={isLoading}
          isError={isError}
        />
      </Card.Section>
    </Card>
  );
}

interface DocsSectionContentProps {
  data?: Attachments[];
  isLoading: boolean;
  isError: boolean;
}

function DocsSectionContent({
  data,
  isLoading,
  isError,
}: DocsSectionContentProps) {
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachments | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

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

  if (isLoading) {
    return (
      <Grid p="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid.Col
            span={{ sm: 12, md: 6, lg: 4, xl: 3 }}
            key={`skeleton-${i}`}
          >
            <DocumentPreviewSkeleton />
          </Grid.Col>
        ))}
      </Grid>
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

  function handleViewAttachment(attachment: Attachments) {
    setSelectedAttachment(attachment);
    setModalOpened(true);
  }

  function closeModal() {
    setModalOpened(false);
    setSelectedAttachment(null);
  }

  return (
    <ScrollArea
      scrollbarSize={6}
      offsetScrollbars
      scrollbars="y"
      w="100%"
      h="100%"
    >
      <Grid p="md">
        {data
          .sort((a, b) => +b.createdAt - +a.createdAt)
          .map((document) => (
            <Grid.Col span={{ sm: 12, md: 6, lg: 4, xl: 3 }} key={document.id}>
              <DocumentPreviewCard
                attachment={document}
                onClick={handleViewAttachment}
              />
            </Grid.Col>
          ))}
      </Grid>
      <AttachmentsDisplayModal
        attachment={selectedAttachment}
        onClose={closeModal}
        opened={modalOpened}
      />
    </ScrollArea>
  );
}

function DocumentPreviewSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="sm" withBorder>
      <Card.Section>
        <Skeleton h={180} w={330} />
      </Card.Section>
      <Stack pt="md" gap="xs">
        <Group justify="space-between">
          <Skeleton h={8} w="30%" />
          <Skeleton height={16} radius="xl" width="20%" />
        </Group>
        <Skeleton h={16} w="90%" />
        <Group>
          <Skeleton h={12} w="75%" />
        </Group>
      </Stack>
    </Card>
  );
}
