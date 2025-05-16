import { useRef } from 'react';

import downloadSVGUtils from '../downloader/downloadSVG';

type Params = Parameters<typeof downloadSVGUtils>;

export function useDownloadSVG() {
  const ref = useRef<SVGSVGElement>(null);

  function downloadSVG(options?: Params[1]) {
    if (ref == null) {
      throw new Error('SVG ref is not defined' + ref);
    }

    downloadSVGUtils(ref.current, options);
  }

  return {
    ref,
    downloadSVG,
  };
}
