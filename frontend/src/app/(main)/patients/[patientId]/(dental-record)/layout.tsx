import PatientHeader from '@/features/patient/header/header';
import { getPatientById } from '@/features/patient/requests';

export default async function PatientPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const patient = await getPatientById(patientId);

  return (
    <>
      <PatientHeader patient={patient} />
      {children}
    </>
  );
}
