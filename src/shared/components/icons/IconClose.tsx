interface IconCloseProps {
  size?: number;
  className?: string;
}

/**
 * 닫기·삭제 동작에 사용하는 장식용 아이콘. 색상은 부모의 글자색을 따른다.
 */
export const IconClose = ({ size = 20, className = "" }: IconCloseProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14.658 4.1667L10 8.825L5.342 4.1667L4.167 5.3417L8.825 10L4.167 14.6583L5.342 15.8333L10 11.175L14.658 15.8333L15.833 14.6583L11.175 10L15.833 5.3417L14.658 4.1667Z" />
    </svg>
  );
};
