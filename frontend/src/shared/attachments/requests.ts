import { getAuthToken } from '@/shared/utils';
import {
  CreateAttachmentRequest,
  InitUploadResponse,
  UploadAttachment,
} from './models';

export async function saveAttachment(
  patientId: string,
  att: UploadAttachment,
  procedureId?: string,
) {
  const token = await getAuthToken();

  const initUploadRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/attachments/init-upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!initUploadRes.ok) {
    throw new Error(
      `Erro ao inicializar upload do arquivo: ${initUploadRes.status}`,
    );
  }

  const { file, description } = att;
  const { uploadUrl, objectKey } =
    (await initUploadRes.json()) as InitUploadResponse;

  const uploadFileRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
    body: file,
  });

  if (!uploadFileRes.ok) {
    throw new Error(`Erro no upload do arquivo: ${uploadFileRes.statusText}`);
  }

  const createAttachmentPayload: CreateAttachmentRequest = {
    filename: file.name,
    filetype: file.type,
    objectKey,
    size: file.size,
    description,
  };

  if (procedureId !== undefined) {
    createAttachmentPayload.procedureId = procedureId;
  }

  const createAttRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/attachments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createAttachmentPayload),
    },
  );

  if (!createAttRes.ok) {
    throw new Error(`Erro ao criar um attachments: ${createAttRes.statusText}`);
  }
}
