import { extendTailwindMerge } from "tailwind-merge";

// tokens.css에 정의한 글자 크기·모서리 토큰을 알려줘야 글자 색 클래스와 구분해서 합친다.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "title1",
        "title2",
        "title3",
        "body1",
        "body2",
        "body2Bold",
        "caption",
        "small",
      ],
      radius: ["control", "search"],
    },
  },
});

/**
 * Tailwind 클래스를 합친다. 같은 속성의 클래스가 겹치면 뒤에 온 클래스만 남긴다.
 * @param classes 합칠 클래스. false·undefined는 무시한다.
 * @returns 합친 클래스 문자열.
 * @example
 * cn("h-12 px-5", isSmall && "h-9", className);
 */
export const cn = (...classes: (string | false | null | undefined)[]) =>
  twMerge(classes);
