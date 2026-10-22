import { useEffect } from "react";

/**
 * Tab 키 탐색 중에만 전역 포커스 표시를 활성화한다.
 * @example
 * useKeyboardFocus(); // 앱 진입 컴포넌트에서 한 번 호출한다.
 */
export const useKeyboardFocus = () => {
  useEffect(() => {
    const root = document.documentElement;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") root.dataset.keyboardFocus = "";
    };
    const handlePointerDown = () => {
      delete root.dataset.keyboardFocus;
    };
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      delete root.dataset.keyboardFocus;
    };
  }, []);
};
