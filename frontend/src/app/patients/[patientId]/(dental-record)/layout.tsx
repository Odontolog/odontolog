import { notFound } from 'next/navigation';

import PatientHeader from '@/features/patient/header/header';
import { getPatientById } from '@/features/patient/requests';

export default async function PatientPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { patientId: string };
}) {
  const { patientId } = await params;
  const patient = await getPatientById(patientId);

  if (patient === undefined) {
    notFound();
    return;
  }

  return (
    <>
      <PatientHeader patient={patient} />
      <div>{children}</div>
    </>
  );
}
