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
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import AttachmentCard from '@/shared/components/att-card';
import { Attachments, Mode, Procedure, User } from '@/shared/models';
import { type FileWithPath } from '@mantine/dropzone';
import { ProcedureDropzone } from './dropzone';
import { saveAttachments } from '../../requests';
import { notifications } from '@mantine/notifications';

interface AttachmentCardProps {
  user?: User;
  reviewableId: string;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
  mode: Mode;
}

export default function AttachmentsSection({
  user,
  reviewableId,
  queryOptions,
  mode,
}: AttachmentCardProps) {
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const {
    data: atts,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.attachments,
    enabled: true,
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
          user={user}
          reviewableId={reviewableId}
          atts={atts}
          editing={editing}
          setEditing={setEditing}
          isError={isError}
          isLoading={isLoading}
          files={files}
          onFilesChange={setFiles}
        />
      </Card.Section>
    </Card>
  );
}

interface AttachmentsSectionProps {
  user?: User;
  reviewableId: string;
  atts?: Attachments[];
  isError: boolean;
  isLoading: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
}

function AttSectionContent({
  user,
  reviewableId,
  atts,
  isLoading,
  isError,
  editing,
  setEditing,
  files,
  onFilesChange,
}: AttachmentsSectionProps) {
  const queryClient = useQueryClient();

  const newAtts: Attachments[] = [];

  if (user) {
    files.forEach((file) => {
      newAtts.push({
        id: crypto.randomUUID(),
        filename: file.name,
        location: file.path,
        size: file.size,
        uploader: user,
      });
    });
  }

  const uploadMutation = useMutation({
    mutationFn: () => saveAttachments(reviewableId, newAtts),
    onSuccess: async (updatedProcedure) => {
      await queryClient.setQueryData(
        ['procedure', reviewableId],
        updatedProcedure,
      );

      await queryClient.invalidateQueries({
        queryKey: ['procedure', reviewableId],
      });

      onFilesChange([]);
      setEditing(false);
    },
    onError: (error) => {
      notifications.show({
        title: 'Não foi possível salvar os arquivos',
        message: `Um erro inesperado aconteceu e não foi possível salvar os arquivos. Tente novamente mais tarde. ${error}`,
        color: 'red',
        icon: <IconExclamationCircle />,
        autoClose: 5000,
      });
    },
  });

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
      {editing && (
        <ProcedureDropzone files={files} onFilesChange={onFilesChange} />
      )}
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
              onClick={() => uploadMutation.mutate()}
              loading={uploadMutation.isPending}
            >
              Salvar
            </Button>
          </Group>
        </Flex>
      )}
    </Stack>
  );
}
