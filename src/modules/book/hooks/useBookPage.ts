import { useEffect, useState } from "react";
import { PATHS } from "@/shared/constants/paths";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";
import { useFavoritesPanel } from "@/modules/book/hooks/useFavoritesPanel";
import { useSearchPanel } from "@/modules/book/hooks/useSearchPanel";
import { BookTab } from "@/modules/book/types/book";
import type { Book } from "@/modules/book/types/book";

/**
 * 현재 경로와 최근 본 책을 관리하고, 검색·찜 패널을 조합한다.
 * @returns 현재 경로·탭, 최근 본 책, 탭별 패널(searchPanel·favoritesPanel).
 * @example
 * const page = useBookPage();
 */
export const useBookPage = () => {
  const [path, setPath] = useState(window.location.pathname);
  const tab = path === PATHS.favorites ? BookTab.Favorites : BookTab.Search;
  const [recentBook, setRecentBook] = useState(() =>
    readStorage<Book | null>(STORAGE_KEYS.recentBook, null),
  );

  const saveRecentBook = (book: Book) => {
    setRecentBook(book);
    writeStorage(STORAGE_KEYS.recentBook, book);
  };

  const searchPanel = useSearchPanel({ onExpand: saveRecentBook });
  const favoritesPanel = useFavoritesPanel({
    active: tab === BookTab.Favorites,
    onExpand: saveRecentBook,
  });

  /** @param next 이동할 경로. 같은 경로면 기록하지 않는다. */
  const navigate = (next: string) => {
    if (next === path) return;
    window.history.pushState(null, "", next);
    setPath(next);
  };

  /** 최근 본 책을 다시 검색하고 검색 탭으로 이동한다. */
  const searchRecentBook = () => {
    if (!recentBook) return;
    navigate(PATHS.search);
    searchPanel.searchBook(recentBook);
  };

  // 뒤로·앞으로 가기로 주소가 바뀌면 화면도 맞춘다.
  useEffect(() => {
    const restorePath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", restorePath);
    return () => window.removeEventListener("popstate", restorePath);
  }, []);

  return {
    path,
    tab,
    navigate,
    recentBook,
    searchRecentBook,
    scrollParent:
      tab === BookTab.Search
        ? searchPanel.scrollParent
        : favoritesPanel.scrollParent,
    likedIds: favoritesPanel.likedIds,
    toggleLike: favoritesPanel.toggleLike,
    searchPanel,
    favoritesPanel,
  };
};
