import type { ChangeEvent, FocusEvent, FormEvent, KeyboardEvent } from "react";
import { Button } from "@/shared/components/button/Button";
import { TextField } from "@/shared/components/input/TextField";
import { IconSearch } from "@/shared/components/icons/IconSearch";
import { Pop } from "@/modules/book/components/search/Pop";
import { SearchHistory } from "@/modules/book/components/search/SearchHistory";
import { useSearchBox } from "@/modules/book/hooks/useSearchBox";
import type {
  BookSearchParams,
  SearchHistoryItem,
} from "@/modules/book/types/book";

interface SearchBoxProps {
  history: SearchHistoryItem[];
  onRemoveHistory: (item: SearchHistoryItem) => void;
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 일반검색과 검색기록, 상세검색 팝업을 조합한다.
 * @param props.history 표시할 검색기록. 저장과 정렬은 부모가 담당한다.
 * @param props.onRemoveHistory 삭제할 검색 기록을 전달한다.
 * @param props.onSearch 일반검색은 query만, 상세검색은 target도 전달한다.
 */
export const SearchBox = ({
  history,
  onRemoveHistory,
  onSearch,
}: SearchBoxProps) => {
  const {
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
  } = useSearchBox({ onSearch });

  // 검색창과 검색기록 밖으로 포커스가 나가면 검색기록을 닫는다.
  const handleHistoryBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node))
      setIsHistoryOpen(false);
  };

  const handleHistoryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") setIsHistoryOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search(query);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleHistoryOpen = () => {
    setIsHistoryOpen(true);
  };

  return (
    <section className="relative w-full max-w-142">
      <div className="relative flex items-start gap-4">
        <div
          className="relative min-w-0 flex-1"
          onBlur={handleHistoryBlur}
          onKeyDown={handleHistoryKeyDown}
        >
          <form className="relative z-20" onSubmit={handleSubmit}>
            <TextField
              value={query}
              onChange={handleQueryChange}
              onFocus={handleHistoryOpen}
              onClick={handleHistoryOpen}
              placeholder="검색어를 입력하세요"
              leadingIcon={<IconSearch />}
            />
          </form>
          {isHistoryOpen && (
            <SearchHistory
              history={history}
              onSelect={selectHistory}
              onRemove={onRemoveHistory}
            />
          )}
        </div>
        <Button
          ref={detailButtonRef}
          color="secondary"
          variant="outline"
          size="sm"
          onClick={openPop}
          className="mt-[8.82px]"
        >
          상세검색
        </Button>
      </div>
      {isPopOpen && (
        <Pop
          initialQuery={detailQuery}
          onClose={closePop}
          onSearch={searchDetail}
        />
      )}
    </section>
  );
};
