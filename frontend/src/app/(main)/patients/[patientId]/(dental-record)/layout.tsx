import PatientHeader from '@/features/patient/header/header';
import { getPatientById } from '@/features/patient/requests';
import { requireAuth } from '@/shared/utils';

export default async function PatientPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;

  const user = await requireAuth();
  const patient = await getPatientById(patientId);

  return (
    <>
      <PatientHeader patient={patient} user={user} />
      {children}
    </>
  );
}
