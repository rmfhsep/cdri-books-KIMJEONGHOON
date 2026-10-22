/** 로딩 중 콘텐츠 자리를 표시한다. 크기는 className으로 지정한다. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`motion-safe:animate-pulse rounded-control bg-palette-lightGray ${className}`}
    />
  );
}
