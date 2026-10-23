import type { ListRange } from "react-virtuoso";
import { BookList } from "@/modules/book/components/bookList/BookList";
import type { Book } from "@/modules/book/types/book";

/** 검색·찜 패널이 목록에 넘기는 데이터. 앞뒤 페이지 요청은 검색 패널만 사용한다. */
interface ListPanel {
  books: Book[];
  scroll: { initialIndex: number; saveIndex: (index: number) => void };
  scrollParent: HTMLElement | null;
  expandedIds: string[];
  toggleExpanded: (book: Book) => void;
  firstItemIndex?: number;
  hasPrevious?: boolean;
  hasMore?: boolean;
  loadPrevious?: () => void;
  loadMore?: () => void;
  setVisibleRange?: (range: ListRange) => void;
}

interface PanelBookListProps {
  panel: ListPanel;
  active: boolean;
  likedIds: Set<string>;
  loadingMore?: boolean;
  showEndMessage?: boolean;
  onLike: (book: Book) => void;
}

/**
 * 패널 데이터를 가상 목록에 연결한다. 스크롤 영역이 준비된 뒤에 그린다.
 * @param props.panel 검색 또는 찜 패널. 보이는 범위가 바뀌면 맨 위 항목을 저장하고, 찜 패널에는 범위도 전달한다.
 */
export const PanelBookList = ({
  panel,
  active,
  likedIds,
  loadingMore,
  showEndMessage,
  onLike,
}: PanelBookListProps) => {
  const handleRangeChange = (range: ListRange) => {
    panel.scroll.saveIndex(range.startIndex);
    panel.setVisibleRange?.(range);
  };

  if (!panel.scrollParent) return null;
  return (
    <BookList
      active={active}
      books={panel.books}
      scrollParent={panel.scrollParent}
      firstItemIndex={panel.firstItemIndex}
      initialIndex={panel.scroll.initialIndex}
      likedIds={likedIds}
      expandedIds={panel.expandedIds}
      hasPrevious={panel.hasPrevious}
      hasMore={panel.hasMore}
      loading={loadingMore}
      showEndMessage={showEndMessage}
      onLoadPrevious={panel.loadPrevious}
      onLoadMore={panel.loadMore}
      onRangeChange={handleRangeChange}
      onLike={onLike}
      onToggleExpanded={panel.toggleExpanded}
    />
  );
};
