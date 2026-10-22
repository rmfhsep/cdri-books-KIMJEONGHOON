import { Skeleton } from "@/shared/components/skeleton/Skeleton";

/** 도서 목록과 같은 배치로 로딩 자리를 표시한다. */
export const BookListSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-4 border-b border-ui-border p-4 lg:h-25 lg:flex-nowrap lg:gap-0 lg:py-4 lg:pl-12 lg:pr-4"
        >
          <Skeleton className="h-17 w-12 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:ml-12 lg:w-102 lg:flex-none lg:flex-row lg:items-center">
            <Skeleton className="h-4.5 w-40 max-w-full" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="ml-16 h-4.5 w-19 lg:ml-5.5" />
          <div className="flex w-full gap-2 lg:ml-14 lg:w-auto">
            <Skeleton className="h-12 flex-1 lg:w-28.75 lg:flex-none" />
            <Skeleton className="h-12 flex-1 lg:w-28.75 lg:flex-none" />
          </div>
        </div>
      ))}
    </div>
  );
};
