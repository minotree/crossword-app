import React from 'react';
import type { CrosswordCell } from '../utils/crosswordGenerator';

interface CrosswordGridProps {
  grid: (CrosswordCell | null)[][];
  activeCell: { x: number; y: number } | null;
  userInputs: { [key: string]: string };
  isCompleted: boolean;
  onCellClick: (x: number, y: number) => void;
  onInputChange: (x: number, y: number, val: string) => void;
  onKeyDown: (e: React.KeyboardEvent, x: number, y: number) => void;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  activeCell,
  userInputs,
  isCompleted,
  onCellClick,
  onInputChange,
  onKeyDown,
}) => {
  const gridSize = grid.length;

  return (
    <div>
      {isCompleted && (
        <div
          style={{
            backgroundColor: '#4caf50',
            color: '#fff',
            textAlign: 'center',
            padding: '10px',
            marginBottom: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          🎉 축하합니다! 모든 십자낱말을 맞추셨습니다!
        </div>
      )}

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

            const isSelected = activeCell?.x === x && activeCell?.y === y;
            const key = `${x},${y}`;
            const currentVal = userInputs[key] || '';

            let bgColor = '#fff';
            if (isCompleted) {
              bgColor = '#c8e6c9';
            } else if (isSelected) {
              bgColor = '#ffeb3b';
            }

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onCellClick(x, y)}
                style={{
                  position: 'relative',
                  backgroundColor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                      pointerEvents: 'none',
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
                  onChange={(e) => onInputChange(x, y, e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, x, y)}
                  onClick={() => handleWordDetail(cell.wordId)}
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
                    cursor: 'pointer',
                    color: isCompleted ? '#2e7d32' : '#000',
                    backgroundColor: isCompleted && currentVal.toUpperCase() === cell.letter.toUpperCase() ? '#c8e6c9' : bgColor,
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CrosswordGrid;
