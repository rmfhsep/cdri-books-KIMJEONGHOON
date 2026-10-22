import type { FocusEvent, Ref } from "react";
import { IconChevron } from "@/shared/components/icons/IconChevron";

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef?: Ref<HTMLButtonElement>;
  className?: string;
}

/**
 * 토글 버튼과 옵션 목록으로 구성된 공통 셀렉트. 열림 상태는 부모가 제어한다.
 * @param props.open 옵션 목록 표시 여부.
 * @param props.onOpenChange 토글 클릭, 옵션 바깥으로 포커스 이동 시 호출한다.
 */
export const Select = <T extends string>({
  options,
  value,
  onChange,
  open,
  onOpenChange,
  triggerRef,
  className = "",
}: SelectProps<T>) => {
  const current = options.find((option) => option.value === value);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    onOpenChange(false);
  };

  return (
    <div className={`relative shrink-0 ${className}`} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex h-9 w-full cursor-pointer items-center justify-between border-b border-ui-border px-2 text-body2Bold leading-5.5"
      >
        {current?.label}
        <IconChevron size={10} />
      </button>
      {open && (
        <ul className="absolute top-10.5 z-10 w-full bg-palette-white shadow-[0_0_4px_rgba(0,0,0,0.25)]">
          {options
            .filter((option) => option.value !== value)
            .map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  className="h-7.5 w-full cursor-pointer px-2 text-left text-body2 leading-5.5 text-text-subtitle"
                >
                  {option.label}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
