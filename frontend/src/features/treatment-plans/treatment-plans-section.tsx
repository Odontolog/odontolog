'use client';

import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';

import TreatmentPlanCard from '@/shared/components/treatment-plan-card';
import { getPatientTratmentPlansOptions } from './requests';
import { useQuery } from '@tanstack/react-query';

interface TreatmentPlansSectionProps {
  patientId: string;
}

export default function TreatmentPlansSection({
  patientId,
}: TreatmentPlansSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  const options = getPatientTratmentPlansOptions(patientId);

  const { data: treatmentPlans, isLoading } = useQuery({
    ...options,
  });

  function onTreatmentPlanSelect(treatmentPlanId: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('active', treatmentPlanId);
    router.push(`?${newParams.toString()}`, { scroll: false });
  }

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Planos de tratamento
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            disabled={isLoading}
            onClick={() => console.log('creating new treatment plan')}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        {isLoading || treatmentPlans === undefined ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <Timeline bulletSize={16}>
            <Timeline.Item title="2025">
              <Stack gap="sm" my="xs">
                {treatmentPlans.map((tp) => (
                  <TreatmentPlanCard
                    key={tp.id}
                    treatmentPlan={tp}
                    selected={tp.id === active?.toString()}
                    onSelect={onTreatmentPlanSelect}
                  />
                ))}
              </Stack>
            </Timeline.Item>
            <Timeline.Item title="2024" mt="sm">
              {' '}
            </Timeline.Item>
          </Timeline>
        )}
      </Card.Section>
    </Card>
  );
}
