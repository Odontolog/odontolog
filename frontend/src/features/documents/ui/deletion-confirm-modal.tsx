import { Attachments } from '@/shared/models';
import { Modal, Text, Group, Button, Stack } from '@mantine/core';

interface DeletionConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (attachment: Attachments) => void;
}

export default function DeletionConfirmModal({
  opened,
  onClose,
  onConfirm,
}: DeletionConfirmModalProps) {
  return (
    <Modal.Root opened={opened} onClose={onClose} size="sm" centered>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={600}>Confirmação adicional</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Stack>
            <Text>Tem certeza que deseja deletar o arquivo?</Text>
            <Group justify="flex-end" mt="sm">
              <Button color="red" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={() => onConfirm}>
                Confirmar
              </Button>
            </Group>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
