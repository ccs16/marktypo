import type { DocumentStats } from '../types/editor';

export function calculateDocumentStats(text: string): DocumentStats {
  if (!text || text.trim() === '') {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 1,
      readingTimeMinutes: 0,
    };
  }

  // Total characters
  const characters = text.length;

  // Characters without whitespace
  const charactersNoSpaces = text.replace(/\s+/g, '').length;

  // Chinese character count
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;

  // Non-Chinese / Western words count
  const nonChineseText = text.replace(/[\u4e00-\u9fa5]/g, ' ');
  const westernWords = (nonChineseText.match(/[a-zA-Z0-9_\-]+/g) || []).length;

  // Total words count (Chinese character + Western word)
  const words = chineseChars + westernWords;

  // Lines count
  const lines = text.split('\n').length;

  // Estimated reading time (average 300 words/chars per minute for Chinese & English)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 300));

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    readingTimeMinutes,
  };
}
