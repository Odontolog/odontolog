'use client';

import { Box, Group, SimpleGrid, Text } from '@mantine/core';
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
  type FileWithPath,
} from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import {
  IconExclamationCircle,
  IconPhoto,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { ComponentProps } from 'react';

import { FilePreview } from './file-preview';

interface ProcedureDropzoneProps
  extends Partial<ComponentProps<typeof Dropzone>> {
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
}

export function ProcedureDropzone({
  files,
  onFilesChange,
  ...props
}: ProcedureDropzoneProps) {
  function onRemove(id: number) {
    const newFiles = files.filter((_, index) => index !== id);
    onFilesChange(newFiles);
  }

  const previews = files.map((file, index) => (
    <FilePreview key={index} file={file} index={index} onRemove={onRemove} />
  ));

  function handleRejection() {
    notifications.show({
      title: 'Não é possível enviar esse arquivo',
      message:
        'O arquivo deve ser uma imagem, PDF ou vídeo e não pode exceder 10MB',
      color: 'red',
      icon: <IconExclamationCircle />,
      autoClose: 5000,
    });
  }

  return (
    <div>
      <Dropzone
        onDrop={onFilesChange}
        onReject={handleRejection}
        maxSize={10 * 1024 ** 2}
        accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE, 'video/*']}
        {...props}
      >
        <Group
          justify="center"
          gap="xl"
          mih={120}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              size={52}
              color="var(--mantine-color-blue-6)"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size={52}
              color="var(--mantine-color-dimmed)"
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline ta="center">
              Arraste imagem, PDF ou vídeo aqui ou clique para selecionar
              arquivos
            </Text>
            {props.multiple === true ? (
              <Text size="sm" c="dimmed" inline mt={7} ta="center">
                Anexe quantos arquivos desejar, cada arquivo não deve exceder
                10MB
              </Text>
            ) : (
              <Text size="sm" c="dimmed" inline mt={7} ta="center">
                Anexe o arquivo desejar, o arquivo não deve exceder 10MB
              </Text>
            )}
          </div>
        </Group>
      </Dropzone>

      <Box mt="md" bd="1px solid gray.3" p="xs" bdrs={4}>
        <Group>
          <Text size="sm" fw={500} c="dimmed">
            Arquivos selecionados ({previews.length})
          </Text>
        </Group>
        {previews.length > 0 && (
          <SimpleGrid
            cols={{ base: 1, sm: 3, md: 6 }}
            spacing="xs"
            verticalSpacing="xs"
            px={4}
            type="container"
          >
            {previews}
          </SimpleGrid>
        )}
      </Box>
    </div>
  );
}
