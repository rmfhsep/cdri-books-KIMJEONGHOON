import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  color?: "primary" | "secondary";
  variant?: "solid" | "outline";
  size?: "sm" | "md";
}

const colorStyles = {
  primary: "bg-palette-primary text-palette-white",
  secondary: "bg-palette-lightGray text-text-secondary",
};

const sizeStyles = {
  sm: "h-[35.27px] px-2.5 py-[5px] text-body2",
  md: "h-12 px-5 py-[13px] text-caption",
};

/**
 * 버튼의 크기와 색상, 테두리 형태를 공통으로 제공한다.
 * @param props.variant outline은 color와 무관하게 테두리 스타일을 사용한다.
 * @param props.children 버튼 문구와 필요한 아이콘을 함께 전달한다.
 */
export function Button({
  color = "primary",
  variant = "solid",
  size = "md",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const appearance =
    variant === "outline"
      ? "border border-text-subtitle bg-transparent text-text-subtitle"
      : colorStyles[color];

  return (
    <button
      {...props}
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-2.5 rounded-control whitespace-nowrap cursor-pointer ${appearance} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
