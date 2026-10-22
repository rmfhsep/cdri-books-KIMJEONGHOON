import { Button } from "@/shared/components/button/Button";
import { BookListSkeleton } from "@/modules/book/components/bookList/BookListSkeleton";
import { NoData } from "@/modules/book/components/bookList/NoData";
import { PanelBookList } from "@/modules/book/components/bookList/PanelBookList";
import { TabLayout } from "@/modules/book/components/bookPage/TabLayout";
import { SearchBox } from "@/modules/book/components/search/SearchBox";
import { SearchCountText } from "@/modules/book/components/search/SearchCountText";
import type { useSearchPanel } from "@/modules/book/hooks/useSearchPanel";
import type { Book } from "@/modules/book/types/book";

type SearchPanel = ReturnType<typeof useSearchPanel>;

interface SearchTabProps {
  panel: SearchPanel;
  active: boolean;
  likedIds: Set<string>;
  onLike: (book: Book) => void;
}

/** 도서 검색 탭. 검색창과 결과 건수는 상단에 붙고, 아래에 검색 결과를 표시한다. */
export const SearchTab = ({
  panel,
  active,
  likedIds,
  onLike,
}: SearchTabProps) => {
  return (
    <TabLayout
      active={active}
      restored={panel.scroll.restored}
      setScrollParent={panel.setScrollParent}
      title={<h1 className="text-title2">도서 검색</h1>}
      header={
        <div className="pt-7.25">
          <SearchBox
            key={panel.searchBoxKey}
            history={panel.history}
            onRemoveHistory={panel.removeHistory}
            onSearch={panel.search}
          />
          <div className="mt-6">
            <SearchCountText
              count={panel.count}
              label={
                panel.label
                  ? `'${panel.label}' 도서 검색 결과`
                  : "도서 검색 결과"
              }
            />
          </div>
        </div>
      }
    >
      <SearchResult
        panel={panel}
        active={active}
        likedIds={likedIds}
        onLike={onLike}
      />
    </TabLayout>
  );
};

/** 로딩·오류·결과 없음·목록 순서로 확인해 하나만 표시한다. */
const SearchResult = ({ panel, active, likedIds, onLike }: SearchTabProps) => {
  if (panel.loading)
    return (
      <div className="max-h-[calc(100dvh-347px)] overflow-hidden">
        <BookListSkeleton />
      </div>
    );
  if (panel.errorMessage)
    return (
      <div className="flex items-center justify-center gap-4 py-4 text-body2">
        <p>{panel.errorMessage}</p>
        <Button color="secondary" size="sm" onClick={panel.retry}>
          다시 시도
        </Button>
      </div>
    );
  if (panel.books.length === 0)
    return <NoData message="검색된 결과가 없습니다." className="lg:pt-28" />;
  return (
    <PanelBookList
      key={panel.listKey}
      panel={panel}
      active={active}
      likedIds={likedIds}
      loadingMore={panel.loadingMore}
      showEndMessage
      onLike={onLike}
    />
  );
};
