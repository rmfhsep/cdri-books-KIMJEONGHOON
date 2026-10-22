import { useInfiniteQuery } from "@tanstack/react-query";
import { searchBooks } from "@/modules/book/api/bookApi";
import { bookQueryKeys } from "@/modules/book/hooks/bookQueryKeys";
import { BookSearchSort } from "@/modules/book/types/book";
import type { BookSearchParams } from "@/modules/book/types/book";

import { getBookSearchErrorMessage } from "@/modules/book/utils/getBookSearchErrorMessage";

/**
 * 제출한 검색 조건으로 도서를 10개씩 가져오는 무한스크롤 쿼리.
 * @param params 검색어·검색 대상·정렬. 빈 검색어는 요청하지 않는다.
 * @returns pages, 로딩·오류 상태, errorMessage와 fetchNextPage, hasNextPage를 제공한다.
 * @example
 * const query = useBookSearchQuery({ query: submittedQuery });
 * // 목록 하단이 보이면 hasNextPage && !isFetchingNextPage를 확인한 뒤 fetchNextPage()를 호출한다.
 */
export function useBookSearchQuery(params: Omit<BookSearchParams, "page">) {
  const searchParams = {
    query: params.query.trim(),
    target: params.target,
    sort: params.sort ?? BookSearchSort.Accuracy,
  };

  const query = useInfiniteQuery({
    queryKey: bookQueryKeys.search(searchParams),
    queryFn: ({ pageParam }) =>
      searchBooks({ ...searchParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.isEnd || lastPageParam >= 50 ? undefined : lastPageParam + 1,
    enabled: searchParams.query.length > 0,
    retry: false,
  });

  return {
    ...query,
    errorMessage: query.isError ? getBookSearchErrorMessage(query.error) : null,
  };
}
