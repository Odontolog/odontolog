import { Box } from '@mantine/core';

import { getAllPatients } from '@/features/appshell/requests';
import CreatePatientButton from '@/features/patients/create-patient-button';
import PatientsSection from '@/features/patients/patients';
import Header from '@/shared/components/header';
import { requireAuth } from '@/shared/utils';

export default async function PatientsListPage() {
  const user = await requireAuth();
  const patients = await getAllPatients();

  return (
    <>
      <Header
        title="Pacientes"
        subtitle="Veja abaixo a listagem dos pacientes cadastrados no sistema."
        {...(user.role !== 'STUDENT' && { button: <CreatePatientButton /> })}
      />
      <Box py="md" px="lg" h="100%">
        <PatientsSection patients={patients} />
      </Box>
    </>
  );
}
