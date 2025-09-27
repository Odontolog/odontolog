import NotFound from '@/shared/components/not-found';
import { Flex } from '@mantine/core';

export default function GlobalNotFound() {
  const data = {
    title: 'Página não encontrada',
    description:
      'O recurso que você deseja não está acessível. Cheque novamente o endereço inserido.',
  };

  return (
    <Flex w="100%" h="100vh" align="center" justify="center">
      <NotFound {...data} />
    </Flex>
  );
}
