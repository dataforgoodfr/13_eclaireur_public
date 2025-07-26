import { useCallback, useEffect, useState } from 'react';

export function useIsOpen() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const controlNavbar = useCallback(() => {
    if (typeof window === undefined) return;
    if (window.scrollY > lastScrollY) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }

    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [controlNavbar]);

  return isOpen;
}
