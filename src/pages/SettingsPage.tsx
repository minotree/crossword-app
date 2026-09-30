import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonListHeader,
  IonIcon,
  IonAlert,
  IonToast,
} from '@ionic/react';
import {
  refreshOutline,
  trashOutline,
  informationCircleOutline,
  codeWorkingOutline,
} from 'ionicons/icons';
import useWordBank from '../hooks/useWordBank';
import '../App.css';
export const SettingsPage: React.FC = () => {
  const { words, resetQuizHistory, clearWords } = useWordBank();
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 학습 완료된 단어 수 계산
  const quizUsedCount = words.filter((w) => w.isQuizUsed).length;

  const handleResetHistory = () => {
    if (resetQuizHistory) {
      resetQuizHistory();
      setToastMessage('모든 학습 기록이 초기화되었습니다.');
    }
  };

  const handleClearAllWords = () => {
    if (clearWords) {
      clearWords();
      setToastMessage('단어장의 모든 단어가 삭제되었습니다.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>설정 (Settings)</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* 1. 데이터 관리 섹션 */}
        <IonList inset={true}>
          <IonListHeader>
            <IonLabel>데이터 관리</IonLabel>
          </IonListHeader>

          {/* 학습 기록 초기화 */}
          <IonItem button onClick={() => setShowResetAlert(true)}>
            <IonIcon slot="start" icon={refreshOutline} color="warning" />
            <IonLabel>
              <h2>학습 기록 초기화</h2>
              <p>학습 완료(Quiz Used) 상태만 리셋합니다 (완료: {quizUsedCount}개)</p>
            </IonLabel>
          </IonItem>

          {/* 전체 단어 데이터 삭제 */}
          <IonItem button onClick={() => setShowClearAlert(true)}>
            <IonIcon slot="start" icon={trashOutline} color="danger" />
            <IonLabel color="danger">
              <h2>전체 단어 삭제</h2>
              <p>단어장에 등록된 모든 단어를 삭제합니다 (총 {words.length}개)</p>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* 2. 앱 정보 섹션 */}
        <IonList inset={true} style={{ marginTop: '20px' }}>
          <IonListHeader>
            <IonLabel>앱 정보</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonIcon slot="start" icon={informationCircleOutline} color="primary" />
            <IonLabel>
              <h2>앱 이름 및 버전</h2>
              <p>English Crossword Puzzle v1.0.0</p>
              <p style={{ marginTop: '4px' }}>
                <span className="highlight">유민이를 위하여</span>
              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={codeWorkingOutline} color="medium" />
            <IonLabel>
              <h2>개발 기술 스택</h2>
              <IonText color="medium">
                <p>React, TypeScript, Ionic Framework, Vite</p>
              </IonText>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* 알림 다이얼로그 - 학습 기록 초기화 */}
        <IonAlert
          isOpen={showResetAlert}
          onDidDismiss={() => setShowResetAlert(false)}
          header="학습 기록 초기화"
          message="모든 단어의 학습 완료 상태를 초기화하시겠습니까?"
          buttons={[
            { text: '취소', role: 'cancel' },
            {
              text: '초기화',
              handler: handleResetHistory,
            },
          ]}
        />

        {/* 알림 다이얼로그 - 전체 삭제 */}
        <IonAlert
          isOpen={showClearAlert}
          onDidDismiss={() => setShowClearAlert(false)}
          header="전체 단어 삭제"
          message="단어장에 있는 모든 데이터가 삭제됩니다. 정말 삭제하시겠습니까?"
          buttons={[
            { text: '취소', role: 'cancel' },
            {
              text: '삭제',
              role: 'destructive',
              handler: handleClearAllWords,
            },
          ]}
        />

        {/* 완료 안내 토스트 */}
        <IonToast
          isOpen={Boolean(toastMessage)}
          message={toastMessage || ''}
          duration={2000}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
