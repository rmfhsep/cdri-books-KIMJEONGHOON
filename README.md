# cdri-books-KIMJEONGHOON

도서 검색 API를 이용한 도서 검색·찜 서비스입니다. React, TypeScript, React Query 기반으로 구현했습니다.

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
   ├─ components/           # Button, Select, TextField, Header, NotFoundBox 등 도메인에 종속되지 않는 범용 UI
   ├─ lib/                  # axios 인스턴스(apiClient), react-query 클라이언트(queryClient), Claude fetch 래퍼(anthropic)
   ├─ constants/            # 화면 경로(PATHS), 헤더 메뉴(HEADER_MENUS), API 엔드포인트
   ├─ utils/                # localStorage 읽기·쓰기(storage), Tailwind 클래스 합치기(cn)
   ├─ hooks/ , styles/ , assets/
```

도메인(`book`)과 공통(`shared`)을 분리하고, `book` 안에서도 api/components/hooks/types로 역할을 나눴습니다. `llm`은 "맞춤법 교정"이라는 기능 자체가 책 도메인 지식과 무관해서, 나중에 다른 도메인이 생겨도 재사용할 수 있도록 별도 모듈로 뺐습니다.
컴포넌트 내 String 사용할 경우 상수화를 통하여 가독성과, 유지보수성을 고려하였습니다.

### 데이터 흐름

화면에서 API까지 아래 순서로만 호출합니다. 컴포넌트는 API를 직접 부르지 않고, 카카오 응답은 `bookMapper`에서 한 번만 화면용 모델(`Book`)로 바꿉니다.

```
BookPageBox (화면 조립)
 └─ SearchTab / FavoritesTab (탭 UI)
     └─ useSearchPanel / useFavoritesPanel (탭별 상태·동작)
         └─ useBookSearchQuery / useSavedBooksQuery (React Query)
             └─ bookApi → apiClient(axios) → 카카오 API
                 └─ bookMapper (응답 → Book)
```

### 주요 파일

| 파일                                                                                                | 역할                                                              |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [BookPageBox.tsx](src/modules/book/components/bookPage/BookPageBox.tsx)                             | 헤더, 검색·찜 탭, 플로팅 버튼을 조립하는 화면 진입점              |
| [TabLayout.tsx](src/modules/book/components/bookPage/TabLayout.tsx)                                 | 두 탭이 함께 쓰는 틀. 스크롤 영역, 상단 고정 영역, 비활성 탭 숨김 |
| [useBookPage.ts](src/modules/book/hooks/useBookPage.ts)                                             | 현재 탭(주소), 최근 본 책을 관리하고 두 패널 훅을 조합            |
| [useSearchPanel.ts](src/modules/book/hooks/useSearchPanel.ts)                                       | 검색 조건·결과·검색기록, 이전·다음 페이지 요청, 재시도            |
| [useFavoritesPanel.ts](src/modules/book/hooks/useFavoritesPanel.ts)                                 | 찜 목록·정렬, 화면에 보이는 책의 최신 정보 조회                   |
| [useBookSearchQuery.ts](src/modules/book/hooks/useBookSearchQuery.ts)                               | 10개씩 위아래로 이어 받는 무한 쿼리(`useInfiniteQuery`)           |
| [useScrollRestoration.ts](src/modules/book/hooks/useScrollRestoration.ts)                           | 맨 위 항목 번호를 저장하고 새로고침 후 그 위치로 복원             |
| [BookList.tsx](src/modules/book/components/bookList/BookList.tsx)                                   | Virtuoso 가상 목록. 보이는 범위를 알리고 앞뒤 페이지 요청         |
| [bookApi.ts](src/modules/book/api/bookApi.ts) · [bookMapper.ts](src/modules/book/api/bookMapper.ts) | 카카오 도서 검색 호출과 응답 변환                                 |
| [storageKeys.ts](src/modules/book/constants/storageKeys.ts)                                         | localStorage·sessionStorage 키를 한 곳에서 관리                   |

### 코드 작성 규칙

- 함수는 모두 `const` 화살표 함수로 선언하고, API는 `bookApi` 객체에 모았습니다.
- JSX 안에 로직을 쓰지 않고 `handle*` 이름의 핸들러로 분리했습니다.
- 경로·메뉴·저장소 키·정렬 옵션 같은 상수는 대문자 상수로 관리합니다.
- 컴포넌트는 `@param props.*`, 훅은 `@param params.*`로 JSDoc을 작성했습니다.
- 훅 안의 `useEffect`는 맨 아래(return 바로 위)에 둡니다.

## 라이브러리 선택 이유

| 라이브러리                                                              | 선택 이유                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/react-query`                                                 | 검색 결과·찜한 책 최신 정보 같은 서버 상태를 캐싱·재조회 정책과 함께 관리. `useInfiniteQuery`로 양방향 페이지네이션, `useQueries`로 ISBN별 병렬 조회를 구현했습니다.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `react-virtuoso`                                                        | 검색 결과·찜 목록이 많아질 수 있어 가상 스크롤로 화면에 보이는 항목만 DOM에 올립니다. 실제 서비스에서는 데이터가 방대하고, 많은 이미지를 모두 DOM에 올리면 성능에 영향이 가기 때문에 리스트 화면에서는 가상화가 필요하다고 생각했습니다. `firstItemIndex`로 위/아래 양방향 무한스크롤에서도 스크롤 위치가 흔들리지 않습니다.                                                                                                                                                                                                                                           |
| `babel-plugin-react-compiler`                                           | React 공식 컴파일러입니다. `memo`·`useMemo`를 직접 쓰지 않아도 빌드할 때 자동으로 적용해 줘서, 코드를 단순하게 유지하면서 불필요한 리렌더링을 줄일 수 있습니다.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `axios`                                                                 | fetch보다 반복 코드가 적고, 추후 요청 취소, 타임아웃, 인터셉터 등을 사용하여 확장하기가 용이합니다. ① `axios.create`로 baseURL·인증 헤더를 한 곳에서 설정합니다(`shared/lib/apiClient.ts`). ② `params` 객체를 넘기면 쿼리스트링을 만들어 주고, 값이 없는 항목(`target` 등)은 자동으로 빠집니다. ③ 응답 JSON을 자동으로 변환하고 `get<T>`로 타입을 지정할 수 있습니다. ④ 4xx·5xx 응답을 오류로 던져 줘서 React Query가 바로 실패로 처리하고, `isAxiosError`와 `error.response`로 서버 오류(상태 코드·카카오 오류 코드)와 네트워크 오류를 구분해 안내 문구를 보여줍니다. |
| `tailwindcss` + `tailwind-merge`                                        | 개발자가 ui 작업을 할 때, 파일을 옮겨다니지 않고, 바로 스타일링 작업을 편하게 할 수 있습니다. Figma 디자인 토큰을 유틸리티 클래스로 빠르게 반영하고, 조건부로 클래스가 겹칠 때(`cn` 유틸) 충돌 없이 병합합니다.                                                                                                                                                                                                                                                                                                                                                        |
| `@tanstack/query-sync-storage-persister` + `react-query-persist-client` | 찜한 책 최신 정보 캐시를 새로고침에도 `localStorage`에 유지해, 매번 새로고침마다 같은 API를 다시 호출하지 않도록 했습니다.                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## 강조하고 싶은 기능

### 1. 성능 최적화

#### 목록 가상화

검색 결과와 찜 목록은 react-virtuoso로 **화면에 보이는 항목만** 그립니다. 목록이 수백 개로 늘어나도 실제로 그려지는 항목 수는 거의 같습니다.

- **검색 결과**: 서버에서 받는 데이터라 10개씩 나눠서 요청합니다. 끝에서 세 번째 항목에 닿으면 다음 10개를 미리 요청합니다.
- **찜 목록**: 이미 브라우저에 저장된 데이터라 나눠서 불러오지 않고 가상화만 합니다. 나눠서 불러와도 그려지는 양은 같아서 코드만 늘어나기 때문입니다.

관련 코드: [BookList.tsx](src/modules/book/components/bookList/BookList.tsx), [useSearchPanel.ts](src/modules/book/hooks/useSearchPanel.ts), [useFavoritesPanel.ts](src/modules/book/hooks/useFavoritesPanel.ts)

#### 리렌더링 최적화 (React Compiler)

React 19버전부터 사용가능한 React Compiler를 켜서, 빌드할 때 컴포넌트와 훅에 `memo`·`useMemo`·`useCallback`이 **자동으로** 적용되게 했습니다.

- 코드에 `useMemo`·`useCallback`을 직접 쓰지 않아도 되어 코드가 단순하게 유지, 개발자가 신경 쓰지 않아도됩니다.
- 찜하기·상세보기처럼 페이지 상단의 상태가 바뀌어도, 영향을 받지 않는 부분은 다시 그려지지 않습니다.
- 그 밖에 상태를 쓰는 곳 가까이에 두어(예: 검색창 입력값은 검색창 안에서 관리) 글자를 칠 때 목록까지 다시 그려지지 않게 했습니다.

```ts
// vite.config.ts
plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
```

관련 코드: [vite.config.ts](vite.config.ts)

#### 탭을 바꿔도 화면과 스크롤 유지

검색 탭과 찜 탭을 둘 다 그려 두고 같은 자리에 겹친 뒤, 현재 탭이 아닌 쪽만 `invisible`(`visibility: hidden`)로 숨깁니다.

```tsx
<SearchTab panel={page.searchPanel} active={isSearchTab} />
<FavoritesTab panel={page.favoritesPanel} active={!isSearchTab} />
```

- 탭을 바꿔도 목록을 다시 만들지 않아서 스크롤 위치와 상세보기 펼침 상태가 그대로 남습니다.
- 숨긴 탭은 클릭과 키보드 포커스도 받지 않습니다.
- 주소는 `/search`, `/favorites`로 바뀌고 뒤로·앞으로 가기도 동작합니다. 페이지를 새로 불러오지는 않습니다.
- 대신 두 탭의 화면이 모두 메모리에 남습니다. 탭이 두 개뿐이고 목록이 가상화되어 있어 부담이 크지 않다고 판단했습니다.
- 최대한 좋은 사용자 경험을 위해 탭 전환 시 깜빡임(flicker)을 줄이기 위하여 이 방식을 선택했습니다. 탭이 많아지거나 화면이 복잡해지면 각 탭을 별도 페이지로 나누고,
  라우터의 스크롤 복원 기능이나 `useLayoutEffect`로 화면에 그려지기 전에 스크롤 위치를 복원하는 방식으로 바꿀 것 같습니다.
  목록이 가상화되어 있다면 Virtuoso의 `initialTopMostItemIndex`처럼 라이브러리의 복원 기능을 함께 사용하겠습니다.

관련 코드: [BookPageBox.tsx](src/modules/book/components/bookPage/BookPageBox.tsx), [TabLayout.tsx](src/modules/book/components/bookPage/TabLayout.tsx), [useBookPage.ts](src/modules/book/hooks/useBookPage.ts)

#### 새로고침해도 보던 리스트 위치 유지

- 화면 맨 위에 보이던 항목 번호만 탭별로 sessionStorage에 저장합니다.
- **검색 결과**: 그 항목이 있는 페이지 하나만 요청합니다. 예를 들어 40번째 항목을 보고 있었다면 1~4페이지를 다시 요청하지 않고 4페이지만 요청합니다. 위로 스크롤하면 이전 페이지, 아래로 스크롤하면 다음 페이지를 요청하고, `firstItemIndex`로 위에 항목이 추가돼도 화면이 밀리지 않게 했습니다.
- **찜 목록**: 데이터가 이미 있어서 저장된 항목으로 바로 이동합니다.
- 위치를 잡는 동안(최대 약 0.5초)은 목록을 숨겨서, 맨 위에서 저장된 위치로 이동하는 모습이 보이지 않게 했습니다.

관련 코드: [useScrollRestoration.ts](src/modules/book/hooks/useScrollRestoration.ts), [useBookSearchQuery.ts](src/modules/book/hooks/useBookSearchQuery.ts)

#### 찜한 책 최신 정보는 보이는 책만 조회

- 찜할 때 저장한 정보를 먼저 보여주고, **화면에 보이는 책만** ISBN으로 최신 가격·정보를 조회합니다. 카카오 API는 ISBN을 한 번에 하나만 검색할 수 있어서, 전체를 조회하면 찜한 책 수만큼 요청이 나가기 때문입니다.
- 조회 결과는 1시간 동안 다시 요청하지 않고(`staleTime`), localStorage에도 저장해 새로고침 후에도 그대로 씁니다. 검색 결과는 용량이 커서 저장하지 않습니다.
- 가격이 바뀌어도 최대 1시간은 이전 값이 보일 수 있습니다.
- 이렇게 구현한 이유는 localStorage에 있는 데이터를 그대로 사용해도 되지만, 실제 서비스라면 가격 정보가 바뀔 수도 있다고 가정했습니다. 가격은 중요한 정보이기 때문에 최신화가 필요하다고 생각했습니다.
  현재의 구조에서는 책 하나당 한번의 api가 나가기 때문에 너무 많은 api 호출을 하지 않기 위해, 1시간의 staleTime을 두었습니다. 또한 우선적으로 화면에 보이는 책들만 조회를 하도록 가드 처리하였습니다.
  실제 서비스라면 백엔드에서 찜한 목록을 한 번에 가져올 것이라 가정하였습니다.

관련 코드: [useSavedBooksQuery.ts](src/modules/book/hooks/useSavedBooksQuery.ts), [queryClient.ts](src/shared/lib/queryClient.ts), [main.tsx](src/main.tsx)

#### 불필요한 요청 막기

- 목록의 처음과 끝이 한 화면에 모두 보여도 한 번에 한 방향만 요청합니다.
- 요청이 실패하면 자동으로 다시 요청하지 않습니다. "다시 시도" 버튼을 누를 때만 실패한 페이지를 다시 요청합니다.

### 2. 검색 결과가 없을 때 — 맞춤법 교정 제안 (AI)

검색어에 오타가 있으면 결과가 0건으로 나오고 사용자는 왜 안 나오는지 알기 어렵습니다. 검색 결과가 없을 때, 입력했던 검색어를 Claude API로 보내 교정된 단어를 제안받고 "혹시 'OO'을 찾고 계신가요?" 텍스트를 보여줍니다. 클릭하면 그 단어로 재검색하고 검색창 텍스트도 함께 바뀝니다.

- 필수 기능이 아니라 `VITE_ANTHROPIC_API_KEY`가 없으면 조용히 비활성화됩니다(에러 없이 제안만 안 보임).
- **이 과제는 백엔드가 없어서 API 키를 프론트엔드에 둘 수밖에 없습니다. 실제 서비스라면 백엔드 서버에 요청 하도록 개선하겠습니다.**
- 비용·악용 방지를 위해 결과가 0건일 때만 호출하고, 짧은 `max_tokens`로 호출 비용을 최소화했습니다. react-query의 `queryKey`(검색어 기준) 캐싱으로 같은 검색어에 대한 중복 호출도 막습니다.
- 책 도메인 지식이 전혀 없는 범용 "맞춤법 교정" 기능이라 `modules/llm`으로 분리해, 책 검색 탭(`modules/book`)은 이 기능을 가져다 쓰는 연결 코드만 가지고 있습니다.
- 예시: `프론트에드` 검색 시 `프론트엔드` 추천 / `리액뜨` 검색 시 `리액트` 추천

관련 코드: [shared/lib/anthropic.ts](src/shared/lib/anthropic.ts), [modules/llm/api/suggestSpellingCorrection.ts](src/modules/llm/api/suggestSpellingCorrection.ts), [modules/llm/hooks/useSpellingSuggestionQuery.ts](src/modules/llm/hooks/useSpellingSuggestionQuery.ts), [SpellingSuggestion.tsx](src/modules/book/components/search/SpellingSuggestion.tsx)

### 3. API 응답값 없을 경우 대응

카카오 API가 특정 필드를 비워서 내려주는 경우에도 화면이 깨지지 않도록 방어했습니다.

- 가격(`price`/`sale_price`)이 없으면 0 또는 `undefined`로 안전하게 변환하고, 표시할 때도 `null`/`undefined`면 "가격 정보 없음"으로 보여줍니다.
- 표지 이미지가 없거나 로드에 실패하면 기본 이미지(`public/book_placeholder.jpg`)로 대체합니다.
- 구매 링크(`url`)가 없는 책은 "구매하기" 클릭 시 새 탭을 열지 않고 "판매가 종료된 도서입니다." 안내만 띄웁니다.

관련 코드: [bookMapper.ts](src/modules/book/api/bookMapper.ts), [formatPrice.ts](src/modules/book/utils/formatPrice.ts), [BookImageFrame.tsx](src/modules/book/components/bookList/BookImageFrame.tsx), [BookListItem.tsx](src/modules/book/components/bookList/BookListItem.tsx)

### 4. 찜 목록 정렬

"내가 찜한 책" 탭에서 최신 순(찜한 순서 그대로) / 가격 높은 순 / 가격 낮은 순으로 정렬할 수 있습니다. 정렬은 화면 표시용으로만 적용되고, 저장소에 쌓인 찜 목록의 순서(최신순 기준)는 그대로 유지됩니다.

관련 코드: [favoritesSort.ts](src/modules/book/constants/favoritesSort.ts), [useFavoritesPanel.ts](src/modules/book/hooks/useFavoritesPanel.ts)

## 마치며

먼저 과제 기회를 주셔서 감사합니다.
최대한 제가 평소에 개발하는 구조와 방식을 사용하며, 실제 서비스에 일부 기능이라고 생각하고 개발했습니다.
유지보수 및 혹시 모를 피벗에 유연하게 대응하기 위해 도메인 단위 폴더 구조를 가져가며,
ui 코드와 비즈니스 로직은 섞이지 않고, 분리하려고 했습니다.
코드를 작성할 때는 AI를 활용하였고, 코드는 직접 리뷰하고 불 필요하거나, 수정할 부분이 있다면 제가 수정했습니다.

실제 유저와 최접점에 맞닿아 있는 프론트엔드 개발자는 실제 서비스 개발 과정에서 단순히 전달 받은 피그마 시안대로 구현하는 것만이 아니라, 유저를 위한 편의 기능, 성능을 고려하며 역 제안도 할 수 있어야 한다고 생각합니다.
그래서 피그마 시안대로 최대한 구현하되, 여러 가지 기능을 넣어 사용자 경험을 향상시켰습니다.

CDRI에 합류하여, Certicos의 신규 서비스 및 기존 서비스를 동료들과 함께 적극적으로 문제를 스스로 정의하고,
그 문제를 해결하면서 성장에 기여하고싶습니다.

감사합니다.
