import React from 'react';

import { Download } from 'lucide-react';

export default function DownloadButton({ label }: { label: string }) {
  return (
    <div className='flex items-center rounded-md bg-[#b1b2b5] px-3 py-2 text-sm shadow hover:cursor-pointer hover:bg-black hover:text-white'>
      {label}
      <Download className='ml-2 h-5 w-5' />
    </div>
  );
}
