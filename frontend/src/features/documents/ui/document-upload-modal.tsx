import { getPatientById } from '@/features/patient/requests';
import { ProcedureDropzone } from '@/features/procedure/ui/attachements/dropzone';
import { patient } from '@/mocks/treatment-plan';
import { Attachments } from '@/shared/models';
import { Modal, Text, Stack, Group, Button } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { saveAttachmentOnPatient } from '../requests';
import { error } from 'console';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';

interface DocumentUploadModalProps {
  patientId: string;
  opened: boolean;
  onClose: () => void;
}

export default function DocumentUploadModal({
  opened,
  onClose,
}: DocumentUploadModalProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  return (
    <Modal.Root opened={opened} onClose={onClose} size="lg" centered>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={600}>Upload de arquivos</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <UploadModalContent />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

interface UploadModalContentProps {
  patientId: string;
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
}

function UploadModalContent({
  patientId,
  files,
  onFilesChange,
}: UploadModalContentProps) {
  const queryClient = useQueryClient();
  const patient = getPatientById(patientId)

  const newAtts: Attachments[] = [];
  if (patientId !== null) {
    files.forEach((file) => {
      newAtts.push({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        filename: file.name,
        location: file.path,
        type: file.type,
        size: file.size,
        uploader: patient
      });
    });
  }

  const UploadMutation = useMutation({
    mutationFn: (newAtts: Attachments[]) =>
      saveAttachmentOnPatient(patientId, newAtts),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['patient', patientId],
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
}
