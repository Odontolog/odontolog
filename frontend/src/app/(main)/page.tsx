import { Card, Center, Image, Stack, Text } from '@mantine/core';

export default function Home() {
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
            Página Inicial!
          </Text>

          <Text c="dimmed" size="md">
            Estamos trabalhando para que essa página esteja pronta o mais cedo
            possível. Para acessar as funcionalidades, procure na busca por
            pacientes!
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}
