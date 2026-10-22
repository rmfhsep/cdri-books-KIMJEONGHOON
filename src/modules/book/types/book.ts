export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  thumbnail: string;
  price: number;
  salePrice?: number;
  contents: string;
  url: string;
}

export enum BookSearchTarget {
  Title = "title",
  Isbn = "isbn",
  Publisher = "publisher",
  Person = "person",
}

export enum BookSearchSort {
  Accuracy = "accuracy",
  Latest = "latest",
}

export interface BookSearchParams {
  query: string;
  target?: BookSearchTarget;
  /** 화면에 query 대신 보여줄 검색어. 최근 본 책의 ISBN 재검색에서 책 제목을 표시할 때 사용한다. */
  label?: string;
  sort?: BookSearchSort;
  page?: number;
}

/** 최근 검색어. 상세검색으로 실행한 검색어만 target을 가진다. */
export interface SearchHistoryItem {
  query: string;
  target?: BookSearchTarget;
  label?: string;
}

export interface BookSearchResult {
  books: Book[];
  totalCount: number;
  pageableCount: number;
  isEnd: boolean;
}

export enum BookTab {
  Search = "search",
  Favorites = "favorites",
}
