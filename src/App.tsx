import React, { useState } from 'react';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, book, settings } from 'ionicons/icons';
import Home from './pages/Home';
import WordBankPage from './pages/WordBankPage';
import SettingsPage from './pages/SettingsPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Ionic Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [totalWords, setTotalWords] = useState<number>(0);
  const [unusedWords, setUnusedWords] = useState<number>(0);

  // Example logic to calculate total and unused words
  useEffect(() => {
    // Replace with actual logic to calculate total and unused words
    setTotalWords(100);
    setUnusedWords(50);
  }, []);
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/home" element={<Home difficulty={difficulty} totalWords={totalWords} unusedWords={unusedWords} />} />
          <Route path="/word-bank" element={<WordBankPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Play Quiz</IonLabel>
          </IonTabButton>
          <IonTabButton tab="word-bank" href="/word-bank">
            <IonIcon icon={book} />
            <IonLabel>Word Bank</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
