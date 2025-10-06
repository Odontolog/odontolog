import { ReviewableShort } from '@/shared/models';
import { getAuthToken } from '@/shared/utils';

import { queryOptions } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

export function getValidationsOptions() {
  return queryOptions({
    queryKey: ['validations'],
    queryFn: () => getValidations({}),
  });
}

async function getValidations(params: {
  page?: number;
  size?: number;
  awaitingMyReview?: boolean;
}): Promise<ReviewableShort[]> {
  const token = await getAuthToken();

  const page = params?.page ?? 0;
  const size = params?.size ?? 20;
  const awaitingMyReview = params?.awaitingMyReview ?? false;

  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    awaitingMyReview: String(awaitingMyReview),
  });
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviewables/me?${searchParams}`;

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status >= 500) {
    throw new Error(
      `Erro ao buscar lista de atividades revisáveis: ${res.status}`,
    );
  } else if (res.status >= 400) {
    notFound();
  }

  const data = (await res.json()) as { content: ReviewableShort[] };
  // console.log(data.content);

  return data.content;
}
