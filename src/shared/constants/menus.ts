import { PATHS } from "@/shared/constants/paths";

/** 헤더 메뉴의 이름과 이동 경로. 로고를 누르면 첫 번째 메뉴로 이동한다. */
export const HEADER_MENUS = [
  { label: "도서 검색", path: PATHS.search },
  { label: "내가 찜한 책", path: PATHS.favorites },
];
