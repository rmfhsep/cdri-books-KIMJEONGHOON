import { Button } from "@/shared/components/button/Button";
import { IconChevron } from "@/shared/components/icons/IconChevron";
import { BookImageFrame } from "@/modules/book/components/BookImageFrame";
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
export function BookListItemDetail({
  book,
  isLiked,
  onLike,
  onCollapse,
}: BookListItemDetailProps) {
  return (
    <div className="relative flex w-full max-w-[960px] flex-col gap-6 border-b border-ui-border p-4 lg:block lg:min-h-[344px] lg:p-0">
      <div className="flex items-start justify-between gap-4 lg:absolute lg:top-11 lg:left-[296px] lg:w-[360px]">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center">
          <h2 className="min-w-0 text-title3 break-words lg:truncate">
            {book.title}
          </h2>
          <p className="min-w-0 max-w-full text-body2 break-words text-text-subtitle lg:max-w-[160px] lg:shrink-0 lg:truncate">
            {book.author}
          </p>
        </div>
        <div className="lg:hidden">
          <Button
            color="secondary"
            style={{ paddingLeft: 20, paddingRight: 17, gap: 5 }}
            aria-expanded={true}
            onClick={onCollapse}
          >
            상세보기
            <IconChevron direction="up" />
          </Button>
        </div>
      </div>
      <div className="self-center lg:absolute lg:top-6 lg:left-[54px]">
        <BookImageFrame
          thumbnail={book.thumbnail}
          title={book.title}
          isLiked={isLiked}
          onLike={onLike}
          size="lg"
        />
      </div>
      <section className="min-w-0 lg:ml-[296px] lg:w-[360px] lg:pt-[86px] lg:pb-10">
        <h3 className="text-body2Bold leading-[26px]">책 소개</h3>
        <p className="mt-3 whitespace-pre-line text-small leading-4 break-words">
          {book.contents}
        </p>
      </section>
      <div className="hidden lg:absolute lg:top-[25.5px] lg:right-4 lg:block">
        <Button
          color="secondary"
          style={{ paddingLeft: 20, paddingRight: 17, gap: 5 }}
          aria-expanded={true}
          onClick={onCollapse}
          className="w-[115px]"
        >
          상세보기
          <IconChevron direction="up" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 lg:absolute lg:top-[168px] lg:right-5">
        <p className="flex items-center justify-end gap-2 leading-[26px]">
          <span className="text-small text-text-subtitle">원가</span>
          <span
            className={`text-caption leading-[26px] ${book.salePrice !== undefined ? "line-through" : ""}`}
          >
            {formatPrice(book.price)}
          </span>
        </p>
        {book.salePrice !== undefined && (
          <p className="flex items-center justify-end gap-2 leading-[26px]">
            <span className="text-small text-text-subtitle">할인가</span>
            <span className="text-title3 leading-[26px]">
              {formatPrice(book.salePrice)}
            </span>
          </p>
        )}
      </div>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center justify-center rounded-control bg-palette-primary px-5 text-caption text-palette-white lg:absolute lg:top-64 lg:right-4 lg:w-60"
      >
        구매하기
      </a>
    </div>
  );
}
