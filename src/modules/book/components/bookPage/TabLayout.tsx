import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface TabLayoutProps {
  active: boolean;
  restored: boolean;
  setScrollParent: (element: HTMLElement | null) => void;
  title: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

/**
 * 탭 하나의 스크롤 영역. 두 탭을 겹쳐 두고 현재 탭만 보여줘서, 탭을 바꿔도 스크롤 위치가 유지된다.
 * @param props.restored 새로고침 후 스크롤 위치를 잡기 전까지 내용을 숨긴다.
 * @param props.header 스크롤하면 헤더 밑에 붙는 영역.
 */
export const TabLayout = ({
  active,
  restored,
  setScrollParent,
  title,
  header,
  children,
}: TabLayoutProps) => {
  return (
    <main
      ref={setScrollParent}
      className={cn(
        "absolute inset-0 overflow-y-auto pb-9 scrollbar-gutter-stable [overflow-anchor:none]",
        !active && "invisible",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-248 px-4 pt-8 lg:pt-20",
          !restored && "invisible",
        )}
      >
        {title}
        <div className="sticky top-0 z-20 bg-palette-white pb-9">{header}</div>
        {children}
      </div>
    </main>
  );
};
