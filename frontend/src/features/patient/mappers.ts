import { Patient } from '@/shared/models';
import { Replace } from '@/shared/utils';

export type PatientDTO = Replace<
  Patient,
  {
    id: number;
    updatedAt: string;
  }
>;

export function mapToPatient(dto: PatientDTO): Patient {
  return {
    ...dto,
    id: dto.id.toString(),
    birthDate: new Date(dto.birthDate),
  };
}
