'use client';

import { ActionIcon, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconEye, IconFile, IconTrash } from '@tabler/icons-react';
import { Attachments, Mode } from '../models';

interface AttachmentCardProps {
  att: Attachments;
  mode: Mode;
  onView?: (attachment: Attachments) => void;
  onDelete?: (attachment: Attachments) => void;
}

function formatFileSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function AttachmentCard({
  att,
  mode,
  onView,
  onDelete,
}: AttachmentCardProps) {
  const handleView = () => {
    if (onView) {
      onView(att);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(att);
    }
  };

  return (
    <Group gap="14" bg="gray.0" px="sm" py="xs">
      <Flex justify="center" c="blue.5" wrap="nowrap">
        <IconFile size={32} />
      </Flex>
      <Stack
        gap="0"
        flex="1"
        style={{
          overflow: 'hidden',
        }}
      >
        <Title order={6} lineClamp={1} w="100%">
          {att.filename}
        </Title>
        <Text truncate="end" size="xs" c="dimmed" w="100%">
          <b>{formatFileSize(att.size)}</b> • Enviado por{' '}
          <b>{att.uploader.name}</b>
        </Text>
      </Stack>

      <Group gap={8} wrap="nowrap">
        <ActionIcon
          onClick={handleView}
          variant="light"
          aria-label="Visualizar arquivo"
        >
          <IconEye size={16} />
        </ActionIcon>
        {mode === 'edit' && (
          <ActionIcon
            onClick={handleDelete}
            variant="light"
            color="red"
            aria-label="Deletar arquivo"
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
}
