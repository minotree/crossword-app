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
  // 1. 초기 데이터 로드 시 word가 null/empty인 잘못된 항목 전처리 및 제거
  const [words, setWords] = useState<WordItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      
      // word 속성이 유효한 문자열인 객체만 선별
      return parsed.filter(
        (w): w is WordItem => 
          Boolean(w) && 
          typeof w.word === 'string' && 
          w.word.trim() !== ''
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words]);

  // 2. CSV 파일 등록 처리
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
          // 행 데이터 및 word 값 검증 (null/undefined/non-string 방지)
          if (!row || typeof row.word !== 'string') return;
          const wordStr = row.word.trim();
          if (!wordStr) return;

          const meaningStr = row.meaning ? String(row.meaning).trim() : '뜻 없음';

          // 옵셔널 체이닝과 안전한 조건문으로 중복 체크
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

  const markWordsAsUsed = (usedIds: string[]) => {
    setWords((prev) =>
      prev.map((w) => (usedIds.includes(w.id) ? { ...w, isUsed: true } : w))
    );
  };

  const markWordsAsUsed = (usedIds: string[]) => {
    setWords((prev) =>
      prev.map((w) => (usedIds.includes(w.id) ? { ...w, isQuizUsed: true } : w))
    );
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
