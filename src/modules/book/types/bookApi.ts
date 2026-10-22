import type {
  BookSearchSort,
  BookSearchTarget,
} from "@/modules/book/types/book";

export interface BookSearchRequest {
  query: string;
  sort: BookSearchSort;
  page: number;
  size: number;
  target?: BookSearchTarget;
}

export interface BookDocument {
  title: string;
  contents: string;
  url: string;
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  sale_price: number;
  thumbnail: string;
  status: string;
}

export interface BookSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: BookDocument[];
}

export interface KakaoErrorResponse {
  code?: number;
  msg?: string;
}
