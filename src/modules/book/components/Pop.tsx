import { Button } from "@/shared/components/button/Button";
import { IconButton } from "@/shared/components/button/IconButton";
import { IconChevron } from "@/shared/components/icons/IconChevron";
import { IconClose } from "@/shared/components/icons/IconClose";
import { usePop } from "@/modules/book/hooks/usePop";
import { BookSearchTarget } from "@/modules/book/types/book";
import type { BookSearchParams } from "@/modules/book/types/book";

interface PopProps {
  onClose: () => void;
  onSearch: (params: BookSearchParams) => void;
}

const filters = [
  { label: "제목", value: BookSearchTarget.Title },
  { label: "저자명", value: BookSearchTarget.Person },
  { label: "출판사", value: BookSearchTarget.Publisher },
] as const;

/**
 * 검색 대상과 검색어를 입력받는 상세검색 팝업.
 * @param props.onSearch 비어 있지 않은 검색어와 선택한 검색 대상을 전달한다.
 * @param props.onClose 닫기·Escape·외부로의 포커스 이동 시 호출한다.
 */
export function Pop({ onClose, onSearch }: PopProps) {
  const {
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
  } = usePop({ onSearch });

  return (
    <div
      role="dialog"
      aria-label="상세검색"
      className="search-pop absolute top-[calc(100%+8px)] right-0 z-30 h-40 w-[360px] max-w-full rounded-control bg-palette-white shadow-[0_4px_14px_rgba(151,151,151,0.15)]"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          if (isFilterOpen) {
            closeFilter();
          } else onClose();
        }
      }}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget as Node)
        )
          onClose();
      }}
    >
      <IconButton
        aria-label="상세검색 닫기"
        onClick={onClose}
        className="absolute top-2 right-2 text-ui-gray"
      >
        <IconClose />
      </IconButton>
      <form
        className="px-6 pt-9"
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
      >
        <div className="flex gap-1">
          <div className="relative w-[100px] shrink-0">
            <button
              ref={filterRef}
              type="button"
              aria-expanded={isFilterOpen}
              aria-controls={filterId}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex h-9 w-full cursor-pointer items-center justify-between border-b border-ui-border px-2 text-body2Bold leading-[22px]"
            >
              {filters.find((filter) => filter.value === target)?.label}
              <IconChevron size={10} />
            </button>
            {isFilterOpen && (
              <ul
                id={filterId}
                aria-label="검색 기준"
                className="absolute top-[42px] z-10 w-full bg-palette-white shadow-[0_0_4px_rgba(0,0,0,0.25)]"
              >
                {filters
                  .filter((filter) => filter.value !== target)
                  .map((filter) => (
                    <li key={filter.value}>
                      <button
                        type="button"
                        onClick={() => {
                          selectFilter(filter.value);
                        }}
                        className="h-[30px] w-full cursor-pointer px-2 text-left text-body2 leading-[22px] text-text-subtitle"
                      >
                        {filter.label}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <input
            ref={inputRef}
            aria-label="상세검색 검색어"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색어 입력"
            className="h-9 min-w-0 flex-1 border-b border-palette-primary px-[9.45px] text-body2 leading-[22px] placeholder:text-text-subtitle"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          className="mt-4 w-full"
          style={{ height: 36, lineHeight: "22px" }}
        >
          검색하기
        </Button>
      </form>
    </div>
  );
}
