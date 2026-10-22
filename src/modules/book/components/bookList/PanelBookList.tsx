import { BookList } from "@/modules/book/components/bookList/BookList";
import type { Book } from "@/modules/book/types/book";

/** 검색·찜 패널이 공통으로 가진 목록 데이터. */
interface ListPanel {
  books: Book[];
  scroll: { initialIndex: number; saveIndex: (index: number) => void };
  scrollParent: HTMLElement | null;
  firstItemIndex: number;
  expandedIds: string[];
  hasPrevious: boolean;
  hasMore: boolean;
  loadPrevious: () => void;
  loadMore: () => void;
  toggleExpanded: (book: Book) => void;
}

interface PanelBookListProps {
  panel: ListPanel;
  active: boolean;
  likedIds: Set<string>;
  loadingMore?: boolean;
  showEndMessage?: boolean;
  onLike: (book: Book) => void;
}

/** 패널 데이터를 가상 목록에 연결한다. 스크롤 영역이 준비된 뒤에 그린다. */
export const PanelBookList = ({
  panel,
  active,
  likedIds,
  loadingMore = false,
  showEndMessage = false,
  onLike,
}: PanelBookListProps) => {
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
      onTopIndexChange={panel.scroll.saveIndex}
      onLike={onLike}
      onToggleExpanded={panel.toggleExpanded}
    />
  );
};
