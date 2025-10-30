import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
} from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle, IconUpload } from '@tabler/icons-react';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ProcedureDropzone } from '@/features/procedure/ui/attachements/dropzone';
import { UploadAttachment } from '@/shared/attachments/models';
import { saveAttachment } from '@/shared/attachments/requests';
import { Mode } from '@/shared/models';
import { useDisclosure } from '@mantine/hooks';

interface AttachmentUploadModalProps {
  patientId: string;
  procedureId?: string;
  queryKey?: QueryKey;
  mode?: Mode;
}

export default function AttachmentUploadModal({
  patientId,
  procedureId,
  queryKey,
  mode,
}: AttachmentUploadModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  function handleClosing() {
    setFiles([]);
    close();
  }

  return (
    <>
      <ActionIcon
        variant="subtle"
        color="gray"
        disabled={mode !== undefined && mode !== 'edit'}
        onClick={open}
      >
        <IconUpload size={16} />
      </ActionIcon>
      <Modal.Root opened={opened} onClose={handleClosing} size="lg">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title fw={600}>Envio de arquivos</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <UploadModalContent
              patientId={patientId}
              procedureId={procedureId}
              onClose={handleClosing}
              files={files}
              onFilesChange={setFiles}
              queryKey={queryKey}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

interface UploadModalContentProps {
  patientId: string;
  procedureId?: string;
  onClose: () => void;
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
  queryKey?: QueryKey;
}

function UploadModalContent({
  patientId,
  procedureId,
  onClose,
  files,
  onFilesChange,
  queryKey,
}: UploadModalContentProps) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState<string>('');

  const uploadMutation = useMutation({
    mutationFn: (newAtt: UploadAttachment) =>
      saveAttachment(patientId, newAtt, procedureId),
    onSuccess: async () => {
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey });
      }

      onFilesChange([]);
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

  return (
    <Stack>
      <ProcedureDropzone
        files={files}
        onFilesChange={onFilesChange}
        multiple={false}
      />
      <Textarea
        rows={3}
        placeholder="Insira uma descrição para o documento"
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <Group justify="flex-end">
        <Button variant="default" fw="normal" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            const newAtt: UploadAttachment = {
              description,
              file: files[0],
            };

            uploadMutation.mutate(newAtt);

            setDescription('');
            onClose();
          }}
          loading={uploadMutation.isPending}
        >
          Salvar
        </Button>
      </Group>
    </Stack>
  );
}
