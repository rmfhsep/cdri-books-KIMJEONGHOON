import { useRef, useState } from "react";
import type { BookSearchParams } from "@/modules/book/types/book";

import {
  readBookStorage,
  writeBookStorage,
} from "@/modules/book/utils/bookStorage";

interface UseSearchBoxProps {
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 검색어와 검색기록·상세검색 팝업의 표시 상태를 관리한다.
 * @param options.onSearch 검색 실행 콜백. query와 상세검색 시 선택한 target을 전달한다.
 * @returns 검색 상태와 상태 변경 함수, 일반검색·상세검색·팝업 열기 액션.
 * @example
 * const { query, setQuery, search, openPop } = useSearchBox({ onSearch });
 * // 입력 변경 시 setQuery(value), 폼 제출 시 search(query)를 호출한다.
 * // 상세검색 버튼에는 openPop을 연결한다.
 */
export function useSearchBox({ onSearch }: UseSearchBoxProps) {
  const [query, updateQuery] = useState(() => readBookStorage().input);
  /** @param value 검색창에 표시하고 재시작 후 복원할 입력값. */
  function setQuery(value: string) {
    updateQuery(value);
    writeBookStorage("books.searchInput", value);
  }
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);

  /** @param value 입력 또는 검색기록에서 선택한 검색어. 공백 제거 후 비어 있으면 무시한다. */
  function search(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setIsHistoryOpen(false);
    setIsPopOpen(false);
    onSearch({ query: trimmed });
  }

  const detailButtonRef = useRef<HTMLButtonElement>(null);

  function closePop() {
    setIsPopOpen(false);
    detailButtonRef.current?.focus();
  }

  function openPop() {
    setIsHistoryOpen(false);
    setIsPopOpen(true);
  }

  /** @param params 상세검색에서 제출한 query(검색어)와 target(검색 대상). */
  function searchDetail(params: BookSearchParams) {
    setQuery("");
    closePop();
    onSearch(params);
  }

  return {
    query,
    setQuery,
    isHistoryOpen,
    setIsHistoryOpen,
    isPopOpen,
    detailButtonRef,
    closePop,
    search,
    openPop,
    searchDetail,
  };
}
