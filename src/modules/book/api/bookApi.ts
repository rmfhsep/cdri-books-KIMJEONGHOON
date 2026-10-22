import { BOOK_SEARCH } from "@/shared/constants/endPoints";
import { apiClient } from "@/shared/lib/apiClient";
import { toBookSearchResult } from "@/modules/book/api/bookMapper";
import type {
  BookSearchRequest,
  BookSearchResponse,
} from "@/modules/book/types/bookApi";
import { BookSearchSort } from "@/modules/book/types/book";
import type {
  BookSearchParams,
  BookSearchResult,
} from "@/modules/book/types/book";

/**
 * 도서를 10개씩 검색하고 UI 모델로 변환한다.
 * @param params 검색어·검색 대상·정렬 조건. page는 무한스크롤에서 내부적으로 증가시키는 요청 페이지다(기본값 1).
 * @returns 도서 목록과 검색 건수, 마지막 페이지 여부. 요청 실패는 Axios 오류로 전달한다.
 * @example
 * const result = await searchBooks({ query: "리액트" });
 */
export async function searchBooks(
  params: BookSearchParams,
): Promise<BookSearchResult> {
  const request: BookSearchRequest = {
    query: params.query.trim(),
    sort: params.sort ?? BookSearchSort.Accuracy,
    page: params.page ?? 1,
    size: 10,
    target: params.target,
  };
  const { data } = await apiClient.get<BookSearchResponse>(BOOK_SEARCH, {
    params: request,
  });
  return toBookSearchResult(data);
}
