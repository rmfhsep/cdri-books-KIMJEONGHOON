import type { ReactNode } from "react";
import iconBook from "@/shared/assets/icon_book.png";

interface NoDataProps {
  message?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * 빈 목록 안내를 표시한다.
 * @param props.message 기본값은 "검색된 결과가 없습니다."
 * @param props.className 화면마다 다른 위쪽 여백을 지정한다.
 * @param props.children 안내 문구 아래에 덧붙일 보조 내용(예: 검색어 추천).
 */
export const NoData = ({
  message = "검색된 결과가 없습니다.",
  className = "",
  children,
}: NoDataProps) => {
  return (
    <div
      className={`flex flex-col items-center gap-6 pt-20 text-caption text-text-secondary lg:translate-x-7.5 ${className}`}
    >
      <img src={iconBook} width={80} height={80} alt="" />
      <p>{message}</p>
      {children}
    </div>
  );
};
