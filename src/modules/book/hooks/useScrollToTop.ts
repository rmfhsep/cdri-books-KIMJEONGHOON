import { useEffect, useState } from "react";

/**
 * 본문 스크롤 위치에 따라 맨 위 이동 버튼의 표시 여부를 관리한다.
 * @param scrollParent 실제 목록을 스크롤하는 본문 요소.
 * @returns 버튼 표시 여부와 맨 위로 이동하는 액션.
 * @example
 * const { visible, scrollToTop } = useScrollToTop(scrollParent);
 */
export const useScrollToTop = (scrollParent: HTMLElement | null) => {
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => {
    scrollParent?.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  useEffect(() => {
    if (!scrollParent) return;
    const update = () => {
      setVisible((scrollParent?.scrollTop ?? 0) > 200);
    };
    update();
    scrollParent.addEventListener("scroll", update, { passive: true });
    return () => scrollParent.removeEventListener("scroll", update);
  }, [scrollParent]);

  return { visible, scrollToTop };
};
