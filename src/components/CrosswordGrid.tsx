import React, { useState, useEffect } from 'react';
import type { CrosswordCell, CrosswordClue } from '../utils/crosswordGenerator';
import { useCrosswordGame } from '../hooks/useCrosswordGame';

interface CrosswordGridProps {
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
}) => {
  const gridSize = grid.length;
  const {
    activeCell,
    activeDirection,
    userInputs,
    setActiveCell,
    toggleDirection,
    handleInputChange,
    handleKeyDown,
  } = useCrosswordGame({ grid, clues });

  const handleCellClick = (x: number, y: number) => {
    const cell = grid[y][x];
    if (cell) {
      if (activeCell && activeCell.x === x && activeCell.y === y) {
        toggleDirection();
      } else {
        setActiveCell({ x, y });
      }
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
            activeCell &&
            cell.wordId === activeCell.wordId &&
            activeDirection === cell.direction;

          const key = `${x},${y}`;
          const currentVal = userInputs[key] || '';

          return (
            <div
              key={`${x}-${y}`}
              onClick={() => handleCellClick(x, y)}
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
