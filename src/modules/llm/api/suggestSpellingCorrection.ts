import { askClaude } from "@/shared/lib/anthropic";

const SYSTEM_PROMPT =
  "입력된 한국어 단어나 문장에 오타나 띄어쓰기 오류가 있으면 교정한 결과만 답해. 설명, 따옴표, 문장부호를 붙이지 마. 교정할 부분이 없거나 올바른 교정을 확신할 수 없으면 NONE이라고만 답해.";

/**
 * 입력 텍스트의 오타를 교정한 결과를 제안한다. 교정할 게 없거나 실패하면 null을 반환한다.
 * @param text 교정 대상 텍스트.
 * @example
 * const suggestion = await suggestSpellingCorrection("프론트에드"); // "프론트엔드"
 */
export const suggestSpellingCorrection = async (
  text: string,
): Promise<string | null> => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const suggestion = await askClaude({
    system: SYSTEM_PROMPT,
    prompt: trimmed,
  });
  if (!suggestion || suggestion === "NONE" || suggestion === trimmed)
    return null;
  return suggestion;
};
