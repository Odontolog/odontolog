import { Box, Group } from '@mantine/core';

import styles from '@/features/patient/patient.module.css';
import ValidationDetailSection from '@/features/validations/validation-details-section';
import ValidationsSection from '@/features/validations/validations-section';
import Header from '@/shared/components/header';

export default function ProcedureValidationPage() {
  return (
    <>
      <Header
        title="Pedidos de validações"
        subtitle="Veja abaixo a listagem de procedimentos e planos de tratamento que você precisa revisar."
      />
      <Group className={styles.subpage}>
        <Box flex="1" h="100%">
          <ValidationsSection />
        </Box>

        <Box flex="1" h="100%" visibleFrom="md">
          <ValidationDetailSection />
        </Box>
      </Group>
    </>
  );
}
