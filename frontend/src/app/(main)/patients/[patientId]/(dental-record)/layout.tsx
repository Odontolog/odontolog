import { notFound } from 'next/navigation';

import PatientHeader from '@/features/patient/header/header';
import { getPatientById } from '@/features/patient/requests';
import { ScrollArea } from '@mantine/core';

export default async function PatientPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const patient = await getPatientById(patientId);

  if (patient === undefined) {
    notFound();
  }

  return (
    <>
      <PatientHeader patient={patient} />
      <ScrollArea w="100%" style={{ flex: 1 }}>
        {children}
      </ScrollArea>
    </>
  );
}
