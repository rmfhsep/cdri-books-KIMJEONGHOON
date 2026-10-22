import { Button } from "@/shared/components/button/Button";
import { IconChevron } from "@/shared/components/icons/IconChevron";
import { BookImageFrame } from "@/modules/book/components/BookImageFrame";
import type { Book } from "@/modules/book/types/book";
import { formatPrice } from "@/modules/book/utils/formatPrice";

interface BookListItemProps {
  book: Book;
  isLiked: boolean;
  onLike: () => void;
  onExpand: () => void;
}

/**
 * 접힌 도서 목록 항목. 구매 링크와 상세보기 동작을 제공한다.
 * @param props.onExpand 상세보기 요청을 부모에 전달한다.
 */
export function BookListItem({
  book,
  isLiked,
  onLike,
  onExpand,
}: BookListItemProps) {
  return (
    <div className="flex w-full max-w-[960px] flex-wrap items-center gap-4 border-b border-ui-border p-4 lg:h-[100px] lg:flex-nowrap lg:gap-0 lg:py-4 lg:pl-12 lg:pr-4">
      <BookImageFrame
        thumbnail={book.thumbnail}
        title={book.title}
        isLiked={isLiked}
        onLike={onLike}
      />
      <div className="flex min-w-0 w-[calc(100%-64px)] flex-col gap-4 lg:ml-12 lg:w-[408px] lg:shrink-0 lg:flex-row lg:items-center">
        <h2
          className="min-w-0 text-title3 break-words lg:truncate"
          title={book.title}
        >
          {book.title}
        </h2>
        <p className="min-w-0 max-w-full text-body2 break-words text-text-subtitle lg:max-w-[160px] lg:shrink-0 lg:truncate">
          {book.author}
        </p>
      </div>
      <p className="ml-16 w-[calc(100%-64px)] text-title3 lg:ml-[22px] lg:w-[76px] lg:shrink-0 lg:text-right">
        {formatPrice(book.salePrice ?? book.price)}
      </p>
      <div className="flex w-full gap-2 lg:ml-14 lg:w-auto lg:shrink-0">
        <a
          href={book.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-control bg-palette-primary px-5 text-caption text-palette-white lg:w-[115px] lg:flex-none"
        >
          구매하기
        </a>
        <Button
          color="secondary"
          style={{ paddingLeft: 20, paddingRight: 17, gap: 5 }}
          aria-expanded={false}
          onClick={onExpand}
          className="flex-1 lg:w-[115px] lg:flex-none"
        >
          상세보기
          <IconChevron />
        </Button>
      </div>
    </div>
  );
}
