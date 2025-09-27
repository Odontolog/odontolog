import { Box, Loader, Stack } from '@mantine/core';

export default function LoadingProcedurePage() {
  return (
    <Box style={{ height: '100vh' }}>
      <Stack align="center" mt={100} style={{ height: '100%' }}>
        <Loader size="lg" />
        Carregando Procedimento
      </Stack>
    </Box>
  );
}
