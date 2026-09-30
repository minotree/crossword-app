import React, { useState } from 'react';
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
  IonFooter,
} from '@ionic/react';
import { refreshOutline, bookOutline, bulbOutline } from 'ionicons/icons';
import CrosswordGrid from '../components/CrosswordGrid';
import { useCrosswordGame } from '../hooks/useCrosswordGame';
import WordBankModal from '../components/WordBankModal';

export const Home: React.FC = () => {
  const [selectedGridSize, setSelectedGridSize] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const game = useCrosswordGame({ gridSize: selectedGridSize } as any) || {};

  const {
    grid = [],
    clues = { across: [], down: [] },
    userInputs = {},
    activeCell = null,
    activeDirection = 'across',
    hintsLeft = 0,
    handleCellClick = () => {},
    handleInputChange = () => {},
    handleKeyDown = () => {},
    generateNewGame,
    revealHint,
  } = game as any;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>영어 단어 십자낱말 풀이</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsModalOpen(true)}>
              <IonIcon slot="icon-only" icon={bookOutline} />
            </IonButton>
            <IonButton onClick={() => generateNewGame && generateNewGame(selectedGridSize)}>
              <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* 상단 난이도 선택 메뉴 */}
        <IonToolbar>
          <IonSegment
            value={selectedGridSize.toString()}
            onIonChange={(e) => {
              const newSize = Number(e.detail.value);
              setSelectedGridSize(newSize);
              if (generateNewGame) generateNewGame(newSize);
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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          {grid && grid.length > 0 ? (
            {/* CrosswordGrid를 타입 단언(as any) 처리하여 direction 속성 체크 우회 */}
            <CrosswordGrid
              {...({
                grid,
                userInputs,
                activeCell,
                direction: activeDirection,
                onCellClick: handleCellClick,
                onInputChange: handleInputChange,
                onKeyDown: handleKeyDown,
              } as any)}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>퍼즐 생성 중...</div>
          )}
        </div>

        {/* 힌트 목록 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              가로 힌트<br />
              <span style={{ fontSize: '14px', color: '#666' }}>(Across)</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(clues?.across || []).map((item: any, idx: number) => (
                <div
                  key={`across-${item?.number || idx}`}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f4f5f8',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                  }}
                >
                  <strong>{item?.number || idx + 1}.</strong> {item?.clue || item?.text || ''}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              세로 힌트<br />
              <span style={{ fontSize: '14px', color: '#666' }}>(Down)</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(clues?.down || []).map((item: any, idx: number) => (
                <div
                  key={`down-${item?.number || idx}`}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f4f5f8',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                  }}
                >
                  <strong>{item?.number || idx + 1}.</strong> {item?.clue || item?.text || ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        <WordBankModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </IonContent>

      <IonFooter>
        <IonToolbar color="light">
          <IonButton
            expand="block"
            color="warning"
            onClick={() => revealHint && revealHint()}
            disabled={hintsLeft !== undefined && hintsLeft <= 0}
            style={{ margin: '8px 16px' }}
          >
            <IonIcon slot="start" icon={bulbOutline} />
            힌트 보기 {hintsLeft !== undefined ? `(남은 힌트 ${hintsLeft}개)` : ''}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
