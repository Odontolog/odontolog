import { redirect } from 'next/navigation';

export default async function PatientPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;

  redirect(`/patients/${patientId}/procedures`);
}
