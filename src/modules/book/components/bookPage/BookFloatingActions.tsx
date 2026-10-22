import type { SyntheticEvent } from "react";
import { IconChevron } from "@/shared/components/icons/IconChevron";
import bookPlaceholder from "@/shared/assets/icon_book.png";
import { useScrollToTop } from "@/modules/book/hooks/useScrollToTop";
import type { Book } from "@/modules/book/types/book";

interface BookFloatingActionsProps {
  recentBook: Book | null;
  scrollParent: HTMLElement | null;
  onSearchRecentBook: () => void;
}

/**
 * 최근 본 도서와 본문 맨 위 이동 버튼을 오른쪽 아래에 표시한다.
 * @param props.recentBook 마지막으로 상세 정보를 펼친 도서. 없으면 표지 버튼을 숨긴다.
 * @param props.scrollParent 가상 목록과 동일한 본문 스크롤 영역.
 * @param props.onSearchRecentBook 최근 본 도서의 재검색을 요청한다.
 */
export const BookFloatingActions = ({
  recentBook,
  scrollParent,
  onSearchRecentBook,
}: BookFloatingActionsProps) => {
  const { visible, scrollToTop } = useScrollToTop(scrollParent);

  // 표지를 불러오지 못하면 기본 이미지로 바꾼다. 기본 이미지도 실패하면 다시 바꾸지 않는다.
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = bookPlaceholder;
  };

  return (
    <aside className="fixed right-4 bottom-9 z-30 flex w-12 flex-col items-center gap-3 min-[1200px]:right-[calc((100%-960px)/2-88px)]">
      {recentBook && (
        <button
          type="button"
          title={`최근 본 책: ${recentBook.title}`}
          onClick={onSearchRecentBook}
          className="flex w-12 cursor-pointer flex-col items-center gap-2 rounded-control border border-ui-border bg-palette-white p-1.5 shadow-md transition-shadow hover:shadow-lg"
        >
          <img
            src={recentBook.thumbnail || bookPlaceholder}
            alt=""
            className="h-12 w-full object-contain"
            onError={handleImageError}
          />
          <span className="whitespace-nowrap text-small text-text-secondary">
            최근 본 책
          </span>
        </button>
      )}
      {visible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="flex size-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-ui-border bg-palette-white shadow-md transition-shadow hover:shadow-lg"
        >
          <IconChevron size={12} direction="up" />
          <span className="text-small">TOP</span>
        </button>
      )}
    </aside>
  );
};
