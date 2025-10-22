import {
  Card,
  Flex,
  Group,
  ScrollArea,
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
    >
      <Stack p="md" gap="sm" flex="1">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs" justify="start" align="center">
            <Text span fw={600} c="gray.9">
              {condition}
            </Text>
          </Group>

          <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'flex-start' }}>
            <Switch
              withThumbIndicator={false}
              disabled={!editing}
              key={form.key(`conditions.${index}.hasCondition`)}
              {...form.getInputProps(`conditions.${index}.hasCondition`, {
                type: 'checkbox',
              })}
            />
          </Group>
        </Group>

        <Flex gap="md" rowGap={0} direction="row" wrap="wrap" h="100%">
          {!editing ? (
            <ScrollArea mah="80px" offsetScrollbars scrollbars="y" type="auto">
              <Text
                size="sm"
                c="dimmed"
                style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
              >
                {notes || 'Sem observações'}
              </Text>
            </ScrollArea>
          ) : (
            <Textarea
              key={form.key(`conditions.${index}.notes`)}
              {...form.getInputProps(`conditions.${index}.notes`)}
              placeholder="Insira observações específicas"
              rows={3}
              h="100%"
              flex={1}
            />
          )}
        </Flex>
      </Stack>
    </Card>
  );
}
