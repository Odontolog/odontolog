'use client';
import AttachmentCard from '@/shared/components/att-card';
import { Attachments, Procedure } from '@/shared/models';
import { ReviewableSectionProps } from '@/shared/reviewable/models';
import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Loader,
  Text,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function AttachmentsSection<T extends Procedure>({
  queryOptions,
  mode,
}: ReviewableSectionProps<T>) {
  const [editing, setEditing] = useState(false);

  const { data: atts, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => {
      return data.attachments;
    },
    enabled: false,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Documentos e arquivos
          </Text>
          {mode === 'edit' && !editing && (
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={isLoading}
              onClick={() => setEditing(true)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        {isLoading || !atts ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <AttSectionContent atts={atts} />
        )}
      </Card.Section>
    </Card>
  );
}

interface AttachmentsSectionProps {
  atts: Attachments[];
}

function AttSectionContent({ atts }: AttachmentsSectionProps) {
  return (
    <Grid>
      {atts.map((att) => (
        <Grid.Col span={{ base: 12, md: 6 }} key={att.id}>
          <AttachmentCard att={att} mode="read" />
        </Grid.Col>
      ))}
    </Grid>
  );
}
