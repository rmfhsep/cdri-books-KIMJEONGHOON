import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const ONE_DAY = 24 * 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    // 영속화한 캐시가 복원 직후 바로 제거되지 않도록 persister의 maxAge보다 길게 둔다.
    queries: { gcTime: ONE_DAY },
  },
});

export const queryPersister = createSyncStoragePersister({
  storage: window.localStorage,
});

/** 찜한 책의 ISBN 조회 결과만 영속화한다. 검색 결과는 용량이 커서 대상에서 뺀다. */
export const shouldPersistQuery = (query: { queryKey: readonly unknown[] }) =>
  query.queryKey[0] === "books" && query.queryKey[1] === "isbn";
