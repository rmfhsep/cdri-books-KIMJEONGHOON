import iconBook from "@/shared/assets/icon_book.png";

interface NoDataProps {
  message?: string;
}

/**
 * 빈 목록 안내를 표시한다.
 * @param props.message 기본값은 검색된 결과가 없습니다.다.
 */
export function NoData({ message = "검색된 결과가 없습니다." }: NoDataProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-caption text-text-secondary">
      <img src={iconBook} width={80} height={80} alt="" />
      <p>{message}</p>
    </div>
  );
}
