import type { ComponentProps } from "react";

interface IconButtonProps extends ComponentProps<"button"> {
  "aria-label": string;
}

/**
 * 아이콘만 표시하는 버튼.
 * @param props 반드시 aria-label로 버튼의 동작을 설명한다.
 */
export function IconButton({
  type = "button",
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`inline-flex shrink-0 items-center justify-center cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
