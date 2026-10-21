import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

interface TextFieldProps extends Omit<ComponentProps<"input">, "children"> {
  label: string;
  leadingIcon?: ReactNode;
}

/**
 * 숨김 레이블과 선택적인 앞쪽 아이콘을 포함한 검색 입력창.
 * @param props.label 화면에는 숨기고 입력창의 접근 가능한 이름으로 사용한다.
 * @param props.className 입력창을 감싸는 바깥 컨테이너에 적용한다.
 */
export function TextField({
  label,
  leadingIcon,
  className = "",
  id,
  type = "text",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <div className="flex h-[50px] items-center gap-[11px] rounded-search bg-palette-lightGray py-2.5 pl-2.5">
        {leadingIcon && (
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          {...props}
          id={inputId}
          type={type}
          className="h-full min-w-0 flex-1 bg-transparent text-caption text-text-primary placeholder:text-text-subtitle"
        />
      </div>
    </div>
  );
}
