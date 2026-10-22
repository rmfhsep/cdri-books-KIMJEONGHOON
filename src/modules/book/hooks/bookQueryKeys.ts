import type { BookSearchParams } from "@/modules/book/types/book";

export const BOOK_QUERY_KEYS = {
  search: (params: Omit<BookSearchParams, "page">) =>
    ["books", "search", params] as const,
};
