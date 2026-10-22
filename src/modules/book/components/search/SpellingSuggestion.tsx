import { useSpellingSuggestionQuery } from "@/modules/llm/hooks/useSpellingSuggestionQuery";

interface SpellingSuggestionProps {
  query: string;
  onSearch: (suggestion: string) => void;
}

/** 검색 결과가 없을 때 오타 교정 제안을 조회해 보여준다. */
export const SpellingSuggestion = ({
  query,
  onSearch,
}: SpellingSuggestionProps) => {
  const { data: suggestion } = useSpellingSuggestionQuery(query);

  if (!suggestion) return null;
  return (
    <button
      type="button"
      onClick={() => onSearch(suggestion)}
      className="cursor-pointer text-palette-primary underline"
    >
      혹시 '{suggestion}'을 찾고 계신가요?
    </button>
  );
};
