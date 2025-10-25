import { Modal, Text, Image, Stack, Group, Button } from '@mantine/core';
import { Attachments } from '@/shared/models';

interface AttachmentsModalProps {
  opened: boolean;
  onClose: () => void;
  attachment: Attachments | null;
}

export default function AttachmentsModal({
  opened,
  onClose,
  attachment,
}: AttachmentsModalProps) {
  if (!attachment) {
    return null;
  }
  async function handleDownload(att: Attachments) {
    try {
      const response = await fetch(att.location);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = att.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      throw new Error('Falha ao baixar o arquivo.');
    }
  }

  const isImage = attachment.filename.match(
    /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i,
  );

  return (
    <Modal.Root opened={opened} onClose={onClose} size="lg" centered>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={600}>{attachment.filename}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Stack gap="md">
            {isImage ? (
              <Image
                src={attachment.location}
                alt={attachment.filename}
                fit="contain"
                mah={400}
                fallbackSrc="/assets/not-found-file.jpg"
              />
            ) : (
              <Stack align="center" py="xl" gap={2}>
                <Text size="lg" c="dimmed">
                  Preview não disponível para este tipo de arquivo
                </Text>
                <Text size="sm" c="dimmed">
                  {attachment.filename}
                </Text>
              </Stack>
            )}

            <Group justify="flex-end" mt="sm">
              <Button
                variant="outline"
                onClick={() => void handleDownload(attachment)}
              >
                Download
              </Button>
            </Group>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
