import { useState } from "react";
import type { ListRange } from "react-virtuoso";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { FavoritesSort } from "@/modules/book/constants/favoritesSort";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";
import { useExpandedIds } from "@/modules/book/hooks/useExpandedIds";
import { useSavedBooksQuery } from "@/modules/book/hooks/useSavedBooksQuery";
import { useScrollRestoration } from "@/modules/book/hooks/useScrollRestoration";
import { BookTab } from "@/modules/book/types/book";
import type { Book } from "@/modules/book/types/book";

interface UseFavoritesPanelParams {
  active: boolean;
  onExpand: (book: Book) => void;
}

/**
 * 찜 목록과 정렬, 화면에 보이는 책의 최신 정보 조회, 스크롤 위치를 관리한다.
 * @param params.active 찜 탭이 보이는 동안에만 최신 정보를 조회한다.
 * @param params.onExpand 상세보기를 펼칠 때 호출한다.
 * @returns 찜 목록 데이터와 정렬, 보이는 범위 설정, 찜 전환·펼침 액션.
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
  const [sort, setSort] = useState(FavoritesSort.Latest);
  const [visibleRange, setVisibleRange] = useState<ListRange>({
    startIndex: 0,
    endIndex: 9,
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

  // 최신 순은 저장된 순서(새로 찜한 책이 앞) 그대로, 가격 순은 할인가가 있으면 할인가로 비교한다.
  const sortedFavorites =
    sort === FavoritesSort.Latest
      ? favorites
      : [...favorites].sort((a, b) => {
          const diff = (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
          return sort === FavoritesSort.PriceAsc ? diff : -diff;
        });

  // 화면에 보이는 책만 ISBN으로 최신 정보를 조회하고, 조회에 성공한 책은 최신 정보로 보여준다.
  const visibleBooks = sortedFavorites.slice(
    visibleRange.startIndex,
    visibleRange.endIndex + 1,
  );
  const queries = useSavedBooksQuery(visibleBooks, active);
  const latestBooks = queries.flatMap((query) =>
    query.data ? [query.data] : [],
  );
  const books = sortedFavorites.map((book) => {
    const latest = latestBooks.find((item) => item.isbn === book.isbn);
    return latest ? { ...latest, id: book.id } : book;
  });

  /** @param book 찜 상태를 전환할 도서. 새로 찜하면 목록 맨 앞에 추가한다. */
  const toggleLike = (book: Book) => {
    const next = favorites.some((item) => item.id === book.id)
      ? favorites.filter((item) => item.id !== book.id)
      : [book, ...favorites];
    setFavorites(next);
    writeStorage(STORAGE_KEYS.favorites, next);
  };

  return {
    scroll,
    scrollParent,
    setScrollParent,
    books,
    count: favorites.length,
    sort,
    setSort,
    setVisibleRange,
    expandedIds,
    toggleExpanded,
    refreshingFailed: queries.some((query) => query.isError),
    likedIds: new Set(favorites.map((book) => book.id)),
    toggleLike,
  };
};
