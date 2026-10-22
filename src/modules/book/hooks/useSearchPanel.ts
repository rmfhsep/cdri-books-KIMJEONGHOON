import { useState } from "react";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";
import { useBookSearchQuery } from "@/modules/book/hooks/useBookSearchQuery";
import { useExpandedIds } from "@/modules/book/hooks/useExpandedIds";
import {
  getSavedPage,
  useScrollRestoration,
} from "@/modules/book/hooks/useScrollRestoration";
import { BookSearchTarget, BookTab } from "@/modules/book/types/book";
import type {
  Book,
  BookSearchParams,
  SearchHistoryItem,
} from "@/modules/book/types/book";

interface UseSearchPanelParams {
  active: boolean;
  onExpand: (book: Book) => void;
}

/**
 * 도서 검색 탭의 검색 조건, 검색 결과, 검색기록과 스크롤 위치를 관리한다.
 * @param params.active 검색 탭이 보이는 동안에만 검색 결과를 조회한다.
 * @param params.onExpand 상세보기를 펼칠 때 호출한다.
 * @returns 검색 결과 목록 데이터와 검색·기록 삭제·재시도·앞뒤 페이지 요청·펼침 액션.
 * @example
 * const searchPanel = useSearchPanel({ active, onExpand });
 */
export const useSearchPanel = ({ active, onExpand }: UseSearchPanelParams) => {
  const [searchParams, setSearchParams] = useState(() =>
    readStorage<BookSearchParams>(STORAGE_KEYS.searchParams, { query: "" }),
  );
  const [history, setHistory] = useState(() =>
    readStorage<SearchHistoryItem[]>(STORAGE_KEYS.history, []),
  );
  const [searchBoxKey, setSearchBoxKey] = useState(0);
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

  const query = useBookSearchQuery(
    searchParams,
    getSavedPage(BookTab.Search),
    active,
  );

  const scroll = useScrollRestoration({
    tabKey: BookTab.Search,
    scrollParent,
    ready: !query.isLoading,
  });

  const { expandedIds, toggleExpanded, resetExpanded } = useExpandedIds({
    storageKey: STORAGE_KEYS.searchExpandedIds,
    onExpand,
  });

  const books = query.data?.pages.flatMap((page) => page.books) ?? [];
  const firstPage = Number(query.data?.pageParams[0] ?? 1);
  const canFetch = !query.isFetching && !query.isError;

  const saveHistory = (next: SearchHistoryItem[]) => {
    setHistory(next);
    writeStorage(STORAGE_KEYS.history, next);
  };

  /** @param next 제출한 검색 조건. 일반검색과 상세검색은 이 값으로 교체한다. */
  const search = (next: BookSearchParams) => {
    scroll.clear();
    resetExpanded();
    setSearchParams(next);
    writeStorage(STORAGE_KEYS.searchParams, next);
    const item = { query: next.query, target: next.target, label: next.label };
    saveHistory(
      [item, ...history.filter((value) => !isSameHistory(value, item))].slice(
        0,
        8,
      ),
    );
    if (JSON.stringify(searchParams) === JSON.stringify(next)) query.refetch();
  };

  /** @param book 다시 검색할 도서. ISBN으로 검색하고 검색창과 결과 문구에는 제목을 표시한다. */
  const searchBook = (book: Book) => {
    const isbn = book.isbn.trim().split(/\s+/).at(-1);
    search(
      isbn
        ? { query: isbn, target: BookSearchTarget.Isbn, label: book.title }
        : { query: book.title, target: BookSearchTarget.Title },
    );
    writeStorage(STORAGE_KEYS.searchInput, book.title);
    setSearchBoxKey((key) => key + 1);
  };

  /** @param suggestion 오타 교정 제안 클릭 시 재검색할 단어. 검색창 표시도 함께 갱신한다. */
  const searchSuggestion = (suggestion: string) => {
    search({ query: suggestion });
    writeStorage(STORAGE_KEYS.searchInput, suggestion);
    setSearchBoxKey((key) => key + 1);
  };

  const retry = () => {
    if (query.isFetchPreviousPageError) query.fetchPreviousPage();
    else if (query.isFetchNextPageError) query.fetchNextPage();
    else query.refetch();
  };

  return {
    scroll,
    scrollParent,
    setScrollParent,
    books,
    count: query.data?.pages[0]?.totalCount ?? 0,
    submittedQuery: searchParams.query,
    label: searchParams.label ?? searchParams.query,
    listKey: JSON.stringify(searchParams),
    firstItemIndex: (firstPage - 1) * 10,
    hasPrevious: query.hasPreviousPage,
    hasMore: query.hasNextPage,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    errorMessage: query.errorMessage,
    expandedIds,
    toggleExpanded,
    history,
    searchBoxKey,
    search,
    searchBook,
    searchSuggestion,
    retry,
    removeHistory: (item: SearchHistoryItem) =>
      saveHistory(history.filter((value) => !isSameHistory(value, item))),
    loadPrevious: () => {
      if (query.hasPreviousPage && canFetch) query.fetchPreviousPage();
    },
    loadMore: () => {
      if (query.hasNextPage && canFetch) query.fetchNextPage();
    },
  };
};

const isSameHistory = (a: SearchHistoryItem, b: SearchHistoryItem) => {
  return a.query === b.query && a.target === b.target;
};
