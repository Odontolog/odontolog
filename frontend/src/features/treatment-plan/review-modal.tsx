import {
  Modal,
  Group,
  Text,
  Stack,
  Button,
  Flex,
  Textarea,
  TextInput,
  Radio,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReviewForTreatmentPlan } from './requests';
import { useState } from 'react';

interface ReviewModalProps {
  treatmentPlanId: string;
  opened: boolean;
  open: () => void;
  close: () => void;
}

export default function ReviewModal(props: ReviewModalProps) {
  return (
    <>
      <Modal.Root opened={props.opened} onClose={props.close} size="lg">
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
            <ReviewModalBody {...props} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function ReviewModalBody({ close, treatmentPlanId }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [decision] = useState<string | null>(null);

  type ReviewFormValues = {
    note: string;
    decision: string;
    grade?: number;
  };

  const form = useForm<ReviewFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      note: '',
      decision: '',
    },
    validate: {
      note: (value) =>
        value.length < 1 ? 'Insira uma explicação para o aluno.' : null,
      grade: (value, values) => {
        return values.decision === 'Aprovar' &&
          (value === undefined || isNaN(Number(value)))
          ? 'Insira uma nota válida.'
          : null;
      },
      decision: (value) => (value.length === 0 ? 'Selecione uma opção.' : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: { note: string; decision: string | null }) =>
      submitReviewForTreatmentPlan(treatmentPlanId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['treatmentPlan', treatmentPlanId],
      });
      form.reset();
      close();
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        mutation.mutate({ note: values.note, decision }),
      )}
    >
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
