import { useQueries } from "@tanstack/react-query";
import { bookApi } from "@/modules/book/api/bookApi";
import { BookSearchTarget } from "@/modules/book/types/book";
import type { Book } from "@/modules/book/types/book";

/**
 * 현재 표시할 찜한 책을 ISBN으로 조회한다. 실패해도 저장된 도서 데이터는 유지한다.
 * @param favorites 화면에 표시할 저장 도서 목록.
 * @param enabled 찜 목록 화면에서만 최신 정보를 요청하도록 제어한다.
 * @returns 도서별 최신 데이터와 조회 상태. 조회 성공한 책만 저장 정보 갱신에 사용한다.
 * @example
 * const queries = useSavedBooksQuery(visibleFavorites, isFavorites);
 */
export const useSavedBooksQuery = (favorites: Book[], enabled: boolean) => {
  return useQueries({
    queries: favorites.map((book) => ({
      queryKey: ["books", "isbn", book.isbn],
      queryFn: async () => {
        const result = await bookApi.searchBooks({
          query: book.isbn,
          target: BookSearchTarget.Isbn,
        });
        return result.books.find((item) => item.isbn === book.isbn) ?? null;
      },
      enabled: enabled && Boolean(book.isbn),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });
};
