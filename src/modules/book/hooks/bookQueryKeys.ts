import type { BookSearchParams } from "@/modules/book/types/book";

export const bookQueryKeys = {
  search: (params: Omit<BookSearchParams, "page">) =>
    ["books", "search", params] as const,
};
