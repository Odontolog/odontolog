'use client';
import { ActionIcon, Group, Stack, Text, Title } from '@mantine/core';
import { IconEye, IconFile, IconTrash } from '@tabler/icons-react';
import { Attachments } from '../models';

interface CardDocsProps {
  doc: Attachments;
  onDelete: (doc: Attachments) => void;
  onView: (docId: string) => void;
}

export default function CardDocs(props: CardDocsProps) {
  const { doc, onDelete, onView } = props;
  return (
    <Group gap="16" bg="gray.0" px="sm" py="xs">
      <IconFile size={36} />
      <Stack gap="0">
        <Title order={5}>{doc.filename}</Title>
        <Text size="sm" c="dimmed">
          <b>{doc.size}</b> • Enviado por <b>{doc.uploader.name}</b>
        </Text>
      </Stack>
      <Group gap={8}>
        <ActionIcon
          onClick={() => onView(doc.id)}
          variant="light"
          aria-label="Visualizar documento"
        >
          <IconEye size={16} />
        </ActionIcon>
        <ActionIcon
          onClick={() => onDelete(doc)}
          variant="light"
          color="red"
          aria-label="Deletar documento"
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
