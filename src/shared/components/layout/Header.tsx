import { cn } from "@/shared/utils/cn";

interface HeaderProps {
  menus: { label: string; path: string }[];
  activePath?: string;
  onNavigate: (path: string) => void;
}

/**
 * 로고와 메뉴를 표시하는 헤더.
 * @param props.menus 메뉴 이름과 이동 경로. 로고를 누르면 첫 번째 메뉴로 이동한다.
 * @param props.activePath 현재 경로. 같은 경로의 메뉴에 밑줄을 표시한다.
 * @param props.onNavigate 선택한 메뉴의 경로를 전달한다.
 */
export const Header = ({ menus, activePath, onNavigate }: HeaderProps) => {
  const handleLogoClick = () => {
    onNavigate(menus[0].path);
  };

  return (
    <header className="bg-palette-white">
      <div className="mx-auto flex max-w-400 flex-col gap-6 px-4 py-6 lg:h-20 lg:flex-row lg:items-center lg:gap-100 lg:px-0 lg:py-0 max-[1631px]:lg:px-4">
        <button
          type="button"
          onClick={handleLogoClick}
          className="w-fit shrink-0 cursor-pointer text-title1"
        >
          CERTICOS BOOKS
        </button>
        <nav className="flex gap-14 text-body1">
          {menus.map((menu) => {
            const active = menu.path === activePath;
            return (
              <button
                key={menu.path}
                type="button"
                onClick={() => onNavigate(menu.path)}
                className={cn(
                  "h-8 cursor-pointer whitespace-nowrap pb-2",
                  active &&
                    "shadow-[inset_0_-1px_0_var(--color-palette-primary)]",
                )}
              >
                {menu.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
