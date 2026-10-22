import { useEffect, useState } from "react";
import { PATHS } from "@/shared/constants/paths";
import { useKeyboardFocus } from "@/shared/hooks/useKeyboardFocus";
import { NotFoundBox } from "@/shared/components/notFound/NotFoundBox";
import { BookPageBox } from "@/modules/book/components/bookPage/BookPageBox";

const App = () => {
  useKeyboardFocus();
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const updatePathname = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", updatePathname);
    return () => window.removeEventListener("popstate", updatePathname);
  }, []);
  return Object.values(PATHS).includes(pathname) ? (
    <BookPageBox />
  ) : (
    <NotFoundBox />
  );
};

export default App;
