import { IconButton } from "@/shared/components/button/IconButton";
import { IconClose } from "@/shared/components/icons/IconClose";

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
}

/**
 * 검색기록 선택과 개별 삭제를 제공한다.
 * @param props.history 중복 없는 검색어 목록. 빈 배열이면 표시하지 않는다.
 * @param props.onSelect 선택한 검색어를 전달한다.
 * @param props.onRemove 삭제할 검색어를 전달한다.
 */
export function SearchHistory({
  history,
  onSelect,
  onRemove,
}: SearchHistoryProps) {
  if (history.length === 0) return null;
  return (
    <ul
      aria-label="검색기록"
      className="absolute top-0 right-0 left-0 z-10 rounded-[24px] bg-palette-lightGray pt-[57px] pb-4"
    >
      {history.map((query) => (
        <li
          key={query}
          className="flex h-10 items-center gap-4 pr-[25px] pl-[51px] text-caption text-text-subtitle"
        >
          <button
            type="button"
            onClick={() => onSelect(query)}
            className="min-w-0 flex-1 cursor-pointer truncate text-left"
          >
            {query}
          </button>
          <IconButton
            aria-label={`${query} 검색기록 삭제`}
            onClick={() => onRemove(query)}
          >
            <IconClose size={24} className="text-palette-black" />
          </IconButton>
        </li>
      ))}
    </ul>
  );
}
