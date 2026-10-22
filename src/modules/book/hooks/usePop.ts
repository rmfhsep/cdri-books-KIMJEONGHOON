import { useEffect, useId, useRef, useState } from "react";
import { BookSearchTarget } from "@/modules/book/types/book";
import type { BookSearchParams } from "@/modules/book/types/book";

interface UsePopProps {
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 상세검색의 검색 조건, 입력값, 필터 메뉴를 관리한다.
 * @param options.onSearch 검색 실행 콜백. 앞뒤 공백을 제거한 query와 target을 전달한다.
 * @returns 검색 상태와 액션, 입력창·필터 버튼에 연결할 ref, 필터 목록의 id.
 * @example
 * const { query, setQuery, inputRef, search } = usePop({ onSearch });
 * // input에 ref={inputRef}, value={query}, onChange에서 setQuery를 연결한다.
 * // 폼 제출 시 search()를 호출한다. 빈 검색어는 무시한다.
 */
export function usePop({ onSearch }: UsePopProps) {
  const [target, setTarget] = useState<BookSearchTarget>(
    BookSearchTarget.Title,
  );
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const filterId = useId();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /** @param value 검색 대상: title(제목), person(저자), publisher(출판사). */
  function selectFilter(value: BookSearchTarget) {
    setTarget(value);
    setIsFilterOpen(false);
    inputRef.current?.focus();
  }

  function closeFilter() {
    setIsFilterOpen(false);
    filterRef.current?.focus();
  }

  function search() {
    if (query.trim()) onSearch({ query: query.trim(), target });
  }

  return {
    target,
    query,
    setQuery,
    isFilterOpen,
    setIsFilterOpen,
    inputRef,
    filterRef,
    filterId,
    selectFilter,
    closeFilter,
    search,
  };
}
