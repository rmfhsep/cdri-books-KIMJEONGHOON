import { useRef, useState } from "react";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";
import { BookSearchTarget } from "@/modules/book/types/book";
import type {
  BookSearchParams,
  SearchHistoryItem,
} from "@/modules/book/types/book";

interface UseSearchBoxParams {
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 검색어와 검색기록·상세검색 팝업의 표시 상태를 관리한다.
 * @param params.onSearch 검색 실행 콜백. query와 상세검색 시 선택한 target을 전달한다.
 * @returns 검색 상태와 상태 변경 함수, 일반검색·검색기록 선택·상세검색·팝업 열기 액션.
 * @example
 * const { query, setQuery, search, openPop } = useSearchBox({ onSearch });
 * // 입력 변경 시 setQuery(value), 폼 제출 시 search(query)를 호출한다.
 * // 상세검색 버튼에는 openPop을 연결한다.
 */
export const useSearchBox = ({ onSearch }: UseSearchBoxParams) => {
  const [query, updateQuery] = useState(() =>
    readStorage(STORAGE_KEYS.searchInput, ""),
  );
  /** @param value 검색창에 표시하고 재시작 후 복원할 입력값. */
  const setQuery = (value: string) => {
    updateQuery(value);
    writeStorage(STORAGE_KEYS.searchInput, value);
  };
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  // 팝업을 다시 열 때 직전 상세검색어를 보여주기 위해 보관한다. 새로고침 시에는 비운다.
  const [detailQuery, setDetailQuery] = useState("");

  /** @param value 입력 또는 검색기록에서 선택한 검색어. 공백 제거 후 비어 있으면 무시한다. */
  const search = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setIsHistoryOpen(false);
    setIsPopOpen(false);
    onSearch({ query: trimmed });
  };

  const detailButtonRef = useRef<HTMLButtonElement>(null);

  const closePop = () => {
    setIsPopOpen(false);
    detailButtonRef.current?.focus();
  };

  const openPop = () => {
    setIsHistoryOpen(false);
    setIsPopOpen(true);
  };

  /** @param next 상세검색에서 제출한 query(검색어)와 target(검색 대상). */
  const searchDetail = (next: BookSearchParams) => {
    setDetailQuery(next.query);
    setQuery("");
    closePop();
    onSearch(next);
  };

  /** @param item 선택한 검색 기록. target이 있으면 상세검색과 같이 검색창을 비우고 검색한다. */
  const selectHistory = (item: SearchHistoryItem) => {
    if (!item.target) return search(item.query);
    // ISBN 기록은 최근 본 책 재검색이므로 상세검색 팝업의 값으로 남기지 않는다.
    if (item.target !== BookSearchTarget.Isbn) {
      setDetailQuery(item.query);
      writeStorage(STORAGE_KEYS.detailTarget, item.target);
    }
    setQuery("");
    setIsHistoryOpen(false);
    onSearch(item);
  };

  return {
    query,
    setQuery,
    isHistoryOpen,
    setIsHistoryOpen,
    isPopOpen,
    detailQuery,
    detailButtonRef,
    closePop,
    search,
    selectHistory,
    openPop,
    searchDetail,
  };
};
