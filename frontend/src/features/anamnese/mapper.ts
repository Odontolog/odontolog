import { Replace } from '@/shared/utils';
import { Anamnese, AnamneseActivity } from './models';

type ActivityDto = Replace<
  AnamneseActivity,
  {
    createdAt: string;
  }
>;

function mapToActivity(dto: ActivityDto): AnamneseActivity {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
  };
}

export type AnamneseDto = Replace<
  Anamnese,
  {
    patientId: number;
    history: ActivityDto[];
  }
>;

export function mapToAnamnese(dto: AnamneseDto): Anamnese {
  return {
    ...dto,
    patientId: dto.patientId.toString(),
    history: dto.history.map((a) => mapToActivity(a)),
  };
}
