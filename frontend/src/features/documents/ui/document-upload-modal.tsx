import { Button, Group, Modal, Stack, Textarea } from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ProcedureDropzone } from '@/features/procedure/ui/attachements/dropzone';
import { newAttachment } from '../models';
import { saveAttachmentOnPatient } from '../requests';

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
          <Modal.Title fw={600}>Upload de arquivos</Modal.Title>
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

  const newAtts: newAttachment[] = [];

  files.forEach((file) => {
    newAtts.push({
      file,
      description,
    });
  });

  const uploadMutation = useMutation({
    mutationFn: (newAtts: newAttachment[]) =>
      saveAttachmentOnPatient(patientId, newAtts),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['newPatientAttachment', patientId],
      });

      onFilesChange([]);
      console.log('New atts e descrição ae ###############################');
      console.log(newAtts);
      console.log('#######################################################');
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
          onClick={() => uploadMutation.mutate(newAtts)}
          loading={uploadMutation.isPending}
        >
          Salvar
        </Button>
      </Group>
    </Stack>
  );
}
