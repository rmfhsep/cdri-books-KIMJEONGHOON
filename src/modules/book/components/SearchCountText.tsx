interface SearchCountTextProps {
  count: number;
  label?: string;
}

/**
 * 도서 검색 결과 건수를 천 단위 구분 기호와 함께 표시한다.
 */
export function SearchCountText({
  count,
  label = "도서 검색 결과",
}: SearchCountTextProps) {
  return (
    <p className="flex items-center gap-4 text-caption leading-6">
      <span>{label}</span>
      <span>
        총{" "}
        <span className="text-palette-primary">
          {count.toLocaleString("ko-KR")}
        </span>
        건
      </span>
    </p>
  );
}
