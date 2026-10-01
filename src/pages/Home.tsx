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

// 가족사진 임포트
import familyPhoto from '../assets/family.jpg';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ textAlign: 'center' }}>영어 단어 십자낱말 풀이</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: '40px' }}>
          
          {/* 가족 사진 표시 영역 */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={familyPhoto} 
              alt="가족 사진" 
              style={{ 
                width: '160px', 
                height: '160px', 
                objectFit: 'cover', 
                borderRadius: '50%', 
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }} 
            />
          </div>
          
          {/* 타이틀 텍스트 (반응형 줄바꿈 적용) */}
          <h2 style={{ fontWeight: 'bold', fontSize: '19px', color: '#222', marginBottom: '12px', padding: '0 10px', wordBreak: 'keep-all', lineHeight: 1.4 }}>
            영어 단어 십자낱말 풀이에 <br className="break-mobile" />오신 것을 환영합니다!
          </h2>
          
          {/* 설명 텍스트 */}
          <p style={{ color: '#666', fontSize: '13px', maxWidth: '320px', marginBottom: '28px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
            단어장에 저장된 단어들로 맞춤형 십자낱말 퍼즐을 즐기고 <br />영어 실력을 키워보세요.
          </p>

          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <IonButton expand="block" size="large" onClick={() => navigate('/quiz')}>
              <IonIcon slot="start" icon={gameControllerOutline} />
              퍼즐 퀴즈 시작하기
            </IonButton>

            <IonButton expand="block" fill="outline" size="large" onClick={() => navigate('/wordbank')}>
              <IonIcon slot="start" icon={bookOutline} />
              단어장 관리하기
            </IonButton>
          </div>
        </div>

        {/* 모바일 화면 크기에 따른 줄바꿈 제어 스타일 */} 
        <style>{`
          .break-mobile {
            display: inline;
          }
          @media (max-width: 480px) {
            .break-mobile {
              display: block;
            }
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default Home;