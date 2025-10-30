import { type FileWithPath } from '@mantine/dropzone';

export type UploadAttachment = {
  file: FileWithPath;
  description: string;
};

export type InitUploadResponse = {
  uploadUrl: string;
  objectKey: string;
};
