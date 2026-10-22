# cdri-books-KIMJEONGHOON

카카오 도서 검색 API를 이용한 도서 검색·찜 서비스입니다. React, TypeScript, React Query로 구현했습니다.

## 프로젝트 개요

- 도서를 검색하고(일반검색/상세검색), 결과를 찜 목록에 저장해 다시 볼 수 있는 서비스입니다.
- 화면은 **도서 검색**, **내가 찜한 책** 두 탭으로 구성되며, 각 탭은 검색 결과/목록 가상 스크롤, 상세보기, 찜하기·해제 기능을 제공합니다.
- 디자인은 Figma 시안을 기준으로 구현했습니다.
- 모바일 화면도 고려해 작업했습니다. 

## 실행 방법 및 환경 설정

### 1. 설치

```bash
npm install
```

### 2. 환경 변수

`.env.example`을 복사해 `.env`를 만들고 키를 채웁니다.

```bash
cp .env.example .env
```

| 변수                      | 필수 여부 | 설명                                                                                                                                                                                                                                   |
| ------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_KAKAO_REST_API_KEY` | **필수**  | [카카오 디벨로퍼스](https://developers.kakao.com/docs/ko/app-setting/app#rest-api-key)에서 발급한 REST API 키. 도서 검색 전체가 이 키로 동작합니다.                                                                                    |
| `VITE_ANTHROPIC_API_KEY`  | 선택      | 검색 결과가 없을 때 맞춤법 교정 제안을 보여주는 기능에만 사용합니다. 비워두면 이 기능만 조용히 꺼지고 나머지 기능은 모두 정상 동작합니다. 자세한 내용과 보안 관련 트레이드오프는 아래 "강조하고 싶은 기능 → 검색 결과가 없을 때" 참고. |

### 3. 실행

```bash
npm run dev      # 개발 서버
npm run build    # 타입 체크 + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # oxlint
npm run format   # prettier 적용
```

## 폴더 구조 및 주요 코드 설명

```
src/
├─ modules/
│  ├─ book/                 # 도서 검색·찜 도메인
│  │  ├─ api/                  # 카카오 API 호출(bookApi.ts), 응답 → 화면 모델 매핑(bookMapper.ts)
│  │  ├─ components/
│  │  │  ├─ bookList/           # 목록 항목, 이미지, 빈 목록 안내 등 리스트 UI
│  │  │  ├─ bookPage/           # 탭 레이아웃(TabLayout), 검색/찜 탭(SearchTab/FavoritesTab)
│  │  │  └─ search/             # 검색창, 상세검색 팝업, 맞춤법 제안 UI
│  │  ├─ hooks/                 # 화면 단위 상태+쿼리 훅 (useSearchPanel, useFavoritesPanel 등)
│  │  ├─ types/                 # Book, BookSearchParams 등 도메인 타입
│  │  ├─ constants/             # 정렬 옵션, localStorage 키 등
│  │  └─ utils/                 # formatPrice 등 순수 함수
│  └─ llm/                  # 책 도메인과 무관한 AI 보조 기능(맞춤법 교정)
│     ├─ api/                   # Claude Messages API 호출(suggestSpellingCorrection.ts)
│     └─ hooks/                 # react-query로 감싼 훅(useSpellingSuggestionQuery.ts)
└─ shared/
   ├─ components/           # Button, Select, TextField 등 도메인에 종속되지 않는 범용 UI
   ├─ lib/                  # axios 인스턴스(apiClient), react-query 클라이언트(queryClient), Claude fetch 래퍼(anthropic)
   ├─ hooks/ , utils/ , constants/ , styles/ , assets/
```

도메인(`book`)과 공통(`shared`)을 분리하고, `book` 안에서도 api/components/hooks/types로 역할을 나눴습니다. `llm`은 "맞춤법 교정"이라는 기능 자체가 책 도메인 지식과 무관해서, 나중에 다른 도메인이 생겨도 재사용할 수 있도록 별도 모듈로 뺐습니다.

## 라이브러리 선택 이유

| 라이브러리                                                              | 선택 이유                                                                                                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/react-query` (필수)                                          | 검색 결과·찜한 책 최신 정보 같은 서버 상태를 캐싱·재조회 정책과 함께 관리. `useInfiniteQuery`로 양방향 페이지네이션, `useQueries`로 ISBN별 병렬 조회를 구현했습니다.      |
| `react-virtuoso`                                                        | 검색 결과·찜 목록이 많아질 수 있어 가상 스크롤로 화면에 보이는 항목만 DOM에 올립니다. `firstItemIndex`로 위/아래 양방향 무한스크롤에서도 스크롤 위치가 흔들리지 않습니다. |
| `axios`                                                                 | 카카오 API 전용 인스턴스(`shared/lib/apiClient.ts`)로 baseURL·인증 헤더를 한 곳에서 관리합니다.                                                                           |
| `tailwindcss` + `tailwind-merge`                                        | Figma 디자인 토큰을 유틸리티 클래스로 빠르게 반영하고, 조건부로 클래스가 겹칠 때(`cn` 유틸) 충돌 없이 병합합니다.                                                         |
| `@tanstack/query-sync-storage-persister` + `react-query-persist-client` | 찜한 책 최신 정보 캐시를 새로고침에도 `localStorage`에 유지해, 매번 새로고침마다 같은 API를 다시 호출하지 않도록 했습니다.                                                |

## 강조하고 싶은 기능

### 1. 성능 최적화

#### 목록 가상화

무한 스크롤로 계속 더 불러오면 목록에 쌓이는 항목(표지 이미지 포함)이 끝없이 늘어나고, 전부 DOM에 올리면 노드 수가 많아져 스크롤·렌더링이 무거워집니다. react-virtuoso로 목록을 가상화해서 화면에 보이는 부분과 그 주변만 실제로 DOM에 렌더링하고, 화면 밖으로 벗어난 항목은 DOM에서 내립니다. 수백 개를 불러와도 실제 DOM에 떠 있는 항목 수는 거의 고정적입니다.

관련 코드: [BookList.tsx](src/modules/book/components/bookList/BookList.tsx)

#### 탭 전환 시 화면과 스크롤 유지

기존에는 탭을 바꿀 때 같은 스크롤 영역에서 화면을 교체하고, 목록을 다시 마운트한 뒤 위치를 복원했습니다. 이 과정에서 본문이 깜빡이거나 검색창이 아래쪽에 나타났다가 헤더 밑으로 붙는 동작이 보였습니다.

현재는 검색·찜 화면을 각각 `SearchTab`, `FavoritesTab`으로 렌더링하고, 독립된 스크롤 영역을 유지합니다.

```tsx
<div className="relative min-h-0 flex-1">
  <SearchTab panel={page.searchPanel} active={isSearchTab} />
  <FavoritesTab panel={page.favoritesPanel} active={!isSearchTab} />
</div>
```

두 탭은 공통 틀인 `TabLayout`을 사용하며, 같은 자리에 겹쳐 놓고 활성 탭만 표시합니다.

```tsx
<main
  className={cn("absolute inset-0 overflow-y-auto", !active && "invisible")}
>
  {/* 탭의 검색 영역과 가상 목록 */}
</main>
```

- `visibility: hidden`은 DOM과 레이아웃 크기를 유지합니다. 탭 전환 시 기존 목록을 언마운트하지 않아 `scrollTop`, 검색창의 sticky 위치와 상세보기 상태가 유지됩니다.
- `visibility: hidden`인 비활성 탭은 클릭·키보드 포커스 대상에서도 빠집니다. 가상 목록의 추가 페이지 요청과 항목 위치 저장도 활성 탭에서만 실행합니다.
- URL은 `history.pushState`로 `/search`, `/favorites`를 기록하고 React의 탭 상태를 함께 변경합니다. 문서 전체를 새로 요청하지 않으며, 뒤로·앞으로 가기는 `popstate`에서 탭 상태를 맞춥니다.
- 새로고침으로 DOM이 사라진 경우에만 저장된 항목 index로 위치를 복원합니다. 일반 탭 이동에서는 이미 유지 중인 화면을 보여줍니다.

두 화면을 유지하는 만큼 비활성 탭의 DOM과 컴포넌트 상태도 메모리에 남습니다. 탭이 두 개이고 각 목록을 가상화하므로 이 방식을 선택했습니다. 부모 상태 변경에 따른 React 리렌더링까지 없어지는 것은 아닙니다.

관련 코드: [BookPageBox.tsx](src/modules/book/components/bookPage/BookPageBox.tsx), [TabLayout.tsx](src/modules/book/components/bookPage/TabLayout.tsx), [useBookPage.ts](src/modules/book/hooks/useBookPage.ts), [BookList.tsx](src/modules/book/components/bookList/BookList.tsx)

#### API 요청 최소화

도서 목록은 한 번에 전부 불러오지 않습니다. 끝에서 세 번째 항목에 도달하면 다음 10개를 미리 요청하고, 새로고침해도 처음부터 다시 불러오지 않고 보고 있던 페이지부터 시작하며, 그 지점을 기준으로 위로도·아래로도 양방향 무한 스크롤이 됩니다.

**새로고침 시 보던 페이지부터 요청**

- 화면 맨 위에 보이던 항목의 전체 목록 기준 index만 탭별로 sessionStorage에 저장합니다.
- 새로고침하면 그 항목이 속한 페이지를 먼저 요청하고 해당 항목 위치로 이동합니다. 예를 들어 40번째 항목을 보고 있었다면 1~4페이지를 순서대로 다시 요청하지 않고 4페이지부터 시작합니다.
- 복원된 항목이 페이지 경계에 가까우면 화면을 채우기 위해 인접 페이지를 바로 추가 요청할 수 있습니다.
- 위로 스크롤하면 이전 페이지(`fetchPreviousPage`), 아래로 스크롤하면 다음 페이지(`fetchNextPage`)를 요청합니다.
- react-virtuoso의 `firstItemIndex`를 사용해 앞쪽에 항목이 추가되어도 보던 위치를 유지합니다.

**찜 목록도 보던 범위만 조회**

- 찜한 책은 현재까지 불러온 목록 범위의 도서만 찜 탭이 활성화된 동안 ISBN으로 최신 정보를 조회합니다.
- 새로고침 후에는 보던 10개부터 시작하고, 스크롤 방향에 따라 앞뒤로 10개씩 범위를 늘립니다. 처음부터 보던 위치까지의 도서를 모두 다시 조회하지 않습니다.

**찜한 책 조회 결과 캐싱**

- 카카오 도서 검색 API는 ISBN을 한 번에 하나만 검색할 수 있어 여러 권을 묶어 요청할 수 없습니다. 찜한 책이 100권이면 끝까지 스크롤했을 때 요청도 100번 나갈 수 있는데, 이 반복 요청을 줄이기 위해 캐싱을 적용했습니다.
- 조회한 결과는 1시간 동안 신선한 것으로 간주해(`staleTime`) 같은 세션에서는 같은 책을 다시 조회하지 않습니다. 가격·소개는 자주 바뀌지 않아 이 정도 기간이면 충분하다고 판단했습니다.
- react-query의 캐시는 메모리에만 있어 새로고침하면 사라집니다. `staleTime`만으로는 새로고침마다 다시 요청이 나가는 문제가 남아 `@tanstack/query-sync-storage-persister`로 캐시를 `localStorage`에 영속화했습니다. 새로고침 후에도 1시간 안에는 저장된 결과를 그대로 씁니다.
- 검색 결과 캐시는 용량이 커서 영속화 대상에서 제외하고, 찜한 책의 ISBN 조회 결과만 저장하도록 `queryKey`로 필터링합니다.
- 가격이 실제로 바뀌어도 최대 1시간 동안은 이전 값을 보여줄 수 있다는 트레이드오프가 있습니다.

관련 코드: [useSavedBooksQuery.ts](src/modules/book/hooks/useSavedBooksQuery.ts), [useBookSearchQuery.ts](src/modules/book/hooks/useBookSearchQuery.ts), [queryClient.ts](src/shared/lib/queryClient.ts), [main.tsx](src/main.tsx)

**중복·무한 요청 방지**

- 목록의 처음과 끝이 한 화면에 함께 보여도 한 번에 한 방향만 요청하고, 목록이 바뀐 뒤 남은 방향을 다시 확인합니다.
- 이전·다음 페이지 요청 모두 오류 상태에서는 자동으로 재요청하지 않고, "다시 시도" 버튼으로만 재요청합니다.

#### 최초 진입·새로고침 시 복원 화면 표시

- 초기 데이터와 복원 위치가 준비되는 동안 본문을 `visibility: hidden`으로 숨깁니다.
- `scrollTop`이 두 프레임 연속 같으면 표시합니다. 최대 30프레임까지 확인하며, 이는 60Hz 기준 약 0.5초입니다. 데이터 로딩 시간은 별도입니다.
- 이 처리는 최초 마운트 시 적용합니다. 탭 전환은 각 패널의 DOM을 유지하므로 본문을 다시 숨겼다 복원하지 않습니다.
- 검색 재요청과 다음 페이지 로딩에는 목록 스켈레톤을 사용합니다.

### 2. 검색 결과가 없을 때 — 맞춤법 교정 제안 (AI)

검색어에 오타가 있으면 결과가 0건으로 나오고 사용자는 왜 안 나오는지 알기 어렵습니다. 검색 결과가 없을 때, 입력했던 검색어를 Claude API로 보내 교정된 단어를 제안받고 "혹시 'OO'을 찾고 계신가요?" 링크를 보여줍니다. 클릭하면 그 단어로 재검색하고 검색창 텍스트도 함께 바뀝니다.

- 필수 기능이 아니라 `VITE_ANTHROPIC_API_KEY`가 없으면 조용히 비활성화됩니다(에러 없이 제안만 안 보임).
- **이 과제는 백엔드가 없어서 API 키를 프론트엔드 번들에 둘 수밖에 없습니다.** `@anthropic-ai/sdk`의 `dangerouslyAllowBrowser` 옵션과 동일한 효과를 내는 `anthropic-dangerous-direct-browser-access` 헤더를 직접 붙여 `fetch`로 호출합니다 — 이름 그대로 키가 브라우저 번들에 노출된다는 걸 인지하고 쓰는 옵션입니다. 운영 서비스였다면 반드시 백엔드 프록시를 거쳐야 합니다.
- 비용·악용 방지를 위해 결과가 0건일 때만 호출하고, Haiku 모델과 짧은 `max_tokens`로 호출 비용을 최소화했습니다. react-query의 `queryKey`(검색어 기준) 캐싱으로 같은 검색어에 대한 중복 호출도 막습니다.
- 책 도메인 지식이 전혀 없는 범용 "맞춤법 교정" 기능이라 `modules/llm`으로 분리해, 책 검색 탭(`modules/book`)은 이 기능을 가져다 쓰는 연결 코드만 가지고 있습니다.

관련 코드: [shared/lib/anthropic.ts](src/shared/lib/anthropic.ts), [modules/llm/api/suggestSpellingCorrection.ts](src/modules/llm/api/suggestSpellingCorrection.ts), [modules/llm/hooks/useSpellingSuggestionQuery.ts](src/modules/llm/hooks/useSpellingSuggestionQuery.ts), [SpellingSuggestion.tsx](src/modules/book/components/search/SpellingSuggestion.tsx)

### 3. API 응답 결측 대응

카카오 API가 특정 필드를 비워서 내려주는 경우에도 화면이 깨지지 않도록 방어했습니다.

- 가격(`price`/`sale_price`)이 없으면 0 또는 `undefined`로 안전하게 변환하고, 표시할 때도 `null`/`undefined`면 "가격 정보 없음"으로 보여줍니다.
- 표지 이미지가 없거나 로드에 실패하면 기본 이미지(`public/book_placeholder.jpg`)로 대체합니다.
- 구매 링크(`url`)가 없는 책은 "구매하기" 클릭 시 새 탭을 열지 않고 "판매가 종료된 도서입니다." 안내만 띄웁니다.

관련 코드: [bookMapper.ts](src/modules/book/api/bookMapper.ts), [formatPrice.ts](src/modules/book/utils/formatPrice.ts), [BookImageFrame.tsx](src/modules/book/components/bookList/BookImageFrame.tsx), [BookListItem.tsx](src/modules/book/components/bookList/BookListItem.tsx)

### 4. 찜 목록 정렬

"내가 찜한 책" 탭에서 최신 순(찜한 순서 그대로) / 가격 높은 순 / 가격 낮은 순으로 정렬할 수 있습니다. 정렬은 화면 표시용으로만 적용되고, 저장소에 쌓인 찜 목록의 순서(최신순 기준)는 그대로 유지됩니다.

관련 코드: [favoritesSort.ts](src/modules/book/constants/favoritesSort.ts), [useFavoritesPanel.ts](src/modules/book/hooks/useFavoritesPanel.ts)

### 추가로 개선할 수 있는 부분



