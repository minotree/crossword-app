import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonSpinner,
} from '@ionic/react';
import useWordBank from '../hooks/useWordBank';

interface WordBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordBankModal: React.FC<WordBankModalProps> = ({ isOpen, onClose }) => {
  const { words, addWordsFromCSV } = useWordBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 1. 로딩 상태 추가

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true); // 2. 파일 읽기 시작 시 로딩 표시

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // UI가 로딩 표시를 먼저 렌더링할 수 있도록 약간의 비동기 처리 적용
        setTimeout(() => {
          try {
            addWordsFromCSV(text);
          } finally {
            setIsLoading(false); // 3. 처리 완료 후 로딩 해제
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

  const filteredWords = words.filter(
    (w) =>
      w.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.clue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* CSV 업로드 버튼 영역 */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="file"
            accept=".csv"
            id="csv-file-input"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={isLoading}
          />
          <IonButton
            expand="block"
            disabled={isLoading}
            onClick={() => document.getElementById('csv-file-input')?.click()}
          >
            {isLoading ? '단어 등록 중...' : 'CSV 파일 등록'}
          </IonButton>
        </div>

        {/* 4. 로딩 중일 때 표시할 진행 상태 UI */}
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0',
            }}
          >
            <IonSpinner name="crescent" color="primary" />
            <p style={{ marginTop: '16px', color: '#666', fontWeight: 'bold' }}>
              CSV 단어를 분석하고 등록하는 중입니다...
            </p>
          </div>
        ) : (
          <>
            <IonSearchbar
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(e.detail.value!)}
              placeholder="단어 또는 뜻 검색"
            />

            <IonList>
              {filteredWords.map((item) => (
                <IonItem key={item.id}>
                  <IonLabel>
                    <h2>{item.word}</h2>
                    <p>{item.clue}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonModal>
  );
};

export default WordBankModal;