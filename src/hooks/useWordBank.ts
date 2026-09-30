import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface WordItem {
  id: string;
  word: string;
  clue: string;
  meaning?: string;
  partOfSpeech?: string;
  example?: string;
  exampleMeaning?: string;
  isUsed?: boolean;
  isQuizUsed?: boolean;
}

const STORAGE_KEY = 'crossword_word_bank';

export const useWordBank = () => {
  const [words, setWords] = useState<WordItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (w): w is WordItem =>
          Boolean(w) && typeof w.word === 'string' && w.word.trim() !== ''
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words]);

  const addWordsFromCSV = (csvText: string) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        const cleaned = header ? header.trim() : '';
        switch (cleaned) {
          case '단어': return 'word';
          case '뜻': return 'meaning';
          case '품사': return 'partOfSpeech';
          case '예문': return 'example';
          case '동의어': return 'synonym';
          case '학습여부': return 'isQuizUsed';
          case '예문해석': return 'exampleMeaning';
          default: return cleaned;
        }
      },
      complete: (results) => {
        const rawData = results.data as any[];
        if (!Array.isArray(rawData)) return;

        const validNewWords: WordItem[] = [];

        rawData.forEach((row) => {
          if (!row || typeof row.word !== 'string') return;
          const wordStr = row.word.trim();
          if (!wordStr) return;

          const meaningStr = row.meaning ? String(row.meaning).trim() : '뜻 없음';

          const isDuplicateInCurrent = words.some(
            (w) => Boolean(w?.word) && w.word.toLowerCase() === wordStr.toLowerCase()
          );
          const isDuplicateInNew = validNewWords.some(
            (w) => Boolean(w?.word) && w.word.toLowerCase() === wordStr.toLowerCase()
          );

          if (!isDuplicateInCurrent && !isDuplicateInNew) {
            validNewWords.push({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              word: wordStr.toUpperCase(),
              clue: meaningStr,
              meaning: meaningStr,
              partOfSpeech: row.partOfSpeech ? String(row.partOfSpeech).trim() : '',
              example: row.example ? String(row.example).trim() : '',
              exampleMeaning: row.exampleMeaning ? String(row.exampleMeaning).trim() : '',
              isUsed: false,
              isQuizUsed: false,
            });
          }
        });

        if (validNewWords.length > 0) {
          setWords((prev) => [...prev, ...validNewWords]);
        }
      },
      error: (err: any) => {
        console.error('CSV Parsing Error:', err);
      },
    });
  };

  // 사용된 단어들 isQuizUsed = true 및 isUsed = true 처리 (단일 선언)
  const markWordsAsUsed = (usedIds: string[]) => {
    setWords((prev) =>
      prev.map((w) =>
        usedIds.includes(w.id) ? { ...w, isUsed: true, isQuizUsed: true } : w
      )
    );
  };

  const getBookmarkedWords = () => {
    return words.filter((w) => w.isUsed);
  };

  const clearWords = () => {
    setWords([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    words,
    addWordsFromCSV,
    markWordsAsUsed,
    clearWords,
  };
};

export default useWordBank;
