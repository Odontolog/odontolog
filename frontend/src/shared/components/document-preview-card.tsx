'use client';

import { Card, Text, Image, Group, Badge, Stack, Tooltip } from '@mantine/core';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentPreviewCardProps {
  imageSrc?: string;
  title: string;
  fileType: string;
  uploader: string;
  size: string;
  createdAt: Date;
}

export default function DocumentPreviewCard(props: DocumentPreviewCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="sm" withBorder>
      <Card.Section>
        <Image
          src={props.imageSrc}
          height={180}
          alt="Norway"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </Card.Section>
      <Stack pt="md" gap="xs">
        <Group justify="space-between">
          <Tooltip label={props.createdAt.toLocaleDateString('pt-BR')}>
            <Text size="xs" c="dimmed">
              {formatDistanceToNow(props.createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </Text>
          </Tooltip>
          <Badge size="xs" variant="light" color="blue">
            {props.fileType}
          </Badge>
        </Group>
        <Text fw={600} size="md" truncate="end">
          {props.title}
        </Text>
        <Group>
          <Text size="sm" c="dimmed" truncate>
            <b>{props.size}</b> • Enviado por{' '}
            <Tooltip label={props.uploader}>
              <b>{props.uploader}</b>
            </Tooltip>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
