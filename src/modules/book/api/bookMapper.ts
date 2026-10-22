import type { BookSearchResult } from "@/modules/book/types/book";
import type { BookSearchResponse } from "@/modules/book/types/bookApi";

/**
 * 카카오 응답을 도서 목록 UI에서 사용하는 모델로 변환한다.
 * @param response 서버의 documents와 페이지 메타 정보.
 * @returns 저자 배열과 가격, 식별자, 메타 정보를 가공한 검색 결과.
 * @example
 * const result = toBookSearchResult(response);
 */
export const toBookSearchResult = (
  response: BookSearchResponse,
): BookSearchResult => {
  return {
    books: response.documents.map((book) => {
      const isbns = book.isbn.trim().split(/\s+/);
      return {
        id: isbns.find((isbn) => isbn.length === 13) || isbns[0] || book.url,
        isbn: isbns.find((isbn) => isbn.length === 13) || isbns[0] || "",
        title: book.title,
        author: book.authors.join(", "),
        thumbnail: book.thumbnail,
        price: book.price ?? 0,
        salePrice:
          book.sale_price != null && book.sale_price >= 0
            ? book.sale_price
            : undefined,
        contents: book.contents ?? "",
        url: book.url ?? "",
      };
    }),
    totalCount: response.meta.total_count,
    pageableCount: response.meta.pageable_count,
    isEnd: response.meta.is_end,
  };
};
