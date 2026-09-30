import { useState, useEffect, useRef } from 'react';
import type { CrosswordCell, CrosswordClue } from '../utils/crosswordGenerator';

interface UseCrosswordGameProps {
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
}

export const useCrosswordGame = ({ grid, clues }: UseCrosswordGameProps) => {
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<'across' | 'down'>('across');
  const [activeClue, setActiveClue] = useState<CrosswordClue | null>(null);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [accuracyScore, setAccuracyScore] = useState<number>(100);

  const startTimeRef = useRef<number>(Date.now());
  const totalAttemptsRef = useRef<number>(0);
  const correctAttemptsRef = useRef<number>(0);
  const isClueSelectedRef = useRef<boolean>(false);

  // 그리드 변경 시 게임 상태 초기화
  useEffect(() => {
    setUserInputs({});
    setIsCompleted(false);
    setHintsLeft(3);
    setElapsedTime(0);
    setAccuracyScore(100);
    startTimeRef.current = Date.now();
    totalAttemptsRef.current = 0;
    correctAttemptsRef.current = 0;
  }, [grid]);

  // 셀 선택 시 해당 힌트 매칭
  useEffect(() => {
    if (activeCell && grid && grid[activeCell.y]) {
      const cell = grid[activeCell.y][activeCell.x];
      if (cell) {
        if (isClueSelectedRef.current) {
          isClueSelectedRef.current = false;
          const exactClue = clues.find(
            (c) => c.wordId === cell.wordId && c.direction === activeDirection
          );
          if (exactClue) setActiveClue(exactClue);
          return;
        }

        let matchedClue = clues.find(
          (c) => c.wordId === cell.wordId && c.direction === activeDirection
        );

        if (!matchedClue) {
          matchedClue = clues.find((c) => c.wordId === cell.wordId);
          if (matchedClue) {
            setActiveDirection(matchedClue.direction);
          }
        }

        if (matchedClue) {
          setActiveClue(matchedClue);
        }
      }
    }
  }, [activeCell, activeDirection, clues, grid]);

  // 게임 완성 검사 및 정확도/소요 시간 계산
  useEffect(() => {
    if (!grid || grid.length === 0 || isCompleted) return;

    let allCorrect = true;
    let filledCount = 0;
    let totalCells = 0;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell) {
          totalCells++;
          const input = userInputs[`${c},${r}`] || '';
          if (input.toUpperCase() === cell.letter.toUpperCase()) {
            filledCount++;
          } else {
            allCorrect = false;
          }
        }
      }
    }

    if (totalCells > 0 && filledCount === totalCells && allCorrect) {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedTime(timeSpent);

      const attempts = totalAttemptsRef.current || totalCells;
      const score = Math.max(0, Math.min(100, Math.round((totalCells / attempts) * 100)));
      setAccuracyScore(score);

      setIsCompleted(true);
    }
  }, [userInputs, grid, isCompleted]);

  // 단일 글자 힌트 보기
  const revealSingleLetterHint = () => {
    if (hintsLeft <= 0 || !activeCell || !grid) return;

    const cell = grid[activeCell.y]?.[activeCell.x];
    if (!cell) return;

    const key = `${activeCell.x},${activeCell.y}`;
    const correctLetter = cell.letter.toUpperCase();

    setUserInputs((prev) => ({ ...prev, [key]: correctLetter }));
    setHintsLeft((prev) => prev - 1);
  };

  const toggleDirection = () => {
    setActiveDirection((prev) => (prev === 'across' ? 'down' : 'across'));
  };

  const selectClue = (clue: CrosswordClue) => {
    isClueSelectedRef.current = true;
    setActiveClue(clue);
    setActiveDirection(clue.direction);

    const targetX = clue.col;
    const targetY = clue.row;
    setActiveCell({ x: targetX, y: targetY });

    const input = document.getElementById(`cell-${targetX}-${targetY}`);
    if (input) {
      (input as HTMLInputElement).focus();
    }
  };

  const getNextCell = (x: number, y: number, dir: 'across' | 'down') => {
    const nextX = dir === 'across' ? x + 1 : x;
    const nextY = dir === 'down' ? y + 1 : y;

    if (
      nextY >= 0 &&
      nextY < grid.length &&
      nextX >= 0 &&
      nextX < grid[0].length &&
      grid[nextY][nextX] !== null
    ) {
      return { x: nextX, y: nextY };
    }
    return null;
  };

  const getPrevCell = (x: number, y: number, dir: 'across' | 'down') => {
    const prevX = dir === 'across' ? x - 1 : x;
    const prevY = dir === 'down' ? y - 1 : y;

    if (
      prevY >= 0 &&
      prevY < grid.length &&
      prevX >= 0 &&
      prevX < grid[0].length &&
      grid[prevY][prevX] !== null
    ) {
      return { x: prevX, y: prevY };
    }
    return null;
  };

  const handleInputChange = (x: number, y: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const key = `${x},${y}`;

    if (char) {
      totalAttemptsRef.current += 1;
      const targetCell = grid[y]?.[x];
      if (targetCell && targetCell.letter.toUpperCase() === char) {
        correctAttemptsRef.current += 1;
      }
    }

    setUserInputs((prev) => ({ ...prev, [key]: char }));

    if (char) {
      const next = getNextCell(x, y, activeDirection);
      if (next) {
        setActiveCell(next);
        const nextInput = document.getElementById(`cell-${next.x}-${next.y}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    const key = `${x},${y}`;

    if (e.key === 'Backspace') {
      if (!userInputs[key]) {
        const prev = getPrevCell(x, y, activeDirection);
        if (prev) {
          setActiveCell(prev);
          const prevInput = document.getElementById(`cell-${prev.x}-${prev.y}`);
          if (prevInput) (prevInput as HTMLInputElement).focus();
        }
      } else {
        setUserInputs((prev) => ({ ...prev, [key]: '' }));
      }
    } else if (e.key === 'ArrowUp') {
      moveFocus(x, y - 1);
    } else if (e.key === 'ArrowDown') {
      moveFocus(x, y + 1);
    } else if (e.key === 'ArrowLeft') {
      moveFocus(x - 1, y);
    } else if (e.key === 'ArrowRight') {
      moveFocus(x + 1, y);
    }
  };

  const moveFocus = (targetX: number, targetY: number) => {
    if (
      targetY >= 0 &&
      targetY < grid.length &&
      targetX >= 0 &&
      targetX < grid[0].length &&
      grid[targetY][targetX] !== null
    ) {
      setActiveCell({ x: targetX, y: targetY });
      const input = document.getElementById(`cell-${targetX}-${targetY}`);
      if (input) (input as HTMLInputElement).focus();
    }
  };

  return {
    activeCell,
    activeDirection,
    activeClue,
    userInputs,
    hintsLeft,
    isCompleted,
    elapsedTime,
    accuracyScore,
    setActiveCell,
    selectClue,
    toggleDirection,
    revealSingleLetterHint,
    handleInputChange,
    handleKeyDown,
  };
};

export default useCrosswordGame;