'use client';
import AttachmentCard from '@/shared/components/card-docs';
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

export default function DocSection<T extends Procedure>({
  queryOptions,
  mode,
}: ReviewableSectionProps<T>) {
  const [editing, setEditing] = useState(false);

  const { data: docs, isLoading } = useQuery({
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
        {isLoading || !docs ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <DocSectionContent docs={docs} />
        )}
      </Card.Section>
    </Card>
  );
}

interface DocsSectionContentProps {
  docs: Attachments[];
}

function DocSectionContent({ docs }: DocsSectionContentProps) {
  return (
    <Grid>
      {docs.map((att) => (
        <Grid.Col span={6} key={att.id}>
          <AttachmentCard att={att} mode="read" />
        </Grid.Col>
      ))}
    </Grid>
  );
}
