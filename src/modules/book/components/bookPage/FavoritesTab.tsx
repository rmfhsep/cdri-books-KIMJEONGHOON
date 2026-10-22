import { NoData } from "@/modules/book/components/bookList/NoData";
import { PanelBookList } from "@/modules/book/components/bookList/PanelBookList";
import { TabLayout } from "@/modules/book/components/bookPage/TabLayout";
import { SearchCountText } from "@/modules/book/components/search/SearchCountText";
import type { useFavoritesPanel } from "@/modules/book/hooks/useFavoritesPanel";

interface FavoritesTabProps {
  panel: ReturnType<typeof useFavoritesPanel>;
  active: boolean;
}

/** 내가 찜한 책 탭. 찜한 책 건수는 상단에 붙고, 아래에 찜 목록을 표시한다. */
export const FavoritesTab = ({ panel, active }: FavoritesTabProps) => {
  return (
    <TabLayout
      active={active}
      restored={panel.scroll.restored}
      setScrollParent={panel.setScrollParent}
      title={<h1 className="text-title2 leading-8">내가 찜한 책</h1>}
      header={
        <div className="pt-3">
          <SearchCountText count={panel.count} label="찜한 책" />
        </div>
      }
    >
      {panel.refreshingFailed && (
        <p className="py-2 text-body2">
          최신 정보를 불러오지 못해 저장된 도서 정보를 표시합니다.
        </p>
      )}
      {panel.books.length === 0 ? (
        <NoData message="찜한 책이 없습니다." className="lg:pt-20.25" />
      ) : (
        <PanelBookList
          panel={panel}
          active={active}
          likedIds={panel.likedIds}
          onLike={panel.toggleLike}
        />
      )}
    </TabLayout>
  );
};
