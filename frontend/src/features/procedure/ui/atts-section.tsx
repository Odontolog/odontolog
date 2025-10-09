'use client';

import {
  ActionIcon,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import AttachmentCard from '@/shared/components/att-card';
import { Attachments, Procedure } from '@/shared/models';
import { ReviewableSectionProps } from '@/shared/reviewable/models';
import { ProcedureDropzone } from './dropzone';

export default function AttachmentsSection<T extends Procedure>({
  queryOptions,
  mode,
}: ReviewableSectionProps<T>) {
  const [editing, setEditing] = useState(false);

  const {
    data: atts,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.attachments,
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
        <AttSectionContent
          atts={atts}
          editing={editing}
          setEditing={setEditing}
          isError={isError}
          isLoading={isLoading}
        />
      </Card.Section>
    </Card>
  );
}

interface AttachmentsSectionProps {
  atts?: Attachments[];
  isError: boolean;
  isLoading: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
}

function AttSectionContent({
  atts,
  isLoading,
  isError,
  editing,
  setEditing,
}: AttachmentsSectionProps) {
  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Flex align="center" gap="xs">
        <ThemeIcon variant="white" color="red">
          <IconExclamationCircle size={24} />
        </ThemeIcon>
        <Text size="sm" c="red" py="none">
          Erro ao carregar documentos e arquivos
        </Text>
      </Flex>
    );
  }

  if (!atts) {
    return null;
  }

  if (atts.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Não há documentos ou arquivos anexados a esse procedimento.
      </Text>
    );
  }

  function handleCancel() {
    setEditing(false);
  }

  return (
    <Stack>
      {editing && <ProcedureDropzone />}
      <SimpleGrid type="container" cols={{ base: 1, '800px': 3, '1000px': 5 }}>
        {atts.map((att) => (
          <AttachmentCard
            key={att.id}
            att={att}
            mode={editing ? 'edit' : 'read'}
          />
        ))}
      </SimpleGrid>
      {editing && (
        <Flex
          justify="space-between"
          align="center"
          direction="row-reverse"
          mt="sm"
        >
          <Group gap="xs">
            <Button variant="default" fw="normal" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
            // onClick={() => mutation.mutate(displayValue)}
            // loading={mutation.isPending}
            >
              Salvar
            </Button>
          </Group>
        </Flex>
      )}
    </Stack>
  );
}
