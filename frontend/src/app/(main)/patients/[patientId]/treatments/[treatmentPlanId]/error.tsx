'use client';

import { ServerError } from '@/shared/components/server-error';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <ServerError
        title="Algo de errado aconteceu"
        description="Nosso servidor não conseguiu suportar essa requisição. Tente recarregar a página."
        reset={reset}
      />
    </div>
  );
}
