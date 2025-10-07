/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { ActionIcon, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconEye, IconFile, IconTrash } from '@tabler/icons-react';
import { Attachments, Mode } from '../models';

interface AttachmentCardProps {
  att: Attachments;
  mode: Mode;
}

export default function AttachmentCard({ att, mode }: AttachmentCardProps) {
  function onDelete(att: Attachments) {}
  function onView(attId: string) {}

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
          <b>{att.size}</b> • Enviado por <b>{att.uploader.name}</b>
        </Text>
      </Stack>
      {mode === 'edit' && (
        <Group gap={8} wrap="nowrap">
          <ActionIcon
            onClick={() => onView(att.id)}
            variant="light"
            aria-label="Visualizar arquivo"
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() => onDelete(att)}
            variant="light"
            color="red"
            aria-label="Deletar arquivo"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
}
