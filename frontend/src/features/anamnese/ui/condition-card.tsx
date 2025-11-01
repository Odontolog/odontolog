'use client';

import {
  Card,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';

import { AnamneseFormValues } from '@/features/anamnese/models';
import styles from './condition-card.module.css';

interface PatientConditionCardProps {
  index: number;
  form: UseFormReturnType<AnamneseFormValues>;
  title: string;
  editing: boolean;
}

export default function PatientConditionCard({
  index,
  form,
  title,
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
          <Tooltip label={title} openDelay={800}>
            <Text span fw={600} c="gray.9" truncate>
              {title}
            </Text>
          </Tooltip>

          <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'flex-start' }}>
            <Switch
              withThumbIndicator={false}
              disabled={!editing}
              key={form.key(`conditions.${index}.hasCondition`)}
              {...form.getInputProps(`conditions.${index}.hasCondition`, {
                type: 'checkbox',
              })}
              classNames={styles}
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
