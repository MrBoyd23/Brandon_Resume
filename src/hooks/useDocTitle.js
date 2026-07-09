import { useEffect } from 'react';

const DEFAULT_TITLE = 'Brandon Boyd — System Engineer III | Resume & Portfolio';

export default function useDocTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Brandon Boyd` : DEFAULT_TITLE;
    return () => { document.title = DEFAULT_TITLE; };
  }, [title]);
}
