import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonBadge,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonSpinner,
} from '@ionic/react';
import { star, starOutline, trashOutline, arrowBackOutline } from 'ionicons/icons';
import useWordBank from '../hooks/useWordBank';

interface WordBankPageProps {
  onBack?: () => void;
}

export const WordBankPage: React.FC<WordBankPageProps> = ({ onBack }) => {
  const { words, addWordsFromCSV, toggleBookmark, deleteWord } = useWordBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'bookmarked' | 'quizUsed'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // CSV 업로드 핸들러
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

  // 조건별 필터링 (검색어 + 세그먼트)
  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.meaning || w.clue)?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterSegment === 'bookmarked') return w.isBookmarked;
    if (filterSegment === 'quizUsed') return w.isQuizUsed;
    return true; // 'all'
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          {onBack && (
            <IonButtons slot="start">
              <IonButton onClick={onBack}>
                <IonIcon slot="icon-only" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>단어장 관리 (Word Bank)</IonTitle>
        </IonToolbar>

        {/* 필터 세그먼트 (All / Bookmarked / Quiz Used) */}
        <IonToolbar>
          <IonSegment
            value={filterSegment}
            onIonChange={(e) => setFilterSegment(e.detail.value as any)}
          >
            <IonSegmentButton value="all">
              <IonLabel>전체</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="bookmarked">
              <IonLabel>즐겨찾기</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="quizUsed">
              <IonLabel>학습완료</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* CSV 업로드 버튼 영역 ('전체' 탭일 때만 노출) */}
        {filterSegment === 'all' && (
          <div style={{ marginBottom: '12px' }}>
            <input
              type="file"
              accept=".csv"
              id="csv-file-input-page"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={isLoading}
            />
            <IonButton
              expand="block"
              disabled={isLoading}
              onClick={() => document.getElementById('csv-file-input-page')?.click()}
            >
              {isLoading ? <IonSpinner name="crescent" /> : 'CSV 파일 등록 (단어 추가)'}
            </IonButton>
          </div>
        )}

        {/* 검색바 */}
        <IonSearchbar
          value={searchTerm}
          onIonInput={(e) => setSearchTerm(e.detail.value!)}
          placeholder="단어 또는 뜻 검색"
        />

        {/* 단어 리스트 */}
        <IonList>
          {filteredWords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
              {filterSegment === 'all'
                ? '등록된 단어가 없습니다. CSV 파일로 단어를 등록해 보세요!'
                : filterSegment === 'bookmarked'
                ? '즐겨찾기한 단어가 없습니다.'
                : '학습 완료된 단어가 없습니다.'}
            </div>
          ) : (
            filteredWords.map((item) => (
              <IonItemSliding key={item.id}>
                <IonItem>
                  <IonLabel>
                    <h2>
                      {item.word}{' '}
                      {item.partOfSpeech && (
                        <IonBadge color="light" style={{ fontSize: '11px' }}>
                          {item.partOfSpeech}
                        </IonBadge>
                      )}
                      {item.isQuizUsed && (
                        <IonBadge color="success" style={{ marginLeft: '4px', fontSize: '10px' }}>
                          학습완료
                        </IonBadge>
                      )}
                    </h2>
                    <p>{item.meaning || item.clue}</p>
                  </IonLabel>

                  {/* 북마크 별 아이콘 토글 */}
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

                {/* 오른쪽 슬라이드 시 삭제 버튼 */}
                <IonItemOptions slot="end">
                  <IonItemOption color="danger" onClick={() => deleteWord && deleteWord(item.id)}>
                    <IonIcon slot="icon-only" icon={trashOutline} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WordBankPage;