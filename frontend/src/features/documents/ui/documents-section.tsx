'use client';

import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import DocumentPreviewCard from '@/features/documents/ui/document-preview-card';
import AttachmentsModal from '@/features/procedure/ui/attachements/att-modal';
import { Attachments } from '@/shared/models';
import { getPatientDocumentsOptions } from '../requests';
import DocumentUploadModal from './document-upload-modal';

interface DocsSectionProps {
  patientId: string;
}

export default function DocsSection({ patientId }: DocsSectionProps) {
  const options = getPatientDocumentsOptions(patientId);
  const [modalOpened, setModalOpened] = useState(false);

  function closeModal() {
    setModalOpened(false);
  }

  const { data, isLoading, isError } = useQuery({
    ...options,
  });

  function handleUpload() {
    setModalOpened(true);
  }

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Documentos e exames
          </Text>
          <Tooltip label="Envio de arquivos">
            <ActionIcon variant="subtle" color="grey" size="sm">
              <IconUpload onClick={handleUpload} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Card.Section>

      <DocumentUploadModal
        patientId={patientId}
        opened={modalOpened}
        onClose={closeModal}
      />

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
      <Center py="md">
        <Loader size="sm" />
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
      h="560px"
    >
      <Grid p="md">
        {data.map((document) => (
          <Grid.Col span={{ sm: 12, md: 6, lg: 4, xl: 3 }} key={document.id}>
            <DocumentPreviewCard
              attachment={document}
              onClick={handleViewAttachment}
            />
          </Grid.Col>
        ))}
      </Grid>
      <AttachmentsModal
        attachment={selectedAttachment}
        onClose={closeModal}
        opened={modalOpened}
      />
    </ScrollArea>
  );
}
