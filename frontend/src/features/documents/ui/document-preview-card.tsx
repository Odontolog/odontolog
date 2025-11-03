'use client';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Attachments } from '@/shared/models';
import { formatFileSize } from '@/shared/utils';

import { Card, Text, Image, Group, Badge, Stack, Tooltip } from '@mantine/core';

interface DocumentPreviewCardProps {
  attachment: Attachments;
  onClick: (attachment: Attachments) => void;
}

export default function DocumentPreviewCard({
  attachment,
  onClick,
}: DocumentPreviewCardProps) {
  function extensionExtractor(type: string) {
    return type.split('/').pop();
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="sm"
      withBorder
      onClick={() => onClick(attachment)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Section>
        <Image
          src={attachment.location}
          height={180}
          alt={`imagem de ${attachment.filename}`}
          fallbackSrc="/not-preview.svg"
        />
      </Card.Section>
      <Stack pt="md" gap="xs">
        <Group justify="space-between">
          <Tooltip label={attachment.createdAt.toLocaleDateString('pt-BR')}>
            <Text size="xs" c="dimmed">
              {formatDistanceToNow(attachment.createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </Text>
          </Tooltip>
          <Badge size="xs" variant="light" color="blue">
            {extensionExtractor(attachment.type)}
          </Badge>
        </Group>
        <Text fw={600} size="md" truncate="end" maw="400px">
          {attachment.filename}
        </Text>
        <Group>
          <Text size="sm" c="dimmed" truncate>
            <b>{formatFileSize(attachment.size)}</b> • Enviado por{' '}
            <Tooltip label={attachment.uploader.name}>
              <b>{attachment.uploader.name}</b>
            </Tooltip>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
