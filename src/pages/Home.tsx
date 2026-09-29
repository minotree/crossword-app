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
} from '@ionic/react';
import { bookOutline, refreshOutline } from 'ionicons/icons';
import useWordBank from '../hooks/useWordBank';
import useCrosswordGame from '../hooks/useCrosswordGame';
import generateCrosswordGame from '../utils/crosswordGenerator';
import type { CrosswordGameData } from '../utils/crosswordGenerator';
import CrosswordGrid from '../components/CrosswordGrid';
import ClueList from '../components/ClueList';
import WordBankModal from '../components/WordBankModal';

const Home: React.FC = () => {
  const { words, markWordsAsUsed } = useWordBank();
  const [gameData, setGameData] = useState<CrosswordGameData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Crossword 게임 커스텀 훅 호출
  const game = useCrosswordGame({
    grid: gameData?.grid || [],
    clues: gameData?.clues || [],
  });

  const startNewGame = () => {
    if (words.length === 0) {
      setGameData(null);
      return;
    }
    const newGame = generateCrosswordGame(words, 10);
    if (newGame) {
      setGameData(newGame);
      markWordsAsUsed(newGame.usedWordIds);
    }
  };

  useEffect(() => {
    if (words.length > 0 && !gameData) {
      startNewGame();
    }
  }, [words, gameData]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (words.length > 0 && !gameData) {
      startNewGame();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>영어 단어 십자낱말 풀이</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsModalOpen(true)}>
              <IonIcon slot="icon-only" icon={bookOutline} />
            </IonButton>
            <IonButton onClick={startNewGame}>
              <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {gameData ? (
          <>
            <CrosswordGrid
              grid={gameData.grid}
              activeCell={game.activeCell}
              userInputs={game.userInputs}
              isCompleted={game.isCompleted}
              onCellClick={(x, y) => {
                if (game.activeCell?.x === x && game.activeCell?.y === y) {
                  game.toggleDirection();
                } else {
                  game.setActiveCell({ x, y });
                }
              }}
              onInputChange={game.handleInputChange}
              onKeyDown={game.handleKeyDown}
            />
            <ClueList
              clues={gameData.clues}
              activeClue={game.activeClue}
              onSelectClue={(clue) => game.selectClue(clue)}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>단어장에 등록된 단어가 없습니다.</p>
            <IonButton onClick={() => setIsModalOpen(true)}>단어 등록하기</IonButton>
          </div>
        )}

        <WordBankModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </IonContent>
    </IonPage>
  );
};

export default Home;