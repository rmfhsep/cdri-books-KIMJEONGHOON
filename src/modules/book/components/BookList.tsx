import { Virtuoso } from "react-virtuoso";
import { BookListSkeleton } from "@/modules/book/components/BookListSkeleton";
import { BookListItem } from "@/modules/book/components/BookListItem";
import { BookListItemDetail } from "@/modules/book/components/BookListItemDetail";
import type { Book } from "@/modules/book/types/book";

interface BookListProps {
  books: Book[];
  scrollParent: HTMLElement;
  likedIds: Set<string>;
  expandedIds: string[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  onLike: (book: Book) => void;
  onToggleExpanded: (id: string) => void;
}

/**
 * 검색 결과와 찜 목록을 가상화하여 표시한다.
 * @param props.onLoadMore 보이는 범위가 마지막 세 항목에 진입하면 다음 10개를 요청한다.
 * @param props.expandedIds 가상화로 제거된 항목도 펼침 상태를 복원할 수 있도록 부모에서 관리한다.
 */
export function BookList({
  books,
  scrollParent,
  likedIds,
  expandedIds,
  hasMore,
  loading,
  onLoadMore,
  onLike,
  onToggleExpanded,
}: BookListProps) {
  return (
    <Virtuoso
      customScrollParent={scrollParent}
      data={books}
      context={{ loading, finished: !hasMore && !loading }}
      components={{ Footer: BookListFooter }}
      computeItemKey={(_, book) => book.id}
      rangeChanged={({ endIndex }) => {
        if (hasMore && endIndex >= books.length - 3) onLoadMore();
      }}
      itemContent={(_, book) =>
        expandedIds.includes(book.id) ? (
          <BookListItemDetail
            book={book}
            isLiked={likedIds.has(book.id)}
            onLike={() => onLike(book)}
            onCollapse={() => onToggleExpanded(book.id)}
          />
        ) : (
          <BookListItem
            book={book}
            isLiked={likedIds.has(book.id)}
            onLike={() => onLike(book)}
            onExpand={() => onToggleExpanded(book.id)}
          />
        )
      }
    />
  );
}

function BookListFooter({
  context,
}: {
  context?: { loading: boolean; finished: boolean };
}) {
  if (context?.loading) return <BookListSkeleton count={1} />;
  if (context?.finished)
    return (
      <p className="py-6 text-center text-body2 text-text-subtitle">
        검색 결과 마지막입니다.
      </p>
    );
  return null;
}
