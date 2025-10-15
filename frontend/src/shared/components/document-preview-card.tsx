'use client';

import { Card, Text, Image, Group, Badge, Stack } from '@mantine/core';
import { Url } from 'next/dist/shared/lib/router/router';

interface DocumentPreviewCardProps {
  imageSrc?: Url;
  title: string;
  fileType: string;
  uploader: string;
  size: string;
  createdAt?: string;
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
          <Text size="xs" c="dimmed">
            {props.createdAt}
          </Text>
          <Badge size="xs" color="blue">
            {props.fileType}
          </Badge>
        </Group>
        <Text fw={600} size="md" truncate="end">
          {props.title}
        </Text>
        <Group>
          <Text size="sm" c="dimmed">
            {props.size}
          </Text>
          <Text size="sm" c="dimmed">
            {props.uploader}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
