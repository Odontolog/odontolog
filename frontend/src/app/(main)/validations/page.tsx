import { Box, Group } from '@mantine/core';

import TreatmentPlanDetailSection from '@/features/treatment-plans/treatment-plan-detail-section';
import ValidationsSection from '@/features/validations/validations-section';
import Header from '@/shared/components/header';

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

        {/* TODO: Esperar a task do @Gabriel para adicionar ou ajusar esse componente */}
        <Box flex="1" h="100%">
          <TreatmentPlanDetailSection />
        </Box>
      </Group>
    </>
  );
}
