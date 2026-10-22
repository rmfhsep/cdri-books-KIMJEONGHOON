import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";
import { useExpandedIds } from "@/modules/book/hooks/useExpandedIds";
import { useSavedBooksQuery } from "@/modules/book/hooks/useSavedBooksQuery";
import {
  getSavedPage,
  useScrollRestoration,
} from "@/modules/book/hooks/useScrollRestoration";
import { BookTab } from "@/modules/book/types/book";
import type { Book } from "@/modules/book/types/book";

interface UseFavoritesPanelParams {
  active: boolean;
  onExpand: (book: Book) => void;
}

/**
 * 찜 목록과 화면에 올린 범위, 최신 도서 정보 조회와 스크롤 위치를 관리한다.
 * 새로고침 후에는 보던 10개부터 시작하고, 화면에 올린 범위만 ISBN으로 최신 정보를 조회한다.
 * @param params.active 찜 탭이 보이는 동안에만 최신 정보를 조회한다.
 * @param params.onExpand 상세보기를 펼칠 때 호출한다.
 * @returns 찜 목록 데이터, 찜 여부 확인용 ID 목록, 찜 전환·앞뒤 범위 확장·펼침 액션.
 * @example
 * const favoritesPanel = useFavoritesPanel({ active, onExpand });
 */
export const useFavoritesPanel = ({
  active,
  onExpand,
}: UseFavoritesPanelParams) => {
  const [favorites, setFavorites] = useState(() =>
    readStorage<Book[]>(STORAGE_KEYS.favorites, []),
  );
  const [range, setRange] = useState(() => {
    const start = (getSavedPage(BookTab.Favorites) - 1) * 10;
    return { start, end: start + 10 };
  });
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);
  const scroll = useScrollRestoration({
    tabKey: BookTab.Favorites,
    scrollParent,
    ready: true,
  });
  const { expandedIds, toggleExpanded } = useExpandedIds({
    storageKey: STORAGE_KEYS.favoritesExpandedIds,
    onExpand,
  });
  // 찜 해제로 목록이 줄어도 빈 화면이 되지 않도록 시작 위치를 마지막 10개 안으로 맞춘다.
  const start = Math.min(
    range.start,
    Math.max(0, Math.floor((favorites.length - 1) / 10) * 10),
  );
  const end = Math.max(range.end, start + 10);

  const queries = useSavedBooksQuery(favorites.slice(start, end), active);
  const updates = new Map(
    queries.flatMap((query) =>
      query.data ? [[query.data.isbn, query.data] as const] : [],
    ),
  );
  const currentFavorites = favorites.map((book) => {
    const latest = updates.get(book.isbn);
    return latest ? { ...latest, id: book.id } : book;
  });
  const savedSnapshot = JSON.stringify(currentFavorites);
  const hasUpdates = updates.size > 0;

  /** @param book 찜 상태를 전환할 도서. 새로 찜하면 목록 맨 앞에 추가한다. */
  const toggleLike = (book: Book) => {
    const next = currentFavorites.some((item) => item.id === book.id)
      ? currentFavorites.filter((item) => item.id !== book.id)
      : [book, ...currentFavorites];
    setFavorites(next);
    writeStorage(STORAGE_KEYS.favorites, next);
  };

  useEffect(() => {
    // 최신 조회 결과는 캐시에서 조합하고, 재시작 시 사용할 스냅샷만 갱신한다.
    if (hasUpdates)
      writeStorage(STORAGE_KEYS.favorites, JSON.parse(savedSnapshot));
  }, [savedSnapshot, hasUpdates]);

  return {
    scroll,
    scrollParent,
    setScrollParent,
    books: currentFavorites.slice(start, end),
    count: favorites.length,
    firstItemIndex: start,
    hasPrevious: start > 0,
    hasMore: end < favorites.length,
    expandedIds,
    toggleExpanded,
    refreshingFailed: queries.some((query) => query.isError),
    likedIds: new Set(favorites.map((book) => book.id)),
    toggleLike,
    loadPrevious: () => setRange({ start: Math.max(0, start - 10), end }),
    loadMore: () =>
      setRange({ start, end: Math.min(end + 10, favorites.length) }),
  };
};
