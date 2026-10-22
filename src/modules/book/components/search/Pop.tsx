import type { ChangeEvent, FocusEvent, FormEvent, KeyboardEvent } from "react";
import { Button } from "@/shared/components/button/Button";
import { IconButton } from "@/shared/components/button/IconButton";
import { IconChevron } from "@/shared/components/icons/IconChevron";
import { IconClose } from "@/shared/components/icons/IconClose";
import { SEARCH_TARGETS } from "@/modules/book/constants/searchTargets";
import { usePop } from "@/modules/book/hooks/usePop";
import type { BookSearchParams } from "@/modules/book/types/book";

interface PopProps {
  initialQuery: string;
  onClose: () => void;
  onSearch: (params: BookSearchParams) => void;
}

/**
 * 검색 대상과 검색어를 입력받는 상세검색 팝업.
 * @param props.initialQuery 팝업을 열 때 입력창에 채울 직전 상세검색어.
 * @param props.onClose 닫기·Escape·외부로의 포커스 이동 시 호출한다.
 * @param props.onSearch 비어 있지 않은 검색어와 선택한 검색 대상을 전달한다.
 */
export const Pop = ({ initialQuery, onClose, onSearch }: PopProps) => {
  const {
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
  } = usePop({ initialQuery, onSearch });

  // Escape를 누르면 필터 메뉴가 열려 있으면 메뉴만, 아니면 팝업을 닫는다.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    if (isFilterOpen) closeFilter();
    else onClose();
  };

  // 팝업 밖으로 포커스가 나가면 팝업을 닫는다.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && !event.currentTarget.contains(next)) onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search();
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div
      className="search-pop absolute top-[calc(100%+8px)] right-0 z-30 h-40 w-90 max-w-full rounded-control bg-palette-white shadow-[0_4px_14px_rgba(151,151,151,0.15)]"
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <IconButton
        aria-label="상세검색 닫기"
        onClick={onClose}
        className="absolute top-2 right-2 text-ui-gray"
      >
        <IconClose />
      </IconButton>
      <form className="px-6 pt-9" onSubmit={handleSubmit}>
        <div className="flex gap-1">
          <div className="relative w-25 shrink-0">
            <button
              ref={filterRef}
              type="button"
              onClick={handleFilterToggle}
              className="flex h-9 w-full cursor-pointer items-center justify-between border-b border-ui-border px-2 text-body2Bold leading-5.5"
            >
              {SEARCH_TARGETS.find((filter) => filter.value === target)?.label}
              <IconChevron size={10} />
            </button>
            {isFilterOpen && (
              <ul className="absolute top-10.5 z-10 w-full bg-palette-white shadow-[0_0_4px_rgba(0,0,0,0.25)]">
                {SEARCH_TARGETS.filter((filter) => filter.value !== target).map(
                  (filter) => (
                    <li key={filter.value}>
                      <button
                        type="button"
                        onClick={() => selectFilter(filter.value)}
                        className="h-7.5 w-full cursor-pointer px-2 text-left text-body2 leading-5.5 text-text-subtitle"
                      >
                        {filter.label}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={handleQueryChange}
            placeholder="검색어 입력"
            className="h-9 min-w-0 flex-1 border-b border-palette-primary px-[9.45px] text-body2 leading-5.5 placeholder:text-text-subtitle"
          />
        </div>
        <Button type="submit" size="sm" className="mt-4 h-9 w-full leading-5.5">
          검색하기
        </Button>
      </form>
    </div>
  );
};
