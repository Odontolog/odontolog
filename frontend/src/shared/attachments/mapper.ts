import { Attachments, User } from '@/shared/models';

export type AttachmentDto = {
  id: number;
  location: string;
  objectKey: string;
  filename: string;
  filetype: string;
  description: string;
  size: number;
  uploader: User;
  presignedUrl: string;
  createdAt: string;
};

export function mapToAttachment(dto: AttachmentDto): Attachments {
  return {
    id: dto.id.toString(),
    location: dto.presignedUrl,
    createdAt: new Date(dto.createdAt),
    filename: dto.filename,
    type: dto.filetype,
    uploader: dto.uploader,
    size: dto.size,
    description: dto.description,
  };
}
