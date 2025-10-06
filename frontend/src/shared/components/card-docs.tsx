'use client';
import {
  ActionIcon,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconEye, IconFile, IconTrash } from '@tabler/icons-react';
import { Attachments, Mode } from '../models';

interface CardDocsProps {
  doc: Attachments;
  mode: Mode;
}

export default function CardDocs({ doc, mode }: CardDocsProps) {
  function onDelete(doc: Attachments) {}
  function onView(docId: string) {}

  return (
    <Group gap="14" bg="gray.0" px="sm" py="xs">
      <Flex justify="center" c="blue.5">
        <IconFile size={32} />
      </Flex>
      <Stack gap="0">
        <Title order={6}>{doc.filename}</Title>
        <Text size="xs" c="dimmed">
          <b>{doc.size}</b> • Enviado por <b>{doc.uploader.name}</b>
        </Text>
      </Stack>
      {mode === 'edit' && (
        <Group gap={8}>
          <ActionIcon
            onClick={() => onView?.(doc.id)}
            variant="light"
            aria-label="Visualizar documento"
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() => onDelete?.(doc)}
            variant="light"
            color="red"
            aria-label="Deletar documento"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
}
