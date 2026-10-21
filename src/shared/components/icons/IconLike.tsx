interface IconLikeProps {
  isOn?: boolean;
  size?: number;
  className?: string;
}

/**
 * 찜 상태를 표시하는 장식용 아이콘.
 * @param props.isOn true면 채운 하트, false면 윤곽 하트를 표시한다. 기본값은 false다.
 * @param props.size 기본값은 24px이며 작은 표지에서는 16px을 사용한다.
 */
export function IconLike({
  isOn = false,
  size = 24,
  className = "",
}: IconLikeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {isOn ? (
        <path
          d="M7.5 4C4.46244 4 2 6.46245 2 9.5C2 15 8.5 20 12 21.1631C15.5 20 22 15 22 9.5C22 6.46245 19.5375 4 16.5 4C14.6398 4 12.9953 4.92345 12 6.3369C11.0047 4.92345 9.36015 4 7.5 4Z"
          fill="var(--color-red)"
          stroke="var(--color-red)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M1 9.5C1 5.91017 3.91015 3 7.5 3C9.24701 3 10.8329 3.68982 12 4.80968C13.1671 3.68982 14.753 3 16.5 3C20.0898 3 23 5.91017 23 9.5C23 12.6341 21.164 15.4994 19.0231 17.6615C16.8724 19.8335 14.2421 21.4718 12.3154 22.1121C12.1106 22.1801 11.8894 22.1801 11.6846 22.1121C9.75788 21.4718 7.12761 19.8335 4.97692 17.6615C2.83596 15.4994 1 12.6341 1 9.5ZM7.5 5C5.01472 5 3 7.01473 3 9.5C3 11.8659 4.41404 14.2506 6.39808 16.2543C8.24453 18.119 10.4368 19.5021 12 20.1011C13.5632 19.5021 15.7555 18.119 17.6019 16.2543C19.586 14.2506 21 11.8659 21 9.5C21 7.01473 18.9853 5 16.5 5C14.9789 5 13.6337 5.75379 12.8176 6.91266C12.6303 7.17865 12.3253 7.3369 12 7.3369C11.6747 7.3369 11.3697 7.17865 11.1824 6.91266C10.3663 5.75379 9.02112 5 7.5 5Z"
          fill="var(--color-palette-gray)"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}
