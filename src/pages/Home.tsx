import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { gameControllerOutline, bookOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ textAlign: 'center' }}>영어 단어 십자 낱말 풀이</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            paddingBottom: '40px',
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/src/assets/family.jpg" 
              alt="가족 사진" 
              style={{ 
                width: '180px', 
                height: '180px', 
                objectFit: 'cover', 
                borderRadius: '50%', 
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }} 
            />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
            영어 단어 십자낱말 풀이에 오신 것을 환영합니다!
          </h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '30px' }}>
            단어장에 저장된 단어들로 맞춤형 십자낱말 퍼즐을 즐기고 영어 실력을 키워보세요.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <IonButton
              expand="block"
              size="large"
              color="primary"
              onClick={() => navigate('/quiz')}
            >
              <IonIcon slot="start" icon={gameControllerOutline} />
              퍼즐 퀴즈 시작하기
            </IonButton>

            <IonButton
              expand="block"
              size="large"
              fill="outline"
              color="primary"
              onClick={() => navigate('/wordbank')}
            >
              <IonIcon slot="start" icon={bookOutline} />
              단어장 관리하기
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;