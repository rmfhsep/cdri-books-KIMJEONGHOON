import { BookTab } from "@/modules/book/types/book";

interface HeaderProps {
  activeTab: BookTab;
  onTabChange: (tab: BookTab) => void;
}

/**
 * 도서 검색·찜한 책 메뉴를 표시하는 헤더.
 * @param props.onTabChange 메뉴 선택을 알린다. 로고를 누르면 search를 전달한다.
 */
export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-palette-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-6 lg:h-20 lg:flex-row lg:items-center lg:gap-[400px] lg:px-0 lg:py-0 max-[1631px]:lg:px-4">
        <button
          type="button"
          onClick={() => onTabChange(BookTab.Search)}
          className="w-fit shrink-0 cursor-pointer text-title1"
        >
          CERTICOS BOOKS
        </button>
        <nav aria-label="주 메뉴" className="flex gap-14 text-body1">
          <button
            type="button"
            onClick={() => onTabChange(BookTab.Search)}
            aria-current={activeTab === BookTab.Search ? "page" : undefined}
            className="h-8 cursor-pointer whitespace-nowrap pb-2"
            style={{
              boxShadow:
                activeTab === BookTab.Search
                  ? "inset 0 -1px 0 var(--color-palette-primary)"
                  : undefined,
            }}
          >
            도서 검색
          </button>
          <button
            type="button"
            onClick={() => onTabChange(BookTab.Favorites)}
            aria-current={activeTab === BookTab.Favorites ? "page" : undefined}
            className="h-8 cursor-pointer whitespace-nowrap pb-2"
            style={{
              boxShadow:
                activeTab === BookTab.Favorites
                  ? "inset 0 -1px 0 var(--color-palette-primary)"
                  : undefined,
            }}
          >
            내가 찜한 책
          </button>
        </nav>
      </div>
    </header>
  );
}
