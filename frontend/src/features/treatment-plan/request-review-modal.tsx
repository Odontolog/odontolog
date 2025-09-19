import {
  Modal,
  Group,
  Text,
  Stack,
  Button,
  Flex,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitTreatmentPlanForReview } from './requests';

interface RequestReviewModalProps {
  treatmentPlanId: string;
  opened: boolean;
  open: () => void;
  close: () => void;
}

export default function RequestReviewModal(props: RequestReviewModalProps) {
  return (
    <>
      <Modal.Root opened={props.opened} onClose={props.close} size="lg">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Stack gap="0" style={{ flex: 1 }}>
              <Group>
                <Modal.Title fw="600">Requerimento de avaliação</Modal.Title>
                <Modal.CloseButton />
              </Group>
              <Text size="sm" c="dimmed">
                Lembre-se de inserir informações adicionais relevantes para a
                avaliação caso necessário.
              </Text>
            </Stack>
          </Modal.Header>
          <Modal.Body>
            <RequestReviewModalBody {...props} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function RequestReviewModalBody({
  close,
  treatmentPlanId,
}: RequestReviewModalProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      note: '',
    },
  });

  // TODO: Sistema de notificação
  const mutation = useMutation({
    mutationFn: (values: string) =>
      submitTreatmentPlanForReview(treatmentPlanId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['treatmentPlan', treatmentPlanId],
      });
      close();
    },
  });

  function handleSubmit(values: typeof form.values) {
    console.log('Saved to backend (mock):', values);
    mutation.mutate(values.note);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Textarea
          label="Observações adicionais"
          placeholder="Escreva aqui..."
          data-autofocus
          autosize
          minRows={5}
          maxRows={8}
          key={form.key('note')}
          {...form.getInputProps('note')}
        />
      </Stack>
      <Flex direction="row-reverse" gap="xs" ml="auto" mt="md">
        <Button type="submit">Enviar</Button>
        <Button variant="default" fw="normal" onClick={close}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
