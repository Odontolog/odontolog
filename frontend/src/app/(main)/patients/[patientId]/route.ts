import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } },
) {
  const { patientId } = await params;
  return NextResponse.redirect(
    new URL(`/patients/${patientId}/procedures`, request.url),
  );
}
