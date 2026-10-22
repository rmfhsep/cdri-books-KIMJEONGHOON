import { BookSearchTarget } from "@/modules/book/types/book";

/** 상세검색에서 선택할 수 있는 검색 대상과 화면 표시 이름. */
export const SEARCH_TARGETS = [
  { label: "제목", value: BookSearchTarget.Title },
  { label: "저자명", value: BookSearchTarget.Person },
  { label: "출판사", value: BookSearchTarget.Publisher },
] as const;
