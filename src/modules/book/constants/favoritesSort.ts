export enum FavoritesSort {
  Latest = "latest",
  PriceDesc = "priceDesc",
  PriceAsc = "priceAsc",
}

/** 찜한 책 목록 정렬 옵션과 화면 표시 이름. */
export const FAVORITES_SORT_OPTIONS = [
  { label: "최신 순", value: FavoritesSort.Latest },
  { label: "가격 높은 순", value: FavoritesSort.PriceDesc },
  { label: "가격 낮은 순", value: FavoritesSort.PriceAsc },
] as const;
