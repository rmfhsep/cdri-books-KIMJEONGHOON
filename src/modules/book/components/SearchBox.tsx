import { Button } from "@/shared/components/button/Button";
import { TextField } from "@/shared/components/input/TextField";
import { IconSearch } from "@/shared/components/icons/IconSearch";
import { Pop } from "@/modules/book/components/Pop";
import { SearchHistory } from "@/modules/book/components/SearchHistory";
import { useSearchBox } from "@/modules/book/hooks/useSearchBox";
import type { BookSearchParams } from "@/modules/book/types/book";

interface SearchBoxProps {
  history: string[];
  onRemoveHistory: (query: string) => void;
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 일반검색과 검색기록, 상세검색 팝업을 조합한다.
 * @param props.history 표시할 검색기록. 저장과 정렬은 부모가 담당한다.
 * @param props.onRemoveHistory 삭제할 검색어를 전달한다.
 * @param props.onSearch 일반검색은 query만, 상세검색은 target도 전달한다.
 */
export function SearchBox({
  history,
  onRemoveHistory,
  onSearch,
}: SearchBoxProps) {
  const {
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
  } = useSearchBox({ onSearch });
  return (
    <section aria-label="도서 검색" className="relative w-full max-w-[568px]">
      <h1 className="text-title2">도서 검색</h1>
      <div className="relative mt-[29px] flex items-start gap-4">
        <div
          className="relative min-w-0 flex-1"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setIsHistoryOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsHistoryOpen(false);
          }}
        >
          {isHistoryOpen && (
            <SearchHistory
              history={history}
              onSelect={search}
              onRemove={onRemoveHistory}
            />
          )}
          <form
            className="relative z-20"
            onSubmit={(event) => {
              event.preventDefault();
              search(query);
            }}
          >
            <TextField
              label="검색어"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsHistoryOpen(true)}
              onClick={() => setIsHistoryOpen(true)}
              placeholder="검색어를 입력하세요"
              leadingIcon={<IconSearch />}
            />
          </form>
        </div>
        <Button
          ref={detailButtonRef}
          color="secondary"
          variant="outline"
          size="sm"
          onClick={openPop}
          aria-expanded={isPopOpen}
          aria-haspopup="dialog"
          className="mt-[8.82px]"
        >
          상세검색
        </Button>
      </div>
      {isPopOpen && <Pop onClose={closePop} onSearch={searchDetail} />}
    </section>
  );
}
