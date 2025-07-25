// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren } from 'react';

import { createCSVDownloadingLink } from '#utils/fetchers/csv/fetchCSV-client';

type DownloadingButtonProps<T extends Record<string, any>> = PropsWithChildren<{
  params: Parameters<typeof createCSVDownloadingLink<T>>[0];
}>;

export default function DownloadingButton<T extends Record<string, any>>({
  children,
  params,
}: DownloadingButtonProps<T>) {
  const downloadingLink = createCSVDownloadingLink<T>(params).toString();

  return (
    <a href={downloadingLink} download={true} target='_blank'>
      <button style={{ border: '1px solid yellowgreen' }}>{children}</button>
    </a>
  );
}
