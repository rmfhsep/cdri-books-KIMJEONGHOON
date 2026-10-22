interface AskClaudeParams {
  system?: string;
  prompt: string;
  maxTokens?: number;
}

interface ClaudeMessageResponse {
  content: { type: string; text?: string }[];
}

/**
 * Claude Messages API를 호출해 응답 텍스트만 반환한다. 키가 없거나 요청이 실패하면 null을 반환한다.
 * @param params.prompt 사용자 메시지로 보낼 내용.
 * @param params.system 응답 형식을 제한하는 시스템 프롬프트.
 * @param params.maxTokens 응답 토큰 상한. 짧은 답만 필요한 호출을 위해 작게 잡는다.
 * @example
 * const text = await askClaude({ system: "...", prompt: "..." });
 */
export const askClaude = async ({
  system,
  prompt,
  maxTokens = 20,
}: AskClaudeParams): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: maxTokens,
        ...(system && { system }),
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) return null;

    const data: ClaudeMessageResponse = await response.json();
    const text = data.content.find((block) => block.type === "text")?.text;
    return text?.trim() || null;
  } catch {
    return null;
  }
};
