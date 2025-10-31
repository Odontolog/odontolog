'use client';

import {
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReviewableComponentProps, ReviewFormValues } from './models';
import { submitReview } from './requests';
import { Reviewable } from '@/shared/models';

interface ReviewModalProps<T extends Reviewable>
  extends ReviewableComponentProps<T> {
  disabled?: boolean;
  className?: string;
}

export default function ReviewModal<T extends Reviewable>(
  props: ReviewModalProps<T>,
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
        Validar
      </Button>
      <Modal.Root opened={opened} onClose={close} size="lg">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Stack gap="0" style={{ flex: 1 }}>
              <Group>
                <Modal.Title fw="600">
                  Validação do plano de tratamento
                </Modal.Title>
                <Modal.CloseButton />
              </Group>
              <Text size="sm" c="dimmed">
                Escreva uma avaliação para o aluno que criou o plano e atribua
                uma nota.
              </Text>
            </Stack>
          </Modal.Header>
          <Modal.Body>
            <ReviewModalBody {...props} close={close} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

interface ReviewModalBodyProps<T extends Reviewable>
  extends ReviewModalProps<T> {
  close: () => void;
}

function ReviewModalBody<T extends Reviewable>({
  close,
  reviewableId,
  queryOptions,
}: ReviewModalBodyProps<T>) {
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      comments: '',
      decision: '',
    },
    validate: {
      comments: (value) =>
        value.length < 1 ? 'Insira uma explicação para o aluno.' : null,
      grade: (value, values) => {
        if (values.decision !== 'Aprovar') {
          return null;
        }

        if (
          value === undefined ||
          value === null ||
          String(value).trim() === ''
        ) {
          return 'Insira uma nota.';
        }

        const num = Number(value);
        if (isNaN(num)) {
          return 'Insira uma nota válida entre 0.0 e 10.0..';
        }
        if (num < 0 || num > 10) {
          return 'A nota deve estar entre 0.0 e 10.0.';
        }

        return null;
      },
      decision: (value) => (value.length === 0 ? 'Selecione uma opção.' : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (review: ReviewFormValues) =>
      submitReview(reviewableId, review),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      form.reset();
      close();
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
      <Stack>
        <Textarea
          label="Observações adicionais"
          placeholder="Escreva aqui..."
          data-autofocus
          autosize
          minRows={5}
          maxRows={8}
          withAsterisk
          key={form.key('comments')}
          {...form.getInputProps('comments')}
        />
        <TextInput
          label="Nota"
          placeholder="Dê sua nota"
          data-autofocus
          withAsterisk={form.values.decision === 'Aprovar'}
          disabled={form.values.decision !== 'Aprovar'}
          key={form.key('grade')}
          {...form.getInputProps('grade')}
        />
        <Radio.Group
          key={form.key('decision')}
          value={form.values.decision}
          {...form.getInputProps('decision')}
          onChange={(value) => {
            form.clearErrors();
            form.setFieldValue('decision', value);
          }}
        >
          <Group mt="xs" mb="xs">
            <Radio value="Aprovar" label="Aprovar" />
            <Radio value="Reprovar" label="Reprovar" />
          </Group>
        </Radio.Group>
      </Stack>
      <Flex direction="row-reverse" gap="xs" ml="auto" mt="md">
        <Button type="submit" loading={mutation.isPending}>
          Enviar
        </Button>
        <Button variant="default" fw="normal" onClick={close}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
