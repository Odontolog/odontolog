export default function PatientPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>Cabeçalho do Prontuário - Dados do paciente e foto</div>
      {children}
    </>
  );
}
