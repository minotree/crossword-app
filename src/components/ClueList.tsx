import React from 'react';
import type { CrosswordClue } from '../utils/crosswordGenerator';

interface ClueListProps {
  clues: CrosswordClue[];
  activeClue: CrosswordClue | null;
  onSelectClue: (clue: CrosswordClue) => void;
}

export const ClueList: React.FC<ClueListProps> = ({ clues, activeClue, onSelectClue }) => {
  const acrossClues = clues.filter((c) => c.direction === 'across');
  const downClues = clues.filter((c) => c.direction === 'down');

  return (
    <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
      {/* 가로 힌트 영역 */}
      <div style={{ flex: 1 }}>
        <h3>가로 힌트 (Across)</h3>
        {acrossClues.map((clue) => {
          const isSelected = activeClue?.id === clue.id;
          return (
            <div
              key={clue.id}
              onClick={() => onSelectClue(clue)}
              style={{
                padding: '8px 12px',
                marginBottom: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#0066ff' : '#f4f4f5',
                color: isSelected ? '#ffffff' : '#000000',
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
            >
              {clue.number}. {clue.clue}
            </div>
          );
        })}
      </div>

      {/* 세로 힌트 영역 */}
      <div style={{ flex: 1 }}>
        <h3>세로 힌트 (Down)</h3>
        {downClues.map((clue) => {
          const isSelected = activeClue?.id === clue.id;
          return (
            <div
              key={clue.id}
              onClick={() => onSelectClue(clue)}
              style={{
                padding: '8px 12px',
                marginBottom: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#0066ff' : '#f4f4f5',
                color: isSelected ? '#ffffff' : '#000000',
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
            >
              {clue.number}. {clue.clue}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClueList;