import { useInfiniteQuery } from "@tanstack/react-query";
import { bookApi } from "@/modules/book/api/bookApi";
import { BOOK_QUERY_KEYS } from "@/modules/book/hooks/bookQueryKeys";
import { BookSearchSort } from "@/modules/book/types/book";
import type { BookSearchParams } from "@/modules/book/types/book";

import { getBookSearchErrorMessage } from "@/modules/book/utils/getBookSearchErrorMessage";

/**
 * 제출한 검색 조건으로 도서를 10개씩 가져오는 양방향 무한스크롤 쿼리.
 * @param params 검색어·검색 대상·정렬. 빈 검색어는 요청하지 않는다.
 * @param initialPage 처음 요청할 페이지. 새로고침 후 보던 페이지만 불러오고 앞뒤 페이지는 스크롤할 때 요청한다.
 * @returns pages, 로딩·오류 상태, errorMessage와 fetchPreviousPage·fetchNextPage, hasPreviousPage·hasNextPage를 제공한다.
 * @example
 * const query = useBookSearchQuery({ query: submittedQuery }, 1);
 * // 목록 하단이 보이면 hasNextPage && !isFetchingNextPage를 확인한 뒤 fetchNextPage()를 호출한다.
 */
export const useBookSearchQuery = (
  params: Omit<BookSearchParams, "page">,
  initialPage: number,
) => {
  const searchParams = {
    query: params.query.trim(),
    target: params.target,
    sort: params.sort ?? BookSearchSort.Accuracy,
  };

  const query = useInfiniteQuery({
    queryKey: BOOK_QUERY_KEYS.search(searchParams),
    queryFn: ({ pageParam }) =>
      bookApi.searchBooks({ ...searchParams, page: pageParam }),
    initialPageParam: initialPage,
    getPreviousPageParam: (_firstPage, _pages, firstPageParam) =>
      firstPageParam > 1 ? firstPageParam - 1 : undefined,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.isEnd || lastPageParam >= 50 ? undefined : lastPageParam + 1,
    enabled: searchParams.query.length > 0,
    retry: false,
  });

  return {
    ...query,
    errorMessage: query.isError ? getBookSearchErrorMessage(query.error) : null,
  };
};
