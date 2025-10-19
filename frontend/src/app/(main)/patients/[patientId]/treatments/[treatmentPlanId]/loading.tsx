import { Box, Loader, Stack } from '@mantine/core';

export default function LoadingTreatmentPlanPage() {
  return (
    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Stack align="center" mt={100} style={{ height: '100%' }}>
        <Loader size="lg" />
        Carregando Plano de Tratamento
      </Stack>
    </Box>
  );
}
