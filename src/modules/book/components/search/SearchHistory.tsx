import { IconButton } from "@/shared/components/button/IconButton";
import { IconClose } from "@/shared/components/icons/IconClose";
import { SEARCH_TARGETS } from "@/modules/book/constants/searchTargets";
import type { SearchHistoryItem } from "@/modules/book/types/book";

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onRemove: (item: SearchHistoryItem) => void;
}

/**
 * 검색기록 선택과 개별 삭제를 제공한다.
 * @param props.history 중복 없는 검색 기록. 상세검색 기록은 검색 대상을 함께 표시한다. 빈 배열이면 표시하지 않는다.
 * @param props.onSelect 선택한 검색어와 검색 대상을 전달한다.
 * @param props.onRemove 삭제할 검색 기록을 전달한다.
 */
export const SearchHistory = ({
  history,
  onSelect,
  onRemove,
}: SearchHistoryProps) => {
  if (history.length === 0) return null;
  return (
    <ul className="absolute top-0 right-0 left-0 z-10 rounded-3xl bg-palette-lightGray pt-14.25 pb-4">
      {history.map((item) => {
        const label = SEARCH_TARGETS.find(
          (target) => target.value === item.target,
        )?.label;
        const query = item.label ?? item.query;
        const text = label ? `${label}: ${query}` : query;
        return (
          <li
            key={`${item.target ?? ""}:${item.query}`}
            className="flex h-10 items-center gap-4 pr-6.25 pl-12.75 text-caption text-text-subtitle"
          >
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="min-w-0 flex-1 cursor-pointer truncate text-left"
            >
              {text}
            </button>
            <IconButton
              aria-label={`${text} 검색기록 삭제`}
              onClick={() => onRemove(item)}
            >
              <IconClose size={24} className="text-palette-black" />
            </IconButton>
          </li>
        );
      })}
    </ul>
  );
};
