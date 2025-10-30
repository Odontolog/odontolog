import { AttachmentDto, mapToAttachment } from '@/shared/attachments/mapper';
import { ActivityDto, mapToActivity, Replace } from '@/shared/mappers';
import { Procedure } from '@/shared/models';

export type ProcedureDto = Replace<
  Procedure,
  {
    id: number;
    updatedAt: string;
    performedAt: string | null;
    history: ActivityDto[];
    attachments: AttachmentDto[];
  }
>;

export function mapToProcedure(dto: ProcedureDto): Procedure {
  return {
    ...dto,
    id: dto.id.toString(),
    attachments: dto.attachments.map((att) => mapToAttachment(att)),
    updatedAt: new Date(dto.updatedAt),
    performedAt: dto.performedAt !== null ? new Date(dto.performedAt) : null,
    history: dto.history.map((a) => mapToActivity(a)),
  };
}
