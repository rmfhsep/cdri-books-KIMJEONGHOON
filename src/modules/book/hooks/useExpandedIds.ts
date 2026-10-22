import { useState } from "react";
import { readStorage, writeStorage } from "@/shared/utils/storage";
import type { Book } from "@/modules/book/types/book";

interface UseExpandedIdsParams {
  storageKey: string;
  onExpand: (book: Book) => void;
}

/**
 * 상세보기를 펼친 도서 ID 목록을 관리하고 저장한다.
 * @param params.storageKey 탭마다 다른 저장 키.
 * @param params.onExpand 도서를 펼칠 때 호출한다. 최근 본 책 저장에 사용한다.
 * @returns 펼친 ID 목록, 펼침 전환·초기화 함수.
 * @example
 * const { expandedIds, toggleExpanded } = useExpandedIds({ storageKey, onExpand });
 */
export const useExpandedIds = ({
  storageKey,
  onExpand,
}: UseExpandedIdsParams) => {
  const [expandedIds, setExpandedIds] = useState(() =>
    readStorage<string[]>(storageKey, []),
  );

  const save = (next: string[]) => {
    setExpandedIds(next);
    writeStorage(storageKey, next);
  };

  /** @param book 펼치거나 접을 도서. */
  const toggleExpanded = (book: Book) => {
    if (expandedIds.includes(book.id)) {
      save(expandedIds.filter((id) => id !== book.id));
    } else {
      save([...expandedIds, book.id]);
      onExpand(book);
    }
  };

  return { expandedIds, toggleExpanded, resetExpanded: () => save([]) };
};
