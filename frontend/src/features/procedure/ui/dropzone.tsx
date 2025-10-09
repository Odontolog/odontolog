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
import { ComponentProps, useState } from 'react';

import { FilePreview } from './file-preview';

export function ProcedureDropzone(
  props: Partial<ComponentProps<typeof Dropzone>>,
) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  function onRemove(id: number) {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== id));
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
        onDrop={setFiles}
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
            <Text size="xl" inline>
              Arraste imagens, PDFs ou vídeos aqui ou clique para selecionar
              arquivos
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Anexe quantos arquivos desejar, cada arquivo não deve exceder 10MB
            </Text>
          </div>
        </Group>
      </Dropzone>

      {previews.length > 0 && (
        <Box mt="md" bd="1px solid gray.3" p='xs' bdrs={4}>
          <Group>
            <Text size="sm" fw={500} c="dimmed">
              Arquivos selecionados ({previews.length})
            </Text>
          </Group>
          <SimpleGrid
            cols={{ base: 1, md: 6 }}
            spacing="xs"
            verticalSpacing="xs"
            px={4}
          >
            {previews}
          </SimpleGrid>
        </Box>
      )}
    </div>
  );
}
