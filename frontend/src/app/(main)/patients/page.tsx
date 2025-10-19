'use client';

import { Card, Center, Image, Stack, Text } from '@mantine/core';

export default function PatientsListPage() {
  return (
    <Center h="100%" w="100%">
      <Card
        shadow="sm"
        withBorder
        radius="md"
        p="xl"
        style={{
          maxWidth: 600,
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Stack align="center" gap="md">
          <Image
            src="/working.png"
            alt="Em desenvolvimento"
            maw={300}
            radius="md"
            style={{ opacity: 0.9 }}
          />

          <Text fw={700} size="xl" c="dark">
            Listagem de Pacientes
          </Text>

          <Text c="dimmed" size="md">
            Estamos trabalhando para que essa listagem esteja pronta o mais cedo
            possível. Volte em breve!
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}
