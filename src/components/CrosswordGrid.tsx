import React, { useState, useEffect } from 'react';
import type { CrosswordCell, CrosswordClue } from '../utils/crosswordGenerator';

interface CrosswordGridProps {
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
  activeClue: CrosswordClue | null;
  onCellClick: (cell: CrosswordCell) => void;
  onComplete?: () => void;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  activeClue,
  onCellClick,
}) => {
  const gridSize = grid.length;
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  const handleInputChange = (x: number, y: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const key = `${x},${y}`;
    setUserInputs((prev) => ({ ...prev, [key]: char }));

    // 자동 다음 셀 포커스 이동 (가로/세로 방향 지원)
    if (char && activeClue) {
      const nextX = activeClue.direction === 'across' ? x + 1 : x;
      const nextY = activeClue.direction === 'down' ? y + 1 : y;
      const nextInput = document.getElementById(`cell-${nextX}-${nextY}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (e.key === 'Backspace' && !userInputs[`${x},${y}`] && activeClue) {
      const prevX = activeClue.direction === 'across' ? x - 1 : x;
      const prevY = activeClue.direction === 'down' ? y - 1 : y;
      const prevInput = document.getElementById(`cell-${prevX}-${prevY}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gap: '2px',
        backgroundColor: '#ccc',
        padding: '2px',
        maxWidth: '500px',
        margin: '0 auto',
        aspectRatio: '1/1',
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) {
            return <div key={`${x}-${y}`} style={{ backgroundColor: '#222' }} />;
          }

          const isHighlighted =
            activeClue &&
            cell.wordId === activeClue.wordId;

          const key = `${x},${y}`;
          const currentVal = userInputs[key] || '';

          return (
            <div
              key={`${x}-${y}`}
              onClick={() => onCellClick(cell)}
              style={{
                position: 'relative',
                backgroundColor: isHighlighted ? '#e3f2fd' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cell.num && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    color: '#555',
                  }}
                >
                  {cell.num}
                </span>
              )}
              <input
                id={`cell-${x}-${y}`}
                type="text"
                maxLength={1}
                value={currentVal}
                onChange={(e) => handleInputChange(x, y, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, x, y)}
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  textTransform: 'uppercase',
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CrosswordGrid;