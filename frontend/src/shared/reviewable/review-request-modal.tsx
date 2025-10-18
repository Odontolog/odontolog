'use client';

import {
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconChevronDown,
  IconExclamationCircle,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Reviewable } from '@/shared/models';
import { submitReviewRequest } from './requests';
import { ReviewableComponentProps } from './models';

interface ReviewRequestModalProps<T extends Reviewable>
  extends ReviewableComponentProps<T> {
  disabled?: boolean;
  className?: string;
}

export default function ReviewRequestModal<T extends Reviewable>(
  props: ReviewRequestModalProps<T>,
) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        fw={500}
        rightSection={<IconChevronDown />}
        className={props.className}
        onClick={open}
        disabled={props.disabled}
      >
        Enviar para validação
      </Button>
      <Modal.Root opened={opened} onClose={close} size="lg">
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
            <ReviewRequestModalBody {...props} close={close} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

interface ReviewRequestModalBodyProps<T extends Reviewable>
  extends ReviewRequestModalProps<T> {
  close: () => void;
}

function ReviewRequestModalBody<T extends Reviewable>({
  close,
  reviewableId,
  queryOptions,
}: ReviewRequestModalBodyProps<T>) {
  const queryClient = useQueryClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      note: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: string) => submitReviewRequest(reviewableId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      form.reset();
      close();
      notifications.show({
        title: 'Enviado para validação com sucesso',
        message: 'Sua atividade foi enviado para validação.',
        color: 'green',
        icon: <IconCheck />,
        autoClose: 5000,
      });
    },
    onError(error) {
      notifications.show({
        title: 'Não foi possível enviar para a validação',
        message: `Um erro inesperado aconteceu. Tente novamente mais tarde. ${error}`,
        color: 'red',
        icon: <IconExclamationCircle />,
        autoClose: 5000,
      });
    },
  });

  function handleSubmit(values: typeof form.values) {
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
        <Button
          type="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          Enviar
        </Button>
        <Button variant="default" fw="normal" onClick={close}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
