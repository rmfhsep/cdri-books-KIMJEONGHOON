import { IconButton } from "@/shared/components/button/IconButton";
import { IconLike } from "@/shared/components/icons/IconLike";

interface BookImageFrameProps {
  thumbnail: string;
  title: string;
  isLiked: boolean;
  onLike: () => void;
  size?: "sm" | "lg";
}

/**
 * 도서 표지와 찜 버튼을 표시한다.
 * @param props.size sm은 목록용 표지와 16px 하트, lg는 상세용 표지와 24px 하트를 사용한다.
 * @param props.onLike 찜 버튼 클릭을 알린다. 찜 상태는 부모가 관리한다.
 */
export function BookImageFrame({
  thumbnail,
  title,
  isLiked,
  onLike,
  size = "sm",
}: BookImageFrameProps) {
  const isSmall = size === "sm";
  return (
    <div
      className={`relative shrink-0 ${isSmall ? "h-[68px] w-12" : "h-[280px] w-[210px]"}`}
    >
      <img
        src={thumbnail || undefined}
        alt={title}
        width={isSmall ? 48 : 210}
        height={isSmall ? 68 : 280}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <IconButton
        aria-label={`${title} ${isLiked ? "찜 해제" : "찜하기"}`}
        aria-pressed={isLiked}
        onClick={onLike}
        className={`absolute ${isSmall ? "top-0 right-0" : "top-2 right-2"}`}
      >
        <IconLike size={isSmall ? 16 : 24} isOn={isLiked} />
      </IconButton>
    </div>
  );
}
