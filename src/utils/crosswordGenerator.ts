import type { WordItem } from '../hooks/useWordBank';

export interface CrosswordCell {
  x: number;
  y: number;
  letter: string;
  num?: number;
  wordId: string;
  direction: 'across' | 'down';
}

export interface CrosswordClue {
  id: string;
  number: number;
  wordId: string;
  word: string;
  clue: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
}

export interface CrosswordGameData {
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
  usedWordIds: string[];
}

export const generateCrosswordGame = (
  wordList: WordItem[],
  gridSize: number = 10
): CrosswordGameData | null => {
  if (!wordList || wordList.length === 0) return null;

// 영문 알파벳 단어만 필터링 + 지정된 그리드 크기(gridSize) 이하의 단어만 선별
const validWords = wordList
  .filter(
    (item) =>
      item.word &&
      /^[A-Za-z]+$/.test(item.word.trim()) &&
      item.word.trim().length <= gridSize // 핵심: 그리드 크기보다 긴 단어 제외
  )
  .map((item) => ({
    ...item,
    wordStr: item.word.toUpperCase().trim(),
  }))
  .sort((a, b) => b.wordStr.length - a.wordStr.length);

  if (validWords.length === 0) return null;

  const grid: (CrosswordCell | null)[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));

  const placedWords: {
    wordId: string;
    word: string;
    clue: string;
    row: number;
    col: number;
    direction: 'across' | 'down';
  }[] = [];

  // 배치 안전 검사
  const canPlaceWord = (
    word: string,
    row: number,
    col: number,
    direction: 'across' | 'down'
  ): boolean => {
    const len = word.length;

    if (direction === 'across') {
      if (col < 0 || col + len > gridSize || row < 0 || row >= gridSize) return false;
      if (col > 0 && grid[row][col - 1] !== null) return false;
      if (col + len < gridSize && grid[row][col + len] !== null) return false;

      let hasIntersection = placedWords.length === 0;

      for (let i = 0; i < len; i++) {
        const c = col + i;
        if (c < 0 || c >= gridSize) return false;
        const currentCell = grid[row][c];

        if (currentCell !== null) {
          if (currentCell.letter !== word[i]) return false;
          hasIntersection = true;
        } else {
          if (row > 0 && grid[row - 1][c] !== null) return false;
          if (row + 1 < gridSize && grid[row + 1][c] !== null) return false;
        }
      }
      return hasIntersection;
    } else {
      // 'down' 방향
      if (row < 0 || row + len > gridSize || col < 0 || col >= gridSize) return false;
      if (row > 0 && grid[row - 1][col] !== null) return false;
      if (row + len < gridSize && grid[row + len][col] !== null) return false;

      let hasIntersection = placedWords.length === 0;

      for (let i = 0; i < len; i++) {
        const r = row + i;
        if (r < 0 || r >= gridSize) return false;
        const currentCell = grid[r][col];

        if (currentCell !== null) {
          if (currentCell.letter !== word[i]) return false;
          hasIntersection = true;
        } else {
          if (col > 0 && grid[r][col - 1] !== null) return false;
          if (col + 1 < gridSize && grid[r][col + 1] !== null) return false;
        }
      }
      return hasIntersection;
    }
  };

  // 안전한 단어 주입 (경계값 조건 강화)
  const placeWord = (
    item: (typeof validWords)[0],
    row: number,
    col: number,
    direction: 'across' | 'down'
  ) => {
    const word = item.wordStr;
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;

      // 배열 범위를 벗어나지 않도록 방어 코드
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r]) {
        if (!grid[r][c]) {
          grid[r][c] = {
            x: c,
            y: r,
            letter: word[i],
            wordId: item.id,
            direction,
          };
        }
      }
    }

    placedWords.push({
      wordId: item.id,
      word,
      clue: item.clue || item.meaning || '힌트 없음',
      row,
      col,
      direction,
    });
  };

  // 1. 첫 번째 단어 안전하게 배치
  const firstItem = validWords[0];
  const startR = 0;
  const startC = 0;

  placeWord(firstItem, startR, startC, 'down');

  // 2. 나머지 단어 교차 배치
  const remaining = validWords.slice(1);

  for (const item of remaining) {
    let bestPlacement: { row: number; col: number; direction: 'across' | 'down' } | null = null;

    for (const placed of placedWords) {
      const nextDir: 'across' | 'down' = placed.direction === 'across' ? 'down' : 'across';

      for (let i = 0; i < placed.word.length; i++) {
        const pR = placed.direction === 'across' ? placed.row : placed.row + i;
        const pC = placed.direction === 'across' ? placed.col + i : placed.col;

        for (let j = 0; j < item.wordStr.length; j++) {
          if (placed.word[i] === item.wordStr[j]) {
            const candidateR = nextDir === 'down' ? pR - j : pR;
            const candidateC = nextDir === 'across' ? pC - j : pC;

            if (canPlaceWord(item.wordStr, candidateR, candidateC, nextDir)) {
              bestPlacement = { row: candidateR, col: candidateC, direction: nextDir };
              break;
            }
          }
        }
        if (bestPlacement) break;
      }
      if (bestPlacement) break;
    }

    if (bestPlacement) {
      placeWord(item, bestPlacement.row, bestPlacement.col, bestPlacement.direction);
    }
  }

  // 3. 번호 할당 및 Clue 생성
  const clues: CrosswordClue[] = [];
  let clueNumber = 1;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const startingAcross = placedWords.find(
        (w) => w.row === r && w.col === c && w.direction === 'across'
      );
      const startingDown = placedWords.find(
        (w) => w.row === r && w.col === c && w.direction === 'down'
      );

      if (startingAcross || startingDown) {
        const assignedNum = clueNumber++;

        if (grid[r] && grid[r][c]) {
          grid[r][c]!.num = assignedNum;
        }

        if (startingAcross) {
          clues.push({
            id: `clue-${startingAcross.wordId}-across`,
            number: assignedNum,
            wordId: startingAcross.wordId,
            word: startingAcross.word,
            clue: startingAcross.clue,
            direction: 'across',
            row: r,
            col: c,
          });
        }

        if (startingDown) {
          clues.push({
            id: `clue-${startingDown.wordId}-down`,
            number: assignedNum,
            wordId: startingDown.wordId,
            word: startingDown.word,
            clue: startingDown.clue,
            direction: 'down',
            row: r,
            col: c,
          });
        }
      }
    }
  }

  return {
    grid,
    clues,
    usedWordIds: placedWords.map((w) => w.wordId),
  };
};

export default generateCrosswordGame;