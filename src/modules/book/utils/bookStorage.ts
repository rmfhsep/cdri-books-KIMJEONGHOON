import { BookSearchTarget, BookSearchSort } from "@/modules/book/types/book";
import type {
  Book,
  SavedBook,
  BookSearchParams,
} from "@/modules/book/types/book";

/**
 * 브라우저에 저장된 검색 입력·조건·기록과 찜 목록을 복원한다.
 * @returns 손상되거나 읽을 수 없는 항목은 빈 목록으로 복원하며 실패 여부를 함께 반환한다.
 * @example
 * const { history, favorites } = readBookStorage();
 */
export function readBookStorage() {
  let failed = false;
  let history: string[] = [];
  let favorites: SavedBook[] = [];
  let input = "";
  let expandedIds: string[] = [];
  let searchParams: BookSearchParams = { query: "" };
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("books.history") ?? "[]",
    );
    if (Array.isArray(value))
      history = [
        ...new Set(
          value.filter(
            (item): item is string =>
              typeof item === "string" && item.trim().length > 0,
          ),
        ),
      ].slice(0, 8);
  } catch {
    failed = true;
  }
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("books.favorites") ?? "[]",
    );
    if (Array.isArray(value))
      favorites = value.filter((item): item is SavedBook => {
        if (!item || typeof item !== "object") return false;
        const { book, savedAt } = item;
        return typeof savedAt === "string" && isBook(book);
      });
  } catch {
    failed = true;
  }
  try {
    const draft: unknown = JSON.parse(
      localStorage.getItem("books.searchInput") ?? '""',
    );
    if (typeof draft === "string") input = draft;
    const saved = JSON.parse(
      localStorage.getItem("books.searchParams") ?? "null",
    );
    if (saved && typeof saved.query === "string") {
      searchParams = {
        query: saved.query,
        target: Object.values(BookSearchTarget).includes(saved.target)
          ? saved.target
          : undefined,
        sort: Object.values(BookSearchSort).includes(saved.sort)
          ? saved.sort
          : undefined,
      };
    }
  } catch {
    failed = true;
  }
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("books.expandedIds") ?? "[]",
    );
    if (Array.isArray(value))
      expandedIds = [
        ...new Set(value.filter((id): id is string => typeof id === "string")),
      ];
  } catch {
    failed = true;
  }
  return { history, favorites, input, searchParams, expandedIds, failed };
}

function isBook(value: unknown): value is Book {
  if (!value || typeof value !== "object") return false;
  return (
    ["id", "isbn", "title", "author", "thumbnail", "contents", "url"].every(
      (key) => typeof Reflect.get(value, key) === "string",
    ) &&
    typeof Reflect.get(value, "price") === "number" &&
    (Reflect.get(value, "salePrice") === undefined ||
      typeof Reflect.get(value, "salePrice") === "number")
  );
}

/**
 * 검색 상태 또는 찜 목록을 JSON으로 저장한다.
 * @param key 저장 대상 키. 검색기록은 books.history, 찜 목록은 books.favorites를 사용한다.
 * @param value 저장할 목록. 한글 문자열은 별도 인코딩하지 않는다.
 * @returns 저장 성공 여부. 저장 공간 부족이나 접근 제한 시 false.
 * @example
 * const saved = writeBookStorage("books.history", history);
 */
export function writeBookStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
