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

  // TODO: Ver sobre um aviso de não ter o paciente
  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <>
      <PatientHeader patient={patient} />
      <div>{children}</div>
    </>
  );
}
