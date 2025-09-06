export default async function PatientProceduresPage({
  params,
}: {
  params: { patient_id: string };
}) {
  const { patient_id } = await params;
  return <p>Prontuário Paciente {patient_id} - Procedimentos Realizados</p>;
}
