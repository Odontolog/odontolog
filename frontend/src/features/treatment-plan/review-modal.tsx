import {
  Modal,
  Group,
  Text,
  Stack,
  Button,
  Tooltip,
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
                <Modal.Title fw="600">Validação de um procedimento</Modal.Title>
                <Modal.CloseButton />
              </Group>
              <Text size="sm" c="dimmed">
                Escreva uma avaliação para o aluno que realizou o procedimento e
                atribua uma nota.
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
  const [decision, setDecision] = useState<string | null>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      note: '',
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

  function handleSubmit(values: typeof form.values) {
    console.log('Saved to backend (mock):', values);
    mutation.mutate({ note: values.note, decision });
  }
  const isSubmitDisabled =
    mutation.isPending ||
    decision === null ||
    (decision === 'Aprovar' && !form.values.note);

  let tooltipLabel = '';
  if (decision === null) {
    tooltipLabel = 'Você precisa Aprovar ou Reprovar';
  } else if (decision === 'Aprovar' && !form.values.note) {
    tooltipLabel = 'Campo nota é obrigatório';
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
        <TextInput
          label="Nota"
          placeholder="Dê sua nota"
          data-autofocus
          withAsterisk={decision === 'Aprovar'}
          disabled={decision !== 'Aprovar'}
        />
        <Radio.Group
          name="Aprovar ou reprovar"
          value={decision}
          onChange={setDecision}
        >
          <Group mt="xs">
            <Radio value="Aprovar" label="Aprovar" />
            <Radio value="Reprovar" label="Reprovar" />
          </Group>
        </Radio.Group>
      </Stack>
      <Flex direction="row-reverse" gap="xs" ml="auto" mt="md">
        <Tooltip
          label={tooltipLabel}
          disabled={!isSubmitDisabled}
          position="top"
        >
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            loading={mutation.isPending}
          >
            Enviar
          </Button>
        </Tooltip>

        <Button variant="default" fw="normal" onClick={close}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
