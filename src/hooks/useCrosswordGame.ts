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
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(5); // Initial hint count
  const [startTime, setStartTime] = useState<number>(Date.now());

  // 사용자가 힌트 버튼을 클릭했는지 감지하는 플래그
  const isClueSelectedRef = useRef<boolean>(false);

  // 셀 선택 시 해당 힌트 매칭
  useEffect(() => {
    if (activeCell && grid && grid[activeCell.y]) {
      const cell = grid[activeCell.y][activeCell.x];
      if (cell) {
        // 힌트 목록 버튼을 직접 클릭한 상태라면 방향을 강제로 변경하지 않음
        if (isClueSelectedRef.current) {
          isClueSelectedRef.current = false; // 플래그 초기화
          const exactClue = clues.find(
            (c) => c.wordId === cell.wordId && c.direction === activeDirection
          );
          if (exactClue) setActiveClue(exactClue);
          return;
        }

        // 1순위: 현재 셀의 wordId와 activeDirection이 모두 일치하는 힌트
        let matchedClue = clues.find(
          (c) => c.wordId === cell.wordId && c.direction === activeDirection
        );

        // 2순위: 현재 방향에 일치하는 힌트가 없을 때만 다른 방향의 힌트로 전환
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

  // 완성 여부 검사
  useEffect(() => {
    if (!grid || grid.length === 0) return;

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
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [userInputs, grid]);

  // 가로/세로 방향 전환
  const toggleDirection = () => {
    setActiveDirection((prev) => (prev === 'across' ? 'down' : 'across'));
  };

  // 힌트 선택 시 실행
  const selectClue = (clue: CrosswordClue) => {
    isClueSelectedRef.current = true; // 힌트 직접 선택 플래그 ON
    setActiveClue(clue);
    setActiveDirection(clue.direction); // 가로(across) 또는 세로(down) 정확히 반영

    const targetX = clue.col;
    const targetY = clue.row;
    setActiveCell({ x: targetX, y: targetY });

    const input = document.getElementById(`cell-${targetX}-${targetY}`);
    if (input) {
      (input as HTMLInputElement).focus();
    }
  };

  // 다음 유효한 셀 좌표 반환
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

  // 이전 유효한 셀 좌표 반환
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

  const checkAnswers = () => {
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
      setIsCompleted(true);
      const usedWordIds = clues.map((clue) => clue.wordId);
      markWordsAsUsed(usedWordIds);
      const elapsedTime = Date.now() - startTime;
      const accuracyScore = (filledCount / totalCells) * 100;
      console.log('Elapsed Time:', elapsedTime, 'ms');
      console.log('Accuracy Score:', accuracyScore.toFixed(2), '%');
    }
  };

  const handleInputChange = (x: number, y: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const key = `${x},${y}`;
    setUserInputs((prev) => ({ ...prev, [key]: char }));
    checkAnswers();

    if (char) {
      const next = getNextCell(x, y, activeDirection);
      if (next) {
        setActiveCell(next);
        const nextInput = document.getElementById(`cell-${next.x}-${next.y}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const revealSingleLetterHint = (x: number, y: number) => {
    if (grid[y] && grid[y][x]) {
      const key = `${x},${y}`;
      setUserInputs((prev) => ({ ...prev, [key]: grid[y][x].letter }));
      setHintCount((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (e.key === 'h' && hintCount > 0) {
      revealSingleLetterHint(x, y);
    }
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
    isCompleted,
    setActiveCell,
    selectClue,
    toggleDirection,
    handleInputChange,
    handleKeyDown,
  };
};

export default useCrosswordGame;
