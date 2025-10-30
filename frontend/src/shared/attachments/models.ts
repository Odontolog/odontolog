import { type FileWithPath } from '@mantine/dropzone';

export type UploadAttachment = {
  file: FileWithPath;
  description: string;
};

export type InitUploadResponse = {
  uploadUrl: string;
  objectKey: string;
};

export type CreateAttachmentRequest = {
  filename: string;
  filetype: string;
  objectKey: string;
  size: number;
  description: string;
  procedureId?: string;
};
