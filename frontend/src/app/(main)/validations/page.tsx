import { Box, Group } from '@mantine/core';

import ValidationsSection from '@/features/validations/validations-section';
import Header from '@/shared/components/header';
import ValidationDetailSection from '@/features/validations/validation-details-section';

export default function ProcedureValidationPage() {
  return (
    <>
      <Header
        title="Pedidos de validações"
        subtitle="Veja abaixo a listagem de procedimentos e planos de tratamento que você precisa revisar."
      />
      <Group align="flex-start" py="md" px="lg" h="100%">
        <Box flex="1" h="100%">
          <ValidationsSection />
        </Box>

        {/* TODO: Colocar o DetailSection do Procedure */}
        <Box flex="1" h="100%" visibleFrom="md">
          <ValidationDetailSection />
        </Box>
      </Group>
    </>
  );
}
