'use client';

import { Attachments } from '@/shared/models';
import { Button, Group, Image, Modal, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import DeletionConfirmModal from '@/features/documents/ui/deletion-confirm-modal';
import { deleteAttachment } from '@/features/procedure/requests';

interface AttachmentsDisplayModalProps {
  opened: boolean;
  onClose: () => void;
  attachment: Attachments | null;
}

export default function AttachmentsDisplayModal({
  opened,
  onClose,
  attachment,
}: AttachmentsDisplayModalProps) {
  const [confirmOpened, setModalOpened] = useState(false);

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

  function handleDocumentDeletion(attachment: Attachments) {
    void deleteAttachment('1', attachment);
    setModalOpened(false);
  }

  function handleClosing() {
    setModalOpened(false);
    onClose();
  }

  function openConfirmModal() {
    setModalOpened(true);
  }

  const isImage = attachment.filename.match(
    /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i,
  );

  return (
    <Modal.Root opened={opened} onClose={handleClosing} size="lg" centered>
      <Modal.Overlay />
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

            {attachment.description !== null ? (
              <Text c="dimmed">{attachment.description}</Text>
            ) : (
              <Text c="dimmed">Não há descrição</Text>
            )}

            <Group justify="flex-end" mt="sm">
              <Button color="red" onClick={openConfirmModal} disabled>
                Deletar
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleDownload(attachment)}
              >
                Download
              </Button>

              <DeletionConfirmModal
                opened={confirmOpened}
                onClose={() => setModalOpened(false)}
                onConfirm={() => handleDocumentDeletion(attachment)}
              />
            </Group>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
