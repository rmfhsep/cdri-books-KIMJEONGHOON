interface IconChevronProps {
  size?: number;
  className?: string;
  direction?: "up" | "down";
}

/**
 * 펼침·접힘 방향을 표시하는 장식용 화살표.
 * @param props.size 너비이며 높이는 원본의 14:8 비율로 계산한다.
 * @param props.direction 기본 방향은 down이다.
 */
export const IconChevron = ({
  size = 14,
  className = "",
  direction = "down",
}: IconChevronProps) => {
  return (
    <svg
      width={size}
      height={(size * 8) / 14}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 -5.24537e-07L7 5L12 -8.74228e-08L14 1L7 8L-4.37114e-08 0.999999L2 -5.24537e-07Z"
        fill="var(--color-ui-gray)"
        transform={direction === "up" ? "rotate(180 7 4)" : undefined}
      />
    </svg>
  );
};
