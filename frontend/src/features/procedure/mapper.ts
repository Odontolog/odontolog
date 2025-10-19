import { ActivityDto, mapToActivity, Replace } from '@/shared/mappers';
import { Procedure } from '@/shared/models';

export type ProcedureDto = Replace<
  Procedure,
  {
    id: number;
    updatedAt: string;
    history: ActivityDto[];
  }
>;

export function mapToProcedure(dto: ProcedureDto): Procedure {
  return {
    ...dto,
    id: dto.id.toString(),
    updatedAt: new Date(dto.updatedAt),
    history: dto.history.map((a) => mapToActivity(a)),
  };
}
