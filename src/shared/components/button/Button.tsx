import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

interface ButtonProps extends ComponentProps<"button"> {
  color?: "primary" | "secondary";
  variant?: "solid" | "outline";
  size?: "sm" | "md";
}

const COLOR_STYLES = {
  primary: "bg-palette-primary text-palette-white",
  secondary: "bg-palette-lightGray text-text-secondary",
};

const SIZE_STYLES = {
  sm: "h-[35.27px] px-2.5 py-1.25 text-body2",
  md: "h-12 px-5 py-3.25 text-caption",
};

/**
 * 버튼의 크기와 색상, 테두리 형태를 공통으로 제공한다.
 * @param props.variant outline은 color와 무관하게 테두리 스타일을 사용한다.
 * @param props.className 기본 스타일과 겹치는 클래스는 className 값으로 덮어쓴다.
 * @param props.children 버튼 문구와 필요한 아이콘을 함께 전달한다.
 */
export const Button = ({
  color = "primary",
  variant = "solid",
  size = "md",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const appearance =
    variant === "outline"
      ? "border border-text-subtitle bg-transparent text-text-subtitle"
      : COLOR_STYLES[color];

  return (
    <button
      {...props}
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-control whitespace-nowrap",
        appearance,
        SIZE_STYLES[size],
        className,
      )}
    >
      {children}
    </button>
  );
};
