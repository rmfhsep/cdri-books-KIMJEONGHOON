import { useEffect, useRef, useState } from "react";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";
import { BookSearchTarget } from "@/modules/book/types/book";
import type { BookSearchParams } from "@/modules/book/types/book";

interface UsePopParams {
  initialQuery: string;
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 상세검색의 검색 조건, 입력값, 필터 메뉴를 관리한다. 선택한 검색 대상은 저장해 다음에 팝업을 열 때 복원한다.
 * @param params.initialQuery 입력창의 초기값. 직전 상세검색어를 전달한다.
 * @param params.onSearch 검색 실행 콜백. 앞뒤 공백을 제거한 query와 target을 전달한다.
 * @returns 검색 상태와 액션, 입력창·필터 버튼에 연결할 ref.
 * @example
 * const { query, setQuery, inputRef, search } = usePop({ initialQuery, onSearch });
 * // input에 ref={inputRef}, value={query}, onChange에서 setQuery를 연결한다.
 * // 폼 제출 시 search()를 호출한다. 빈 검색어는 무시한다.
 */
export const usePop = ({ initialQuery, onSearch }: UsePopParams) => {
  const [target, setTarget] = useState(() =>
    readStorage(STORAGE_KEYS.detailTarget, BookSearchTarget.Title),
  );
  const [query, setQuery] = useState(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);

  /** @param value 검색 대상: title(제목), person(저자), publisher(출판사). */
  const selectFilter = (value: BookSearchTarget) => {
    setTarget(value);
    writeStorage(STORAGE_KEYS.detailTarget, value);
    setIsFilterOpen(false);
    inputRef.current?.focus();
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
    filterRef.current?.focus();
  };

  const search = () => {
    if (query.trim()) onSearch({ query: query.trim(), target });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return {
    target,
    query,
    setQuery,
    isFilterOpen,
    setIsFilterOpen,
    inputRef,
    filterRef,
    selectFilter,
    closeFilter,
    search,
  };
};
