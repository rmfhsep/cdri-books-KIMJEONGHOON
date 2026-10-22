import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/modules/book/constants/storageKeys";

// 탭별로 화면 맨 위에 보이던 항목의 index. 새로고침 후 위치를 되살릴 때 사용한다.
const savedIndexes: Record<string, number> = JSON.parse(
  sessionStorage.getItem(STORAGE_KEYS.scrollIndex) ?? "{}",
);

const saveIndexes = () => {
  sessionStorage.setItem(
    STORAGE_KEYS.scrollIndex,
    JSON.stringify(savedIndexes),
  );
};

/**
 * 탭에서 마지막으로 보던 항목이 있는 페이지 번호를 반환한다.
 * @param tabKey 검색 또는 찜 목록 탭.
 * @returns 1부터 시작하는 페이지 번호. 저장된 위치가 없으면 1.
 * @example
 * const startPage = getSavedPage(BookTab.Search);
 */
export const getSavedPage = (tabKey: string) => {
  return Math.floor((savedIndexes[tabKey] ?? 0) / 10) + 1;
};

interface UseScrollRestorationParams {
  tabKey: string;
  scrollParent: HTMLElement | null;
  ready: boolean;
}

/**
 * 화면 맨 위에 보이던 항목을 저장하고, 새로고침 후 그 항목부터 보여준다.
 * @param params.ready 첫 페이지 데이터를 받았는지 여부.
 * @returns 시작 항목 index, 위치 복원이 끝났는지 여부, 저장·초기화 함수.
 * @example
 * const scroll = useScrollRestoration({ tabKey, scrollParent, ready });
 * // restored가 true가 될 때까지 목록을 숨긴다.
 */
export const useScrollRestoration = ({
  tabKey,
  scrollParent,
  ready,
}: UseScrollRestorationParams) => {
  const [restored, setRestored] = useState(false);

  /** @param index 화면 맨 위 항목의 index. 위치를 잡는 중에는 저장하지 않는다. */
  const saveIndex = (index: number) => {
    if (!restored) return;
    savedIndexes[tabKey] = index;
    saveIndexes();
  };

  /** 새 검색을 하면 저장된 위치를 지우고 맨 위로 이동한다. */
  const clear = () => {
    delete savedIndexes[tabKey];
    saveIndexes();
    scrollParent?.scrollTo({ top: 0 });
  };

  // 매 프레임 스크롤 위치를 확인해서, 위치가 더 이상 바뀌지 않으면 복원이 끝난 것으로 본다.
  // 끝나지 않아도 30프레임(약 0.5초) 뒤에는 화면을 보여준다.
  useEffect(() => {
    if (!ready || restored || !scrollParent) return;
    let lastTop = -1;
    let checks = 0;
    let frame = 0;
    const check = () => {
      const stopped = scrollParent.scrollTop === lastTop;
      lastTop = scrollParent.scrollTop;
      checks += 1;
      if (stopped || checks >= 30) setRestored(true);
      else frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [ready, restored, scrollParent]);

  return {
    initialIndex: savedIndexes[tabKey] ?? 0,
    restored,
    saveIndex,
    clear,
  };
};
