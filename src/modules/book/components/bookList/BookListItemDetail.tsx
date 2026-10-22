import { Button } from "@/shared/components/button/Button";
import { IconChevron } from "@/shared/components/icons/IconChevron";
import { BookImageFrame } from "@/modules/book/components/bookList/BookImageFrame";
import type { Book } from "@/modules/book/types/book";
import { formatPrice } from "@/modules/book/utils/formatPrice";

interface BookListItemDetailProps {
  book: Book;
  isLiked: boolean;
  onLike: () => void;
  onCollapse: () => void;
}

/**
 * 도서 소개와 가격을 보여주는 펼쳐진 목록 항목.
 * @param props.onCollapse 목록 항목을 접도록 부모에 요청한다.
 */
export const BookListItemDetail = ({
  book,
  isLiked,
  onLike,
  onCollapse,
}: BookListItemDetailProps) => {
  return (
    <div className="relative flex w-full max-w-240 flex-col gap-6 border-b border-ui-border p-4 lg:block lg:min-h-86 lg:p-0">
      <div className="flex items-start justify-between gap-4 lg:absolute lg:top-11 lg:left-74 lg:w-90">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center">
          <h2 className="min-w-0 text-title3 wrap-break-word lg:truncate">
            {book.title}
          </h2>
          <p className="min-w-0 max-w-full text-body2 wrap-break-word text-text-subtitle lg:max-w-40 lg:shrink-0 lg:truncate">
            {book.author}
          </p>
        </div>
        <div className="lg:hidden">
          <Button
            color="secondary"
            onClick={onCollapse}
            className="gap-1.25 pr-4.25 pl-5"
          >
            상세보기
            <IconChevron direction="up" />
          </Button>
        </div>
      </div>
      <div className="self-center lg:absolute lg:top-6 lg:left-13.5">
        <BookImageFrame
          thumbnail={book.thumbnail}
          title={book.title}
          isLiked={isLiked}
          onLike={onLike}
          size="lg"
        />
      </div>
      <section className="min-w-0 lg:ml-74 lg:w-90 lg:pt-21.5 lg:pb-10">
        <h3 className="text-body2Bold leading-6.5">책 소개</h3>
        <p className="mt-3 whitespace-pre-line text-small leading-4 wrap-break-word">
          {book.contents}
        </p>
      </section>
      <div className="hidden lg:absolute lg:top-[25.5px] lg:right-4 lg:block">
        <Button
          color="secondary"
          onClick={onCollapse}
          className="w-28.75 gap-1.25 pr-4.25 pl-5"
        >
          상세보기
          <IconChevron direction="up" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 lg:absolute lg:top-42 lg:right-5">
        <p className="flex items-center justify-end gap-2 leading-6.5">
          <span className="text-small text-text-subtitle">원가</span>
          <span
            className={`text-caption leading-6.5 ${book.salePrice !== undefined ? "line-through" : ""}`}
          >
            {formatPrice(book.price)}
          </span>
        </p>
        {book.salePrice !== undefined && (
          <p className="flex items-center justify-end gap-2 leading-6.5">
            <span className="text-small text-text-subtitle">할인가</span>
            <span className="text-title3 leading-6.5">
              {formatPrice(book.salePrice)}
            </span>
          </p>
        )}
      </div>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!book.url) {
            e.preventDefault();
            alert("판매가 종료된 도서입니다.");
          }
        }}
        className="inline-flex h-12 items-center justify-center rounded-control bg-palette-primary px-5 text-caption text-palette-white lg:absolute lg:top-64 lg:right-4 lg:w-60"
      >
        구매하기
      </a>
    </div>
  );
};
