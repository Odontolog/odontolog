import { Replace } from '@/shared/mappers';
import { TreatmentPlanShort } from '@/shared/models';

export type TreatmentPlanShortDto = Replace<
  TreatmentPlanShort,
  {
    id: number;
    updatedAt: string;
  }
>;

export function mapToTreatmentPlanShort(
  dto: TreatmentPlanShortDto,
): TreatmentPlanShort {
  return {
    ...dto,
    id: dto.id.toString(),
    updatedAt: new Date(dto.updatedAt),
  };
}
