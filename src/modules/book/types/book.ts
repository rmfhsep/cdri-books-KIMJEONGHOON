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
  sort?: BookSearchSort;
  page?: number;
}

export interface BookSearchResult {
  books: Book[];
  totalCount: number;
  pageableCount: number;
  isEnd: boolean;
}

export interface SavedBook {
  book: Book;
  savedAt: string;
}

export enum BookTab {
  Search = "search",
  Favorites = "favorites",
}
