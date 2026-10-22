import { Skeleton } from "@/shared/components/skeleton/Skeleton";

/** 도서 목록과 같은 배치로 로딩 자리를 표시한다. */
export function BookListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div role="status" aria-label="도서를 불러오는 중입니다.">
      <span className="sr-only">도서를 불러오는 중입니다.</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-4 border-b border-ui-border p-4 lg:h-[100px] lg:flex-nowrap lg:gap-0 lg:py-4 lg:pl-12 lg:pr-4"
        >
          <Skeleton className="h-[68px] w-12 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:ml-12 lg:w-[408px] lg:flex-none lg:flex-row lg:items-center">
            <Skeleton className="h-[18px] w-40 max-w-full" />
            <Skeleton className="h-[14px] w-24" />
          </div>
          <Skeleton className="ml-16 h-[18px] w-[76px] lg:ml-[22px]" />
          <div className="flex w-full gap-2 lg:ml-14 lg:w-auto">
            <Skeleton className="h-12 flex-1 lg:w-[115px] lg:flex-none" />
            <Skeleton className="h-12 flex-1 lg:w-[115px] lg:flex-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
