/**
 * 도서 가격을 원화 표시 문자열로 변환한다. API가 가격을 내려주지 않는 경우를 대비해 방어한다.
 * @param price 원 단위 도서 가격.
 * @returns 천 단위 구분 기호와 원을 붙인 가격 문자열.
 * @example
 * formatPrice(13300); // "13,300원"
 */
export const formatPrice = (price: number | undefined | null) => {
  if (price == null) return "가격 정보 없음";
  return `${price.toLocaleString("ko-KR")}원`;
};
