import { List, Text } from '@mantine/core';

import { AnamneseEditConditionsMetadata } from '@/features/anamnese/models';

interface EditConditionDetailProps {
  metadata: AnamneseEditConditionsMetadata;
}

export default function EditConditionDetail(props: EditConditionDetailProps) {
  const updatedConditions = props.metadata.updatedFields;

  return (
    <List
      size="sm"
      c="dimmed"
      styles={{
        itemWrapper: { display: 'inline' },
      }}
    >
      {updatedConditions.map((condition, index) => (
        <List.Item key={index}>
          <Text span fw={700} c="dimmed" size="sm">
            {condition.condition}
          </Text>{' '}
          <Text span c="dimmed" size="sm">
            [{condition.hasCondition ? 'Sim' : 'Não'}]: {condition.notes}
          </Text>
        </List.Item>
      ))}
    </List>
  );
}
