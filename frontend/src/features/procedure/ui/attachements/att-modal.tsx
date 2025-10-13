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
                src={`/api/attachments/${attachment.id}`}
                alt={attachment.filename}
                fit="contain"
                mah={400}
                fallbackSrc="/assets/file-preview.png"
              />
            ) : (
              <Stack align="center" py="xl">
                <Text size="lg" c="dimmed">
                  Preview não disponível para este tipo de arquivo
                </Text>
                <Text size="sm" c="dimmed">
                  {attachment.filename}
                </Text>
              </Stack>
            )}

            <Group justify="flex-end" mt="md">
              <Button
                component="a"
                href={`/api/attachments/${attachment.id}/download`}
                download={attachment.filename}
                variant="outline"
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
