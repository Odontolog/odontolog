import { redirect } from 'next/navigation';

export default async function PatientPage({
  params,
}: {
  params: { patient_id: string };
}) {
  const { patient_id } = await params;

  redirect(`/patients/${patient_id}/procedures`);
}
