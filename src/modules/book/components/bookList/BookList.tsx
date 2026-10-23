import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import type { ListRange } from "react-virtuoso";
import { BookListSkeleton } from "@/modules/book/components/bookList/BookListSkeleton";
import { BookListItem } from "@/modules/book/components/bookList/BookListItem";
import { BookListItemDetail } from "@/modules/book/components/bookList/BookListItemDetail";
import type { Book } from "@/modules/book/types/book";

interface BookListProps {
  books: Book[];
  active: boolean;
  firstItemIndex?: number;
  initialIndex: number;
  scrollParent: HTMLElement;
  likedIds: Set<string>;
  expandedIds: string[];
  hasPrevious?: boolean;
  hasMore?: boolean;
  loading?: boolean;
  showEndMessage?: boolean;
  onLoadPrevious?: () => void;
  onLoadMore?: () => void;
  onRangeChange: (range: ListRange) => void;
  onLike: (book: Book) => void;
  onToggleExpanded: (book: Book) => void;
}

/**
 * 검색 결과와 찜 목록을 가상화하여 표시한다.
 * @param props.firstItemIndex 첫 항목의 전체 목록 기준 index. 앞 페이지를 불러오면 10씩 줄어 보던 위치를 유지한다. 기본값 0.
 * @param props.initialIndex 처음 화면 맨 위에 둘 항목의 전체 목록 기준 index.
 * @param props.expandedIds 가상화로 제거된 항목도 펼침 상태를 복원할 수 있도록 부모에서 관리한다.
 * @param props.onLoadPrevious 보이는 범위가 처음 세 항목에 진입하면 이전 10개를 요청한다. 검색 결과에서만 사용한다.
 * @param props.onLoadMore 보이는 범위가 마지막 세 항목에 진입하면 다음 10개를 요청한다. 이전 요청이 우선이며 한 번에 한 방향만 요청한다.
 * @param props.onRangeChange 화면에 보이는 항목 범위(전체 목록 기준 index)를 알린다.
 */
export const BookList = ({
  books,
  active,
  firstItemIndex = 0,
  initialIndex,
  scrollParent,
  likedIds,
  expandedIds,
  hasPrevious = false,
  hasMore = false,
  loading = false,
  showEndMessage = false,
  onLoadPrevious,
  onLoadMore,
  onRangeChange,
  onLike,
  onToggleExpanded,
}: BookListProps) => {
  const [range, setRange] = useState<ListRange | null>(null);

  // 보이는 범위를 부모에 알리고, 앞뒤 페이지 요청에도 사용한다.
  const handleRangeChange = (next: ListRange) => {
    if (active) onRangeChange(next);
    setRange(next);
  };

  // 한 번에 한 방향만 요청하고, 목록이 바뀐 뒤 남은 방향을 다시 확인한다.
  useEffect(() => {
    if (!active || !range) return;
    if (hasPrevious && range.startIndex - firstItemIndex <= 2)
      onLoadPrevious?.();
    else if (hasMore && range.endIndex - firstItemIndex >= books.length - 3)
      onLoadMore?.();
  }, [
    active,
    range,
    books.length,
    firstItemIndex,
    hasPrevious,
    hasMore,
    onLoadPrevious,
    onLoadMore,
  ]);

  return (
    <Virtuoso
      customScrollParent={scrollParent}
      data={books}
      firstItemIndex={firstItemIndex}
      initialTopMostItemIndex={Math.min(
        Math.max(0, initialIndex - firstItemIndex),
        books.length - 1,
      )}
      context={{ loading, finished: showEndMessage && !hasMore && !loading }}
      components={{ Footer: BookListFooter }}
      rangeChanged={handleRangeChange}
      itemContent={(_, book) =>
        expandedIds.includes(book.id) ? (
          <BookListItemDetail
            book={book}
            isLiked={likedIds.has(book.id)}
            onLike={() => onLike(book)}
            onCollapse={() => onToggleExpanded(book)}
          />
        ) : (
          <BookListItem
            book={book}
            isLiked={likedIds.has(book.id)}
            onLike={() => onLike(book)}
            onExpand={() => onToggleExpanded(book)}
          />
        )
      }
    />
  );
};

const BookListFooter = ({
  context,
}: {
  context?: { loading: boolean; finished: boolean };
}) => {
  if (context?.loading) return <BookListSkeleton count={1} />;
  if (context?.finished)
    return (
      <p className="py-6 text-center text-body2 text-text-subtitle">
        검색 결과 마지막입니다.
      </p>
    );
  return null;
};
