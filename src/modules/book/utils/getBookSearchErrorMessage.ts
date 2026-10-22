import { isAxiosError } from "axios";
import type { KakaoErrorResponse } from "@/modules/book/types/bookApi";

/**
 * 카카오 오류 코드와 HTTP 상태를 검색 실패 안내로 변환한다.
 * @param error 검색 쿼리의 오류. 서버 메시지는 그대로 노출하지 않는다.
 * @returns 인증·권한·한도·요청·서버·네트워크 오류에 맞는 안내 문구.
 * @example
 * const message = getBookSearchErrorMessage(query.error);
 */
export const getBookSearchErrorMessage = (error: unknown): string => {
  const fallback = "도서 검색에 실패했습니다. 다시 시도해 주세요.";
  if (!isAxiosError<KakaoErrorResponse>(error)) return fallback;
  if (!error.response) return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";

  const { status, data } = error.response;
  switch (data?.code) {
    case -401:
      return "도서 검색 인증에 실패했습니다. API 키 설정을 확인해 주세요.";
    case -2:
    case -8:
      return "검색 요청이 올바르지 않습니다. 검색 조건을 확인해 주세요.";
    case -3:
    case -5:
      return "도서 검색 권한이 없습니다. API 사용 설정을 확인해 주세요.";
    case -4:
    case -6:
    case -12:
      return "도서 검색 이용이 제한되었습니다. 서비스 설정을 확인해 주세요.";
    case -10:
      return "도서 검색 요청 한도를 초과했습니다. 한도 확인 후 다시 이용해 주세요.";
    case -11:
      return "API 이용 금액 한도를 초과했습니다. 서비스 한도 설정을 확인해 주세요.";
    case -13:
      return "검색 서비스 앱이 비활성 상태입니다. 앱 설정을 확인해 주세요.";
    case -1:
    case -7:
    case -603:
    case -9798:
      return "검색 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해 주세요.";
  }

  if (status === 401)
    return "도서 검색 인증에 실패했습니다. API 키 설정을 확인해 주세요.";
  if (status === 403)
    return "도서 검색 권한이 없습니다. API 사용 설정을 확인해 주세요.";
  if (status === 429)
    return "검색 요청이 많습니다. 잠시 후 다시 시도해 주세요.";
  if (status >= 500)
    return "검색 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해 주세요.";
  if (status === 400)
    return "검색 요청이 올바르지 않습니다. 검색 조건을 확인해 주세요.";
  return fallback;
};
