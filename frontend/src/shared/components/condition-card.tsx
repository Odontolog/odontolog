import {
  Card,
  Flex,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';

import { AnamneseFormValues } from '@/features/anamnese/ui/anamnese-section';

interface PatientConditionCardProps {
  index: number;
  form: UseFormReturnType<AnamneseFormValues>;
  condition: string;
  editing: boolean;
}

export default function PatientConditionCard({
  index,
  form,
  condition,
  editing,
}: PatientConditionCardProps) {
  const notes = form.getValues().conditions[index].notes;

  return (
    <Card
      shadow="sm"
      padding="none"
      radius="md"
      withBorder
      style={{ height: '100%' }}
      // className={selected !== undefined ? styles.cardClickable : undefined}
      // onClick={() => onSelect?.(procedure.id)}
    >
      <Stack p="md" gap="sm">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs" justify="start" align="center">
            <Text span fw={600} c="gray.9">
              {condition}
            </Text>
          </Group>

          <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'flex-start' }}>
            <Switch
              disabled={!editing}
              key={form.key(`conditions.${index}.hasCondition`)}
              {...form.getInputProps(`conditions.${index}.hasCondition`, {
                type: 'checkbox',
              })}
            />
          </Group>
        </Group>

        <Flex gap="md" rowGap={0} direction="row" wrap="wrap">
          {!editing ? (
            <Text
              size="sm"
              c="dimmed"
              style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
            >
              {notes || 'Sem observações'}
            </Text>
          ) : (
            <Textarea
              key={form.key(`conditions.${index}.notes`)}
              {...form.getInputProps(`conditions.${index}.notes`)}
              autosize
              minRows={2}
              flex={1}
            />
          )}
        </Flex>
      </Stack>
    </Card>
  );
}
