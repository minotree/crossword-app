import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { refreshOutline, bookOutline } from 'ionicons/icons';
import CrosswordGrid from '../components/CrosswordGrid';
import WordBankModal from '../components/WordBankModal';
import WordInputModal from '../components/WordInputModal';
import useWordBank from '../hooks/useWordBank';
import { generateCrosswordGame } from '../utils/crosswordGenerator';

export const QuizPage: React.FC = () => {
  const { words } = useWordBank();
  const [selectedGridSize, setSelectedGridSize] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClue, setSelectedClue] = useState<any | null>(null);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  const [puzzleData, setPuzzleData] = useState<{
    grid: any[];
    acrossClues: any[];
    downClues: any[];
    allClues: any[];
  }>({
    grid: [],
    acrossClues: [],
    downClues: [],
    allClues: [],
  });

  const loadPuzzle = (size: number) => {
    try {
      const wordItems = words
        .map((w, idx) => ({
          id: w.id || `w-${idx}`,
          word: (w.word || '').toUpperCase().replace(/[^A-Z]/g, ''),
          clue: w.meaning || w.clue || '뜻 없음',
        }))
        .filter((item) => item.word.length >= 2);

      if (!wordItems || wordItems.length === 0) {
        setPuzzleData({ grid: [], acrossClues: [], downClues: [], allClues: [] });
        return;
      }

      let generated = generateCrosswordGame(wordItems, size);
      if (!generated || !generated.grid || generated.grid.length === 0) {
        generated = generateCrosswordGame(wordItems, 10);
      }
      if (!generated || !generated.grid || generated.grid.length === 0) {
        generated = generateCrosswordGame(wordItems, 8);
      }

      if (generated && generated.grid && generated.clues.length > 0) {
        setPuzzleData({
          grid: generated.grid,
          acrossClues: generated.clues.filter((c) => c.direction === 'across'),
          downClues: generated.clues.filter((c) => c.direction === 'down'),
          allClues: generated.clues,
        });
        setUserInputs({});
        setHintsLeft(3);
        setSelectedClue(null);
      } else {
        setPuzzleData({ grid: [], acrossClues: [], downClues: [], allClues: [] });
      }
    } catch (error) {
      setPuzzleData({ grid: [], acrossClues: [], downClues: [], allClues: [] });
    }
  };

  useEffect(() => {
    if (!words || words.length === 0) {
      setPuzzleData({ grid: [], acrossClues: [], downClues: [], allClues: [] });
      setUserInputs({});
    } else {
      loadPuzzle(selectedGridSize);
    }
  }, [words, selectedGridSize]);

  const handleClueClick = (clue: any) => {
    if (!clue) return;
    setSelectedClue(clue);
    setIsInputModalOpen(true);
  };

  const handleWordSubmit = (enteredWord: string) => {
    if (!selectedClue) return;
    const { row, col, direction, word } = selectedClue;
    const isAcross = direction === 'across';
    const newInputs = { ...userInputs };

    for (let i = 0; i < word.length; i++) {
      const targetR = isAcross ? row : row + i;
      const targetC = isAcross ? col + i : col;
      newInputs[`${targetC},${targetR}`] = enteredWord[i] || '';
    }
    setUserInputs(newInputs);
  };

  const getExistingWordValue = (clue: any) => {
    if (!clue || !clue.word) return '';
    const { row, col, direction, word } = clue;
    const isAcross = direction === 'across';
    let result = '';
    for (let i = 0; i < word.length; i++) {
      const targetR = isAcross ? row : row + i;
      const targetC = isAcross ? col + i : col;
      result += userInputs[`${targetC},${targetR}`] || ' ';
    }
    return result;
  };

  const CrosswordComponent = CrosswordGrid as any;
  const isGridReady = Array.isArray(puzzleData.grid) && puzzleData.grid.length > 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>퀴즈 풀기 (십자낱말)</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsModalOpen(true)}>
              <IonIcon slot="icon-only" icon={bookOutline} />
            </IonButton>
            <IonButton onClick={() => loadPuzzle(selectedGridSize)}>
              <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar>
          <IonSegment
            value={selectedGridSize.toString()}
            onIonChange={(e) => {
              const newSize = Number(e.detail.value);
              if (newSize && !isNaN(newSize)) setSelectedGridSize(newSize);
            }}
          >
            <IonSegmentButton value="8">
              <IonLabel>쉬움 (8x8)</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="10">
              <IonLabel>보통 (10x10)</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="12">
              <IonLabel>어려움 (12x12)</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', width: '100%' }}>
            {isGridReady ? (
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <CrosswordComponent
                  grid={puzzleData.grid}
                  userInputs={userInputs}
                  onCellClick={() => {}}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px', width: '100%', maxWidth: '300px' }}>
                <p style={{ fontSize: '14px', color: '#555', marginBottom: '12px' }}>
                  등록된 단어가 없거나 단어장을 불러오는 중입니다.
                </p>
                <IonButton fill="solid" color="primary" onClick={() => setIsModalOpen(true)} size="small">
                  <IonIcon slot="start" icon={bookOutline} />
                  단어장 관리로 이동
                </IonButton>
              </div>
            )}
          </div>

          {isGridReady && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>가로 힌트</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '270px', overflowY: 'auto', paddingRight: '4px' }}>
                  {puzzleData.acrossClues.map((item: any, idx: number) => (
                    <div
                      key={`across-${idx}`}
                      onClick={() => handleClueClick(item)}
                      style={{ padding: '8px 10px', backgroundColor: '#eef3fc', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '1px solid #d0e0f8' }}
                    >
                      <strong>{item?.number}.</strong> {item?.clue} <span style={{ color: '#0066cc', fontWeight: 'bold' }}>({item?.word?.length})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>세로 힌트</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '270px', overflowY: 'auto', paddingRight: '4px' }}>
                  {puzzleData.downClues.map((item: any, idx: number) => (
                    <div
                      key={`down-${idx}`}
                      onClick={() => handleClueClick(item)}
                      style={{ padding: '8px 10px', backgroundColor: '#eef3fc', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '1px solid #d0e0f8' }}
                    >
                      <strong>{item?.number}.</strong> {item?.clue} <span style={{ color: '#0066cc', fontWeight: 'bold' }}>({item?.word?.length})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedClue && (
          <WordInputModal
            isOpen={isInputModalOpen}
            clue={selectedClue}
            initialValue={getExistingWordValue(selectedClue)}
            hintsLeft={hintsLeft}
            onClose={() => setIsInputModalOpen(false)}
            onSubmit={handleWordSubmit}
            onUseHint={() => setHintsLeft((prev) => Math.max(0, prev - 1))}
          />
        )}

        <WordBankModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default QuizPage;