'use client';

import { useEffect } from 'react';

export default function ReactScanWrapper() {
  useEffect(() => {
    // Only load react-scan when NEXT_PUBLIC_REACT_SCAN env var is set
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_REACT_SCAN === 'true') {
      import('react-scan').then(({ scan }) => {
        scan({
          enabled: true,
          log: false,
        });
      });
    }
  }, []);

  return null;
}
