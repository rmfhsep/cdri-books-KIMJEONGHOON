import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { FavoritesSort } from "@/modules/book/constants/favoritesSort";
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
  const [sort, setSort] = useState<FavoritesSort>(FavoritesSort.Latest);
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

  // 페이지네이션을 위한 처리
  // 찜 해제로 목록이 줄어도 빈 화면이 되지 않도록 시작 위치를 마지막 10개 안으로 맞춘다.
  // 예: range.start가 50인데 찜 해제로 23권만 남으면, 마지막 페이지 시작(20)으로 끌어내린다.
  const start = Math.min(
    range.start,
    Math.max(0, Math.floor((favorites.length - 1) / 10) * 10),
  );
  // start가 위에서 줄어들 수 있으니, 그래도 한 페이지(10개)는 보이도록 end의 하한을 다시 맞춘다.
  const end = Math.max(range.end, start + 10);

  // 화면에 보이는 범위(start~end)의 책만 ISBN으로 최신 가격·정보를 조회한다(전체를 매번 조회하지 않음).
  const queries = useSavedBooksQuery(favorites.slice(start, end), active);
  // 조회에 성공한 책만 isbn -> 최신 데이터로 모아둔다. 실패한 건 기존 저장값을 그대로 쓴다.
  const updates = new Map(
    queries.flatMap((query) =>
      query.data ? [[query.data.isbn, query.data] as const] : [],
    ),
  );
  // 저장된 찜 목록(원래 순서 유지)에 최신 조회 결과를 덮어씌운다. id는 항상 저장된 값을 유지한다.
  const currentFavorites = favorites.map((book) => {
    const latest = updates.get(book.isbn);
    return latest ? { ...latest, id: book.id } : book;
  });
  // 정렬은 화면 표시용으로만 적용한다 — 저장소(favorites)의 순서는 "최신순" 기준으로 그대로 둔다.

  // 아래 effect에서 변경 여부를 비교하기 위해 미리 문자열로 만들어둔다.
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

  // 정렬된 도서 목록
  const sortedFavorites =
    sort === FavoritesSort.Latest
      ? currentFavorites
      : [...currentFavorites].sort((a, b) => {
          const priceA = a.salePrice ?? a.price;
          const priceB = b.salePrice ?? b.price;
          return sort === FavoritesSort.PriceDesc
            ? priceB - priceA
            : priceA - priceB;
        });

  useEffect(() => {
    // 최신 조회 결과가 있으면(hasUpdates) 다음 새로고침에도 보이도록 저장소를 갱신한다.
    // favorites(state)는 안 바꾼다 — 리렌더 중에 state를 또 바꾸면 무한 루프가 되기 때문에,
    // 화면에는 이미 매 렌더마다 계산되는 currentFavorites로 최신값이 보이고 있다.
    if (hasUpdates)
      writeStorage(STORAGE_KEYS.favorites, JSON.parse(savedSnapshot));
  }, [savedSnapshot, hasUpdates]);

  return {
    scroll,
    scrollParent,
    setScrollParent,
    // books는 항상 firstItemIndex(=start)번째부터 시작하는 조각이어야 한다.
    // 가상 목록(virtuoso)이 firstItemIndex로 "이 조각이 전체 목록의 몇 번째부터인지"를 계산해서
    // 스크롤 위치를 맞추기 때문에, 둘은 항상 같은 start 값을 써야 한다.
    books: sortedFavorites.slice(start, end),
    count: favorites.length,
    sort,
    setSort,
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
