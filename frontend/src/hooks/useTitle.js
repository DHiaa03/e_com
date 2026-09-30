import { useEffect } from 'react';

const BRAND = 'BLACK ELEGANCE';

/** One place decides what the browser tab says. */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND}` : BRAND;
  }, [title]);
}

export default useTitle;
