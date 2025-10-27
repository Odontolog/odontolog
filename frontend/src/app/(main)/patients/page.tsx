import { Box } from '@mantine/core';

import { getAllPatients } from '@/features/appshell/requests';
import PatientsSection from '@/features/patients/patients';
import Header from '@/shared/components/header';

export default async function PatientsListPage() {
  const patients = await getAllPatients();

  return (
    <>
      <Header
        title="Pacientes"
        subtitle="Veja abaixo a listagem dos pacientes cadastrados no sistema."
      />
      <Box py="md" px="lg" h="100%">
        <PatientsSection patients={patients} />
      </Box>
    </>
  );
}
