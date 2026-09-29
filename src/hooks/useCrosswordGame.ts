import { useState, useEffect } from 'react';
import type { CrosswordCell, CrosswordClue } from '../utils/crosswordGenerator';

interface UseCrosswordGameProps {
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
}

interface UseCrosswordGameState {
  activeCell: { x: number; y: number } | null;
  activeDirection: 'across' | 'down';
  userInputs: { [key: string]: string };
  setActiveCell: (cell: { x: number; y: number } | null) => void;
  toggleDirection: () => void;
  handleInputChange: (x: number, y: number, val: string) => void;
  handleKeyDown: (e: React.KeyboardEvent, x: number, y: number) => void;
}

export const useCrosswordGame = ({
  grid,
  clues,
}: UseCrosswordGameProps): UseCrosswordGameState => {
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<'across' | 'down'>('across');
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (activeCell) {
      const cell = grid[activeCell.y][activeCell.x];
      if (cell) {
        const clue = clues.find(
          (clue) =>
            clue.wordId === cell.wordId &&
            clue.direction === activeDirection
        );
        if (clue) {
          setActiveClue(clue);
        }
      }
    }
  }, [activeCell, activeDirection, clues, grid]);

  const handleInputChange = (x: number, y: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const key = `${x},${y}`;
    setUserInputs((prev) => ({ ...prev, [key]: char }));

    // Move focus to the next cell in the active direction
    const nextCell = getNextCell(x, y, activeDirection);
    if (nextCell) {
      const [nextX, nextY] = nextCell;
      const nextInput = document.getElementById(`cell-${nextX}-${nextY}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (e.key === 'Backspace' && !userInputs[`${x},${y}`]) {
      const prevCell = getPrevCell(x, y, activeDirection);
      if (prevCell) {
        const [prevX, prevY] = prevCell;
        const prevInput = document.getElementById(`cell-${prevX}-${prevY}`);
        if (prevInput) (prevInput as HTMLInputElement).focus();
      }
    } else if (e.key === 'ArrowUp') {
      moveFocus(x, y, 'up');
    } else if (e.key === 'ArrowDown') {
      moveFocus(x, y, 'down');
    } else if (e.key === 'ArrowLeft') {
      moveFocus(x, y, 'left');
    } else if (e.key === 'ArrowRight') {
      moveFocus(x, y, 'right');
    }
  };

  const toggleDirection = () => {
    setActiveDirection((prev) => (prev === 'across' ? 'down' : 'across'));
  };

  const getNextCell = (x: number, y: number, direction: 'across' | 'down'): [number, number] | null => {
    // Implement logic to find the next non-black cell in the given direction
    // ...
  };

  const getPrevCell = (x: number, y: number, direction: 'across' | 'down'): [number, number] | null => {
    // Implement logic to find the previous non-black cell in the given direction
    // ...
  };

  const moveFocus = (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right') => {
    // Implement logic to move focus to the adjacent non-black cell in the given direction
    // ...
  };

  return {
    activeCell,
    activeDirection,
    userInputs,
    setActiveCell,
    toggleDirection,
    handleInputChange,
    handleKeyDown,
  };
};
