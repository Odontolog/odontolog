'use client';

import {
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
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import { deleteAttachment } from '@/features/procedure/requests';
import AttachmentsDisplayModal from '@/shared/attachments/ui/att-display-modal';
import AttachmentUploadModal from '@/shared/attachments/ui/att-upload-modal';
import AttachmentCard from '@/shared/components/att-card';
import { Attachments, Mode, Procedure } from '@/shared/models';

interface AttachmentCardProps {
  patientId: string;
  procedureId: string;
  queryOptions: UseQueryOptions<Procedure, Error, Procedure, string[]>;
  mode: Mode;
}

export default function AttachmentsSection({
  patientId,
  procedureId,
  queryOptions,
  mode,
}: AttachmentCardProps) {
  const {
    data: atts,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.attachments,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Documentos e arquivos
          </Text>
          {mode === 'edit' && (
            <Tooltip label="Envio de arquivos">
              <AttachmentUploadModal
                mode={mode}
                patientId={patientId}
                procedureId={procedureId}
              />
            </Tooltip>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        <AttSectionContent
          mode={mode}
          procedureId={procedureId}
          atts={atts}
          isError={isError}
          isLoading={isLoading}
        />
      </Card.Section>
    </Card>
  );
}

interface AttachmentsSectionProps {
  mode: Mode;
  procedureId: string;
  atts?: Attachments[];
  isError: boolean;
  isLoading: boolean;
}

function AttSectionContent({
  mode,
  procedureId,
  atts,
  isLoading,
  isError,
}: AttachmentsSectionProps) {
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachments | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (attachment: Attachments) =>
      deleteAttachment(procedureId, attachment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['procedure', procedureId],
      });

      notifications.show({
        title: 'Arquivo removido',
        message: 'O arquivo foi removido com sucesso.',
        color: 'green',
        autoClose: 5000,
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Não foi possível remover o arquivo',
        message: `Um erro inesperado aconteceu e não foi possível remover o arquivo. Tente novamente mais tarde. ${error}`,
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

  function handleViewAttachment(attachment: Attachments) {
    setSelectedAttachment(attachment);
    setModalOpened(true);
  }

  function handleDeleteAttachment(attachment: Attachments) {
    modals.openConfirmModal({
      title: 'Remover arquivo',
      children: (
        <Text size="sm">
          Tem certeza que deseja remover o arquivo{' '}
          <strong>{attachment.filename}</strong>? Esta ação não pode ser
          desfeita.
        </Text>
      ),
      labels: { confirm: 'Remover', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(attachment),
    });
  }

  function closeModal() {
    setModalOpened(false);
    setSelectedAttachment(null);
  }

  return (
    <Stack>
      <SimpleGrid type="container" cols={{ base: 1, '800px': 3, '1000px': 5 }}>
        {atts.map((att) => (
          <AttachmentCard
            key={att.id}
            att={att}
            mode={mode}
            onView={handleViewAttachment}
            onDelete={handleDeleteAttachment}
          />
        ))}
      </SimpleGrid>

      <AttachmentsDisplayModal
        opened={modalOpened}
        onClose={closeModal}
        attachment={selectedAttachment}
      />
    </Stack>
  );
}
