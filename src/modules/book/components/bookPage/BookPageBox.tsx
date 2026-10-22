import { HEADER_MENUS } from "@/shared/constants/menus";
import { Header } from "@/shared/components/layout/Header";
import { BookFloatingActions } from "@/modules/book/components/bookPage/BookFloatingActions";
import { FavoritesTab } from "@/modules/book/components/bookPage/FavoritesTab";
import { SearchTab } from "@/modules/book/components/bookPage/SearchTab";
import { useBookPage } from "@/modules/book/hooks/useBookPage";
import { BookTab } from "@/modules/book/types/book";

export const BookPageBox = () => {
  const page = useBookPage();
  const isSearchTab = page.tab === BookTab.Search;

  return (
    <div className="flex h-dvh flex-col">
      <div className="z-40 shrink-0">
        <Header
          menus={HEADER_MENUS}
          activePath={page.path}
          onNavigate={page.navigate}
        />
      </div>
      <div className="relative min-h-0 flex-1">
        <SearchTab
          panel={page.searchPanel}
          active={isSearchTab}
          likedIds={page.likedIds}
          onLike={page.toggleLike}
        />
        <FavoritesTab panel={page.favoritesPanel} active={!isSearchTab} />
      </div>
      <BookFloatingActions
        recentBook={page.recentBook}
        scrollParent={page.scrollParent}
        onSearchRecentBook={page.searchRecentBook}
      />
    </div>
  );
};
