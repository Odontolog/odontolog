import { Box, Loader, Stack } from '@mantine/core';

export default function Loading({ message }: { message: string }) {
  return (
    <Box style={{ height: '100vh' }}>
      <Stack align="center" mt={100} style={{ height: '100%' }}>
        <Loader size="lg" />
        {message}
      </Stack>
    </Box>
  );
}
