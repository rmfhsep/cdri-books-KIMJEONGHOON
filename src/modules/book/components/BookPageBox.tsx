import { Button } from "@/shared/components/button/Button";
import { BookListSkeleton } from "@/modules/book/components/BookListSkeleton";
import { BookList } from "@/modules/book/components/BookList";
import { Header } from "@/modules/book/components/Header";
import { NoData } from "@/modules/book/components/NoData";
import { SearchBox } from "@/modules/book/components/SearchBox";
import { SearchCountText } from "@/modules/book/components/SearchCountText";
import { useBookPage } from "@/modules/book/hooks/useBookPage";

export function BookPageBox() {
  const page = useBookPage();
  const { searchQuery, isFavorites, scrollParent, setScrollParent } = page;
  const loading = !isFavorites && searchQuery.isLoading;
  const error = !isFavorites && searchQuery.isError;
  return (
    <div className="flex h-dvh flex-col">
      <div className="z-40 shrink-0">
        <Header activeTab={page.tab} onTabChange={page.changeTab} />
      </div>
      <main
        ref={setScrollParent}
        className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
      >
        <div className="mx-auto w-full max-w-[992px] px-4 pt-8 lg:pt-20">
          <div className="relative z-20 shrink-0 bg-palette-white pb-9">
            {isFavorites ? (
              <h1 className="text-title2 leading-8">내가 찜한 책</h1>
            ) : (
              <SearchBox
                history={page.history}
                onRemoveHistory={page.removeHistory}
                onSearch={page.search}
              />
            )}
            <div className={isFavorites ? "mt-3" : "mt-6"}>
              <SearchCountText
                count={page.count}
                label={isFavorites ? "찜한 책" : "도서 검색 결과"}
              />
            </div>
          </div>
          {page.storageError && (
            <p role="alert" className="shrink-0 py-2 text-body2">
              브라우저 저장소를 이용하지 못했습니다. 변경 내용이 재시작 후
              유지되지 않을 수 있습니다.
            </p>
          )}
          {page.refreshingFailed && (
            <p role="status" className="shrink-0 py-2 text-body2">
              최신 정보를 불러오지 못해 저장된 도서 정보를 표시합니다.
            </p>
          )}
          {loading && (
            <div className="max-h-[calc(100dvh-347px)] overflow-hidden">
              <BookListSkeleton />
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="flex shrink-0 items-center justify-center gap-4 py-4 text-body2"
            >
              <p>{searchQuery.errorMessage}</p>
              <Button color="secondary" size="sm" onClick={page.retry}>
                다시 시도
              </Button>
            </div>
          )}
          {!loading && !error && page.books.length === 0 && (
            <div
              className={`pt-20 lg:translate-x-[30px] ${isFavorites ? "lg:pt-[81px]" : "lg:pt-[112px]"}`}
            >
              <NoData
                message={
                  isFavorites
                    ? "찜한 책이 없습니다."
                    : "검색된 결과가 없습니다."
                }
              />
            </div>
          )}
          {page.books.length > 0 && scrollParent && (
            <div
              className="w-full"
              aria-label={isFavorites ? "찜한 도서 목록" : "검색 결과 목록"}
            >
              <BookList
                key={`${page.tab}:${page.listKey}`}
                books={page.books}
                scrollParent={scrollParent}
                likedIds={page.likedIds}
                expandedIds={page.expandedIds}
                hasMore={page.hasMore}
                loading={!isFavorites && searchQuery.isFetchingNextPage}
                onLoadMore={page.loadMore}
                onLike={page.toggleLike}
                onToggleExpanded={page.toggleExpanded}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
