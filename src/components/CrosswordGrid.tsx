import React from 'react';

interface CrosswordGridProps {
  grid: any[][];
  userInputs?: { [key: string]: string };
  activeCell?: { x: number; y: number } | null;
  onCellClick?: (x: number, y: number) => void;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid = [],
  userInputs = {},
  activeCell = null,
  onCellClick = () => {},
}) => {
  if (!Array.isArray(grid) || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0]?.length || rows;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
        aspectRatio: '1 / 1',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '2px',
        backgroundColor: '#333',
        border: '2px solid #333',
        borderRadius: '4px',
        boxSizing: 'border-box',
      }}
    >
      {grid.map((rowArr, rIdx) =>
        rowArr.map((cell, cIdx) => {
          const isPlayable = cell !== null;
          const isActive = activeCell?.x === cIdx && activeCell?.y === rIdx;
          const inputKey = `${cIdx},${rIdx}`;
          const userVal = userInputs[inputKey] || '';

          if (!isPlayable) {
            return (
              <div
                key={`empty-${rIdx}-${cIdx}`}
                style={{ backgroundColor: '#222', width: '100%', height: '100%' }}
              />
            );
          }

          // 정답 문자가 담겨있는 속성 확인 (char, letter, val, value, answer 등)
          const targetChar =
            cell.char || cell.letter || cell.val || cell.value || cell.answer || '';

          // 디버깅용 콘솔 출력 (입력값이 있을 때)
          //if (userVal) {
          //  console.log(`Cell[${cIdx},${rIdx}] - User: "${userVal}", TargetChar: "${targetChar}", CellObj:`, cell);
          //}

          const isCorrect =
            isPlayable &&
            targetChar &&
            userVal.trim().length > 0 &&
            userVal.toUpperCase() === targetChar.toUpperCase();

          let bgColor = '#ffffff';
          let borderColor = '#ccc';

          if (isCorrect) {
            bgColor = '#d4edda'; // 연한 초록색
            borderColor = '#c3e6cb';
          } else if (isActive) {
            bgColor = '#e3f2fd'; // 선택된 칸 파란색
            borderColor = '#1976d2';
          }

          return (
            <div
              key={`cell-${rIdx}-${cIdx}`}
              onClick={() => onCellClick(cIdx, rIdx)}
              style={{
                position: 'relative',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {/* 셀 좌측 상단 번호 표시 */}
              {cell.number && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '3px',
                    fontSize: cols > 10 ? '9px' : '11px',
                    fontWeight: 'bold',
                    color: '#444',
                    lineHeight: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {cell.number}
                </span>
              )}

              {/* 글자 표시 입력창 */}
              <input
                id={`cell-${cIdx}-${rIdx}`}
                type="text"
                readOnly
                value={userVal}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  fontSize: cols > 10 ? '14px' : '18px',
                  fontWeight: 'bold',
                  color: isCorrect ? '#155724' : '#000',
                  textTransform: 'uppercase',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  pointerEvents: 'none',
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