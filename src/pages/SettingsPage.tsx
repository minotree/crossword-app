import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';

const SettingsPage: React.FC = () => {
  const markWordsAsUsed = () => {
    // Replace with actual logic to mark words as used
    console.log('Words marked as used');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Settings Page</h1>
        <p>This is the Settings page.</p>
        <IonButton onClick={markWordsAsUsed}>Mark Words as Used</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
