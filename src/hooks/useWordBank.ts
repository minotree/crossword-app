import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  synonym?: string;
  isQuizUsed?: boolean;
  exampleMeaning?: string;
  isBookmarked?: boolean;
}

const WORDS_KEY = 'wordBank';

const loadWords = (): WordItem[] => {
  const storedWords = localStorage.getItem(WORDS_KEY);
  return storedWords ? JSON.parse(storedWords) : [];
};

const saveWords = (words: WordItem[]) => {
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
};

const useWordBank = () => {
  const [words, setWords] = useState<WordItem[]>(loadWords);

  useEffect(() => {
    saveWords(words);
  }, [words]);

  const addWordsFromCSV = (csv: string) => {
    const results = Papa.parse(csv, {
      header: true,
      dynamicTyping: true,
      transformHeader: (header) => {
        switch (header) {
          case '단어':
            return 'word';
          case '뜻':
            return 'meaning';
          case '품사':
            return 'partOfSpeech';
          case '예문':
            return 'example';
          case '동의어':
            return 'synonym';
          case '학습여부':
            return 'isQuizUsed';
          case '예문해석':
            return 'exampleMeaning';
          default:
            return header;
        }
      },
    });

    const newWords: WordItem[] = results.data.map((row) => ({
      id: row.id || Math.random().toString(36).substr(2, 9),
      word: row.word,
      meaning: row.meaning,
      partOfSpeech: row.partOfSpeech,
      example: row.example,
      synonym: row.synonym,
      isQuizUsed: row.isQuizUsed,
      exampleMeaning: row.exampleMeaning,
      isBookmarked: row.isBookmarked,
    }));

    const deduplicatedWords = newWords.reduce((acc, word) => {
      const existingWord = acc.find((w) => w.word.toLowerCase() === word.word.toLowerCase());
      if (existingWord) {
        existingWord.isQuizUsed = existingWord.isQuizUsed || word.isQuizUsed;
        existingWord.isBookmarked = existingWord.isBookmarked || word.isBookmarked;
      } else {
        acc.push(word);
      }
      return acc;
    }, words);

    setWords(deduplicatedWords);
  };

  const markWordsAsUsed = (wordIds: string[]) => {
    const updatedWords = words.map((word) => {
      if (wordIds.includes(word.id)) {
        return { ...word, isQuizUsed: true };
      }
      return word;
    });
    setWords(updatedWords);
  };

  const getUnusedWords = () => {
    return words.filter((word) => !word.isQuizUsed);
  };

  const resetQuizHistory = () => {
    const resetWords = words.map((word) => ({ ...word, isQuizUsed: false }));
    setWords(resetWords);
  };

  const toggleBookmark = (wordId: string) => {
    const updatedWords = words.map((word) => {
      if (word.id === wordId) {
        return { ...word, isBookmarked: !word.isBookmarked };
      }
      return word;
    });
    setWords(updatedWords);
  };

  const deleteWord = (wordId: string) => {
    const updatedWords = words.filter((word) => word.id !== wordId);
    setWords(updatedWords);
  };

  const getWords = () => {
    return words;
  };

  return {
    words,
    addWordsFromCSV,
    markWordsAsUsed,
    getUnusedWords,
    resetQuizHistory,
    toggleBookmark,
    deleteWord,
    getWords,
  };
};

export default useWordBank;
