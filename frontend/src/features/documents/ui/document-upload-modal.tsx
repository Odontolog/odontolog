import { Button, Group, Modal, Stack, Textarea } from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ProcedureDropzone } from '@/features/procedure/ui/attachements/dropzone';
import { UploadAttachment } from '@/shared/attachments/models';
import { saveAttachment } from '@/shared/attachments/requests';

interface DocumentUploadModalProps {
  patientId: string;
  opened: boolean;
  onClose: () => void;
}

export default function DocumentUploadModal({
  patientId,
  opened,
  onClose,
}: DocumentUploadModalProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const handleClosing = () => {
    onClose();
    setFiles([]);
  };

  return (
    <Modal.Root opened={opened} onClose={handleClosing} size="lg" centered>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={600}>Envio de arquivos</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <UploadModalContent
            patientId={patientId}
            onClose={handleClosing}
            files={files}
            onFilesChange={setFiles}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

interface UploadModalContentProps {
  patientId: string;
  onClose: () => void;
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
}

function UploadModalContent({
  patientId,
  onClose,
  files,
  onFilesChange,
}: UploadModalContentProps) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');

  const uploadMutation = useMutation({
    mutationFn: (files: FileWithPath[]) => {
      const newAtt: UploadAttachment = {
        description,
        file: files[0],
      };
      return saveAttachment(patientId, newAtt);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['patientRelatedDocs', patientId],
      });

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
            uploadMutation.mutate(files);
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
