import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonSpinner,
} from '@ionic/react';
import { star, starOutline, trashOutline } from 'ionicons/icons';
import useWordBank from '../hooks/useWordBank';

interface WordBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordBankModal: React.FC<WordBankModalProps> = ({ isOpen, onClose }) => {
  const { words, addWordsFromCSV, toggleBookmark, deleteWord } = useWordBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setTimeout(() => {
          try {
            addWordsFromCSV(text);
          } finally {
            setIsLoading(false);
          }
        }, 100);
      } else {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setIsLoading(false);
      alert('파일을 읽는 중 오류가 발생했습니다.');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const filteredWords = words.filter((w) => {
    return (
      w.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.meaning || w.clue)?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>단어장 관리</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>닫기</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ marginBottom: '12px' }}>
          <input
            type="file"
            accept=".csv"
            id="csv-file-input-modal"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={isLoading}
          />
          <IonButton
            expand="block"
            disabled={isLoading}
            onClick={() => document.getElementById('csv-file-input-modal')?.click()}
          >
            {isLoading ? <IonSpinner name="crescent" /> : 'CSV 파일 등록'}
          </IonButton>
        </div>

        <IonSearchbar
          value={searchTerm}
          onIonInput={(e) => setSearchTerm(e.detail.value!)}
          placeholder="단어 또는 뜻 검색"
        />

        <IonList>
          {filteredWords.map((item) => (
            <IonItemSliding key={item.id}>
              <IonItem>
                <IonLabel>
                  <h2>{item.word}</h2>
                  <p>{item.meaning || item.clue}</p>
                </IonLabel>

                {/* 즐겨찾기(별) 아이콘 */}
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => toggleBookmark && toggleBookmark(item.id)}
                >
                  <IonIcon
                    icon={item.isBookmarked ? star : starOutline}
                    color={item.isBookmarked ? 'warning' : 'medium'}
                  />
                </IonButton>
              </IonItem>

              {/* 오른쪽으로 밀었을 때 삭제 버튼 */}
              <IonItemOptions slot="end">
                <IonItemOption color="danger" onClick={() => deleteWord && deleteWord(item.id)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default WordBankModal;