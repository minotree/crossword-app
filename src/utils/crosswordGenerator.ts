export interface WordItem {
  id: string;
  word: string;
  clue: string;
}

export interface CrosswordCell {
  row: number;
  col: number;
  letter: string;
  wordId?: string;
  number?: number;
}

export interface CrosswordClue {
  wordId: string;
  number: number;
  clue: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
  word: string;
}

export interface CrosswordGameData {
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
}

export const generateCrosswordGame = (
  wordList: WordItem[],
  gridSize: number = 10
): CrosswordGameData => {
  const size = Math.max(8, Math.min(12, gridSize));
  const grid: (CrosswordCell | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

  const clues: CrosswordClue[] = [];
  let clueCounter = 1;

  if (!wordList || wordList.length === 0) return { grid, clues };

  // 단어 정렬 (긴 단어 우선) 및 무작위 셔플
  const cleanWords = wordList
    .map((w) => ({ ...w, word: w.word.toUpperCase().replace(/[^A-Z]/g, '') }))
    .filter((w) => w.word.length >= 2 && w.word.length <= size)
    .sort(() => Math.random() - 0.5);

  if (cleanWords.length === 0) return { grid, clues };

  const numberMap: { [key: string]: number } = {};
  const getOrAssignNumber = (r: number, c: number) => {
    const key = `${r},${c}`;
    if (!numberMap[key]) {
      numberMap[key] = clueCounter++;
    }
    return numberMap[key];
  };

  // 1. 첫 번째 단어 중앙 배치
  const first = cleanWords[0];
  const startRow = Math.floor(size / 3);
  const startCol = Math.max(0, Math.floor((size - first.word.length) / 2));
  const firstNum = getOrAssignNumber(startRow, startCol);

  clues.push({
    wordId: first.id,
    number: firstNum,
    clue: first.clue,
    direction: 'across',
    row: startRow,
    col: startCol,
    word: first.word,
  });

  for (let i = 0; i < first.word.length; i++) {
    grid[startRow][startCol + i] = {
      row: startRow,
      col: startCol + i,
      letter: first.word[i],
      wordId: first.id,
      number: i === 0 ? firstNum : undefined,
    };
  }

  // 2. 루프를 돌며 다중 교차 배치 시도 (최대 5회 순회하여 밀도 증가)
  for (let pass = 0; pass < 3; pass++) {
    for (let wIdx = 1; wIdx < cleanWords.length; wIdx++) {
      const target = cleanWords[wIdx];
      if (clues.some((c) => c.wordId === target.id)) continue;

      let placed = false;

      // 그리드 전체 탐색
      for (let r = 0; r < size && !placed; r++) {
        for (let c = 0; c < size && !placed; c++) {
          const cell = grid[r][c];
          if (!cell) continue;

          const charIdx = target.word.indexOf(cell.letter);
          if (charIdx === -1) continue;

          // 세로 배치 시도
          const vStart = r - charIdx;
          if (
            vStart >= 0 &&
            vStart + target.word.length <= size &&
            canPlaceVert(grid, target.word, vStart, c, r, size)
          ) {
            const num = getOrAssignNumber(vStart, c);
            clues.push({
              wordId: target.id,
              number: num,
              clue: target.clue,
              direction: 'down',
              row: vStart,
              col: c,
              word: target.word,
            });

            for (let i = 0; i < target.word.length; i++) {
              const currR = vStart + i;
              const existing = grid[currR][c];
              grid[currR][c] = {
                row: currR,
                col: c,
                letter: target.word[i],
                wordId: target.id,
                number: existing?.number || (i === 0 ? num : undefined),
              };
            }
            placed = true;
          }

          // 가로 배치 시도
          if (!placed) {
            const hStart = c - charIdx;
            if (
              hStart >= 0 &&
              hStart + target.word.length <= size &&
              canPlaceHoriz(grid, target.word, r, hStart, c, size)
            ) {
              const num = getOrAssignNumber(r, hStart);
              clues.push({
                wordId: target.id,
                number: num,
                clue: target.clue,
                direction: 'across',
                row: r,
                col: hStart,
                word: target.word,
              });

              for (let i = 0; i < target.word.length; i++) {
                const currC = hStart + i;
                const existing = grid[r][currC];
                grid[r][currC] = {
                  row: r,
                  col: currC,
                  letter: target.word[i],
                  wordId: target.id,
                  number: existing?.number || (i === 0 ? num : undefined),
                };
              }
              placed = true;
            }
          }
        }
      }
    }
  }

  return { grid, clues };
};

const canPlaceVert = (
  grid: (CrosswordCell | null)[][],
  word: string,
  startR: number,
  col: number,
  intersectR: number,
  size: number
) => {
  if (startR > 0 && grid[startR - 1][col] !== null) return false;
  if (startR + word.length < size && grid[startR + word.length][col] !== null) return false;

  for (let i = 0; i < word.length; i++) {
    const r = startR + i;
    const cell = grid[r][col];

    if (r === intersectR) {
      if (!cell || cell.letter !== word[i]) return false;
    } else {
      if (cell !== null) return false;
      if (col > 0 && grid[r][col - 1] !== null) return false;
      if (col < size - 1 && grid[r][col + 1] !== null) return false;
    }
  }
  return true;
};

const canPlaceHoriz = (
  grid: (CrosswordCell | null)[][],
  word: string,
  row: number,
  startC: number,
  intersectC: number,
  size: number
) => {
  if (startC > 0 && grid[row][startC - 1] !== null) return false;
  if (startC + word.length < size && grid[row][startC + word.length] !== null) return false;

  for (let i = 0; i < word.length; i++) {
    const c = startC + i;
    const cell = grid[row][c];

    if (c === intersectC) {
      if (!cell || cell.letter !== word[i]) return false;
    } else {
      if (cell !== null) return false;
      if (row > 0 && grid[row - 1][c] !== null) return false;
      if (row < size - 1 && grid[row + 1][c] !== null) return false;
    }
  }
  return true;
};