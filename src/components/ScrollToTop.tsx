import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** BrowserRouter doesn't reset scroll position on navigation by default — without this, clicking Men/Women from partway down the homepage lands on the event page still scrolled down. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
