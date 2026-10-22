import { HEADER_MENUS } from "@/shared/constants/menus";
import { PATHS } from "@/shared/constants/paths";
import { Header } from "@/shared/components/layout/Header";

/** 등록되지 않은 경로에 페이지 안내와 홈 이동 링크를 표시한다. */
export const NotFoundBox = () => {
  // 404 화면에서는 문서를 새로 불러와 해당 화면으로 이동한다.
  const handleNavigate = (path: string) => {
    window.location.assign(path);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header menus={HEADER_MENUS} onNavigate={handleNavigate} />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-title1 leading-snug lg:text-[32px]">
          요청하신 페이지를 찾을 수 없습니다
        </h1>
        <a
          href={PATHS.home}
          className="inline-flex h-14 w-34 items-center justify-center rounded-full border border-palette-primary text-body2 text-primary transition-colors hover:bg-primary"
        >
          홈으로
        </a>
      </main>
    </div>
  );
};
