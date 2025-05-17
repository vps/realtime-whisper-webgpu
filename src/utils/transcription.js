export const MIN_OVERLAP_WORDS = 3;
export const MAX_OVERLAP_WORDS = 8;

export function cleanTranscription(text) {
  if (!text) return "";
  let cleaned = text.replace(/\[BLANK_AUDIO\]/g, "");
  cleaned = cleaned.replace(/\[[^\]]*\]/g, "");
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.trim();
  return cleaned;
}

export function mergeTranscriptions(previous, current) {
  if (!previous) return current || "";
  if (!current) return previous || "";

  previous = cleanTranscription(previous);
  current = cleanTranscription(current);
  if (!current) return previous;

  if (previous.includes(current)) {
    return previous;
  }
  if (current.includes(previous)) {
    return current;
  }

  const prevWords = previous.split(" ");
  const currWords = current.split(" ");
  for (
    let overlapLength = Math.min(MAX_OVERLAP_WORDS, Math.min(prevWords.length, currWords.length));
    overlapLength >= MIN_OVERLAP_WORDS;
    overlapLength--
  ) {
    const prevEnd = prevWords.slice(-overlapLength).join(" ");
    const currStart = currWords.slice(0, overlapLength).join(" ");
    if (prevEnd === currStart) {
      return previous + " " + currWords.slice(overlapLength).join(" ");
    }
  }

  const similarWordsCount = prevWords
    .slice(-MIN_OVERLAP_WORDS)
    .filter(word => currWords.slice(0, MIN_OVERLAP_WORDS).includes(word))
    .length;
  if (similarWordsCount >= MIN_OVERLAP_WORDS * 0.85) {
    return previous + " " + currWords.slice(MIN_OVERLAP_WORDS).join(" ");
  }

  const lastChar = previous[previous.length - 1];
  if ([".", "!", "?"].includes(lastChar)) {
    return previous + " " + current;
  }

  const lastWord = prevWords[prevWords.length - 1];
  const firstWord = currWords[0];
  if (lastWord === firstWord) {
    return previous + " " + currWords.slice(1).join(" ");
  }

  const combined = previous + " " + current;
  const deduped = combined.replace(/\b(\w+\s+\w+)\s+\1\b/g, "$1");
  return deduped;
}
