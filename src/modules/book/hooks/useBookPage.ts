import { useEffect, useState } from "react";
import { useBookSearchQuery } from "@/modules/book/hooks/useBookSearchQuery";
import { useSavedBooksQuery } from "@/modules/book/hooks/useSavedBooksQuery";
import { BookTab } from "@/modules/book/types/book";
import type { Book, BookSearchParams } from "@/modules/book/types/book";
import {
  readBookStorage,
  writeBookStorage,
} from "@/modules/book/utils/bookStorage";

/**
 * 검색·찜 화면의 상태와 저장 데이터, 목록 동작을 관리한다.
 * @returns 화면 상태, 목록, 검색·찜·탭 전환·추가 로딩 액션.
 * @example
 * const page = useBookPage();
 */
export function useBookPage() {
  const [stored] = useState(readBookStorage);
  const [history, setHistory] = useState(stored.history);
  const [favorites, setFavorites] = useState(stored.favorites);
  const [storageError, setStorageError] = useState(stored.failed);
  const [tab, setTab] = useState(() =>
    new URLSearchParams(window.location.search).get("tab") === BookTab.Favorites
      ? BookTab.Favorites
      : BookTab.Search,
  );
  const [params, setParams] = useState<BookSearchParams>(stored.searchParams);
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedIds, setExpandedIds] = useState(stored.expandedIds);
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);
  useEffect(() => {
    scrollParent?.scrollTo({ top: 0 });
  }, [tab, params, scrollParent]);
  useEffect(() => {
    function restoreTab() {
      setTab(
        new URLSearchParams(window.location.search).get("tab") ===
          BookTab.Favorites
          ? BookTab.Favorites
          : BookTab.Search,
      );
      setVisibleCount(10);
    }
    window.addEventListener("popstate", restoreTab);
    return () => window.removeEventListener("popstate", restoreTab);
  }, []);
  const searchQuery = useBookSearchQuery(params);
  const savedQueries = useSavedBooksQuery(
    favorites.slice(0, visibleCount),
    tab === BookTab.Favorites,
  );

  const updates = new Map(
    savedQueries.flatMap((query) =>
      query.data ? [[query.data.isbn, query.data] as const] : [],
    ),
  );
  const currentFavorites = favorites.map((saved) => {
    const book = updates.get(saved.book.isbn);
    return book ? { ...saved, book: { ...book, id: saved.book.id } } : saved;
  });
  const savedSnapshot = JSON.stringify(currentFavorites);
  const hasUpdates = updates.size > 0;
  useEffect(() => {
    // 최신 조회 결과는 캐시에서 조합하고, 재시작 시 사용할 스냅샷만 갱신한다.
    if (hasUpdates)
      writeBookStorage("books.favorites", JSON.parse(savedSnapshot));
  }, [savedSnapshot, hasUpdates]);

  function saveHistory(next: string[]) {
    setHistory(next);
    if (!writeBookStorage("books.history", next)) setStorageError(true);
  }

  const isFavorites = tab === BookTab.Favorites;
  const searchBooks = [
    ...new Map(
      (searchQuery.data?.pages.flatMap((page) => page.books) ?? []).map(
        (book) => [book.id, book],
      ),
    ).values(),
  ];
  const books = isFavorites
    ? currentFavorites.slice(0, visibleCount).map((item) => item.book)
    : searchBooks;

  /** @param next 제출한 검색 조건. 일반검색과 상세검색은 이 값으로 교체한다. */
  function search(next: BookSearchParams) {
    setParams(next);
    if (!writeBookStorage("books.searchParams", next)) setStorageError(true);
    setExpandedIds([]);
    if (!writeBookStorage("books.expandedIds", [])) setStorageError(true);
    if (!next.target)
      saveHistory(
        [next.query, ...history.filter((item) => item !== next.query)].slice(
          0,
          8,
        ),
      );
    if (JSON.stringify(params) === JSON.stringify(next))
      void searchQuery.refetch();
  }
  /** @param book 찜 상태를 전환할 도서. 추가 시점의 데이터와 날짜를 저장한다. */
  function toggleLike(book: Book) {
    const next = currentFavorites.some((item) => item.book.id === book.id)
      ? currentFavorites.filter((item) => item.book.id !== book.id)
      : [{ book, savedAt: new Date().toISOString() }, ...currentFavorites];
    setFavorites(next);
    if (!writeBookStorage("books.favorites", next)) setStorageError(true);
  }
  /** @param next 이동할 검색 또는 찜 목록 탭. */
  function changeTab(next: BookTab) {
    if (next === tab) return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.pushState(null, "", url);
    setTab(next);
    setVisibleCount(10);
  }
  /** @param id 펼침 상태를 전환할 도서 ID. 가상화로 DOM에서 제거되어도 상태는 유지한다. */
  function toggleExpanded(id: string) {
    const next = expandedIds.includes(id)
      ? expandedIds.filter((value) => value !== id)
      : [...expandedIds, id];
    setExpandedIds(next);
    if (!writeBookStorage("books.expandedIds", next)) setStorageError(true);
  }

  function loadMore() {
    if (isFavorites)
      setVisibleCount((current) => Math.min(current + 10, favorites.length));
    else if (
      searchQuery.hasNextPage &&
      !searchQuery.isFetching &&
      !searchQuery.isError
    )
      void searchQuery.fetchNextPage({ cancelRefetch: false });
  }
  function retry() {
    if (searchQuery.isFetchNextPageError)
      void searchQuery.fetchNextPage({ cancelRefetch: false });
    else void searchQuery.refetch();
  }
  return {
    scrollParent,
    setScrollParent,
    listKey: JSON.stringify(params),
    tab,
    isFavorites,
    history,
    books,
    expandedIds,
    storageError,
    searchQuery,
    count: isFavorites
      ? favorites.length
      : (searchQuery.data?.pages[0]?.totalCount ?? 0),
    likedIds: new Set(favorites.map((item) => item.book.id)),
    hasMore: isFavorites
      ? visibleCount < favorites.length
      : searchQuery.hasNextPage,
    refreshingFailed:
      isFavorites && savedQueries.some((query) => query.isError),
    search,
    toggleLike,
    changeTab,
    toggleExpanded,
    loadMore,
    retry,
    removeHistory: (query: string) =>
      saveHistory(history.filter((value) => value !== query)),
  };
}
