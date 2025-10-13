import { ActionIcon, Flex, Group, Text } from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import {
  IconFile,
  IconFileTypePdf,
  IconPhoto,
  IconVideo,
  IconX,
} from '@tabler/icons-react';

function getFileIcon(file: FileWithPath) {
  if (file.type.startsWith('image/')) {
    return (
      <Flex justify="center" c="blue.5">
        <IconPhoto size={16} />
      </Flex>
    );
  }
  if (file.type === 'application/pdf') {
    return (
      <Flex justify="center" c="blue.5">
        <IconFileTypePdf size={16} />
      </Flex>
    );
  }
  if (file.type.startsWith('video/')) {
    return (
      <Flex justify="center" c="blue.5">
        <IconVideo size={16} />
      </Flex>
    );
  }
  return (
    <Flex justify="center" c="blue.5">
      <IconFile size={16} />
    </Flex>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

interface FilePreviewProps {
  file: FileWithPath;
  index: number;
  onRemove: (index: number) => void;
}

export function FilePreview({ file, index, onRemove }: FilePreviewProps) {
  return (
    <Group key={index} gap="sm" p="sm" wrap="nowrap">
      {getFileIcon(file)}
      <Text size="sm" truncate>
        {file.name}
      </Text>
      <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
        {formatFileSize(file.size)}
      </Text>
      <ActionIcon
        variant="subtle"
        color="red"
        size="sm"
        onClick={() => onRemove(index)}
      >
        <IconX size={14} />
      </ActionIcon>
    </Group>
  );
}
