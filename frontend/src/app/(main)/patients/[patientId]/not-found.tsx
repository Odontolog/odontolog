import NotFound from '@/shared/components/not-found';

export default function PatientNotFound() {
  const data = {
    title: 'Paciente não encontrado',
    description:
      'A página que você tentou acessar não existe. Cheque novamente o endereço inserido.',
  };

  return <NotFound {...data} />;
}
