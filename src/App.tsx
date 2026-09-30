import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, gameControllerOutline, bookOutline, settingsOutline } from 'ionicons/icons';

import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import WordBankPage from './pages/WordBankPage';
import SettingsPage from './pages/SettingsPage';

/* Ionic 코어 스타일 임포트 */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/wordbank" element={<WordBankPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>홈</IonLabel>
          </IonTabButton>

          <IonTabButton tab="quiz" href="/quiz">
            <IonIcon icon={gameControllerOutline} />
            <IonLabel>퀴즈 풀기</IonLabel>
          </IonTabButton>

          <IonTabButton tab="wordbank" href="/wordbank">
            <IonIcon icon={bookOutline} />
            <IonLabel>단어장</IonLabel>
          </IonTabButton>

          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settingsOutline} />
            <IonLabel>설정</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;