import { NextRequest, NextResponse } from 'next/server';

import { CourrierTypeInterpellation } from '#components/pdfs/CourrierTypeInterpellation';
import { renderToStream } from '@react-pdf/renderer';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const communityName = searchParams.get('communityName') ?? '';
  const communityType = searchParams.get('communityType') ?? '';

  const stream = await renderToStream(
    <CourrierTypeInterpellation
      communityName={communityName}
      communityType={communityType}
      contactEmail={process.env.MY_EMAIL ?? 'contact@eclaireurpublic.fr'}
    />,
  );
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    // chunk can be string | Uint8Array
    const bufferChunk = typeof chunk === 'string' ? Buffer.from(chunk) : new Uint8Array(chunk);
    chunks.push(bufferChunk);
  }

  const pdfBuffer = Buffer.concat(
    chunks.map((c) => Buffer.from(c)), // ensure all are Buffer
  );
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="courrier-interpellation.pdf"',
    },
  });
}
