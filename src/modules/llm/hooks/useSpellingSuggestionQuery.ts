import { useQuery } from "@tanstack/react-query";
import { suggestSpellingCorrection } from "@/modules/llm/api/suggestSpellingCorrection";

/**
 * 입력 텍스트의 맞춤법 교정 제안을 조회한다. 빈 문자열이면 조회하지 않는다.
 * @param text 교정 대상 텍스트.
 * @returns 교정된 단어(없으면 null) 데이터와 조회 상태.
 * @example
 * const { data: suggestion } = useSpellingSuggestionQuery(query);
 */
export const useSpellingSuggestionQuery = (text: string) => {
  return useQuery({
    queryKey: ["llm", "spellingCorrection", text],
    queryFn: () => suggestSpellingCorrection(text),
    enabled: Boolean(text.trim()),
    staleTime: 0,
    retry: false,
  });
};
