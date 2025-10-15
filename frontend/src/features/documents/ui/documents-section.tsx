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
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { Attachments } from '@/shared/models';
import AttachmentsModal from '@/features/procedure/ui/attachements/att-modal';
import { useState } from 'react';

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
  const [opened, setOpened] = useState(false);

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
          <Grid.Col span={3} key={document.id}>
            <DocumentPreviewCard attachment={document} />
          </Grid.Col>
        ))}
      </Grid>
    </ScrollArea>
  );
}
