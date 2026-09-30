import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const WordBankPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Word Bank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Word Bank Page</h1>
        <p>This is the Word Bank page.</p>
      </IonContent>
    </IonPage>
  );
};

export default WordBankPage;
