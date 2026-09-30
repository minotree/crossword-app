import React, { useState, useEffect, useRef } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { bulbOutline } from 'ionicons/icons';

interface WordInputModalProps {
  isOpen: boolean;
  clue: any | null;
  initialValue?: string;
  hintsLeft: number;
  onClose: () => void;
  onSubmit: (word: string) => void;
  onUseHint: () => void;
}

export const WordInputModal: React.FC<WordInputModalProps> = ({
  isOpen,
  clue,
  initialValue = '',
  hintsLeft,
  onClose,
  onSubmit,
  onUseHint,
}) => {
  if (!clue) return null;

  const targetWord = (clue.word || '').toUpperCase();
  const wordLength = targetWord.length;
  const [letters, setLetters] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 모달이 열릴 때 초기값 세팅
  useEffect(() => {
    if (isOpen && wordLength > 0) {
      const initialArr = Array.from({ length: wordLength }, (_, i) => initialValue[i] || '');
      setLetters(initialArr);
    }
  }, [isOpen, clue, initialValue, wordLength]);

  // 모달이 완전히 화면에 표시된 후 안전하게 포커스 적용 (콘솔 에러 방지)
  const handleDidPresent = () => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  };

  const handleNativeInput = (index: number, rawValue: string) => {
    const cleanValue = rawValue.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const charToSet = cleanValue ? cleanValue.slice(-1) : '';

    setLetters((prev) => {
      const next = [...prev];
      next[index] = charToSet;
      return next;
    });

    if (charToSet && index < wordLength - 1) {
      requestAnimationFrame(() => {
        inputRefs.current[index + 1]?.focus();
      });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!letters[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        setLetters((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      }
    }
  };

  const handleGiveSingleHint = () => {
    if (hintsLeft <= 0 || !targetWord) return;

    const emptyIndices: number[] = [];
    for (let i = 0; i < wordLength; i++) {
      if (letters[i] !== targetWord[i]) {
        emptyIndices.push(i);
      }
    }

    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      setLetters((prev) => {
        const next = [...prev];
        next[randomIndex] = targetWord[randomIndex];
        return next;
      });

      onUseHint();
    }
  };

  const handleSubmit = () => {
    const fullWord = letters.join('');
    onSubmit(fullWord);
    onClose();
  };

  const getBoxStyle = () => {
    if (wordLength >= 10) {
      return { width: '26px', height: '34px', fontSize: '15px', gap: '3px' };
    }
    if (wordLength >= 8) {
      return { width: '30px', height: '38px', fontSize: '16px', gap: '4px' };
    }
    if (wordLength >= 6) {
      return { width: '35px', height: '42px', fontSize: '18px', gap: '6px' };
    }
    return { width: '40px', height: '46px', fontSize: '20px', gap: '8px' };
  };

  const currentStyle = getBoxStyle();

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      onDidPresent={handleDidPresent}
      style={{ '--height': 'auto', '--border-radius': '16px' }}
    >
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ fontSize: '16px' }}>
            {clue.direction === 'across' ? '가로' : '세로'} {clue.number}번 정답 입력
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>취소</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            {clue.number}. {clue.clue}
          </div>
          <div style={{ fontSize: '13px', color: '#0066cc', fontWeight: 'bold' }}>
            ({wordLength}글자 단어)
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <IonButton
            size="small"
            fill="outline"
            color="warning"
            onClick={handleGiveSingleHint}
            disabled={hintsLeft <= 0}
          >
            <IonIcon slot="start" icon={bulbOutline} />
            한 글자 힌트 ({hintsLeft}개 남음)
          </IonButton>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: currentStyle.gap,
            margin: '12px 0 20px',
            flexWrap: 'nowrap',
            width: '100%',
            boxSizing: 'border-box',
            padding: '0 4px',
          }}
        >
          {Array.from({ length: wordLength }).map((_, idx) => (
            <input
              key={`input-${idx}`}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              value={letters[idx] || ''}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                handleNativeInput(idx, target.value);
              }}
              onChange={(e) => {
                handleNativeInput(idx, e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: currentStyle.width,
                height: currentStyle.height,
                flexShrink: 1,
                textAlign: 'center',
                fontSize: currentStyle.fontSize,
                fontWeight: 'bold',
                border: '2px solid #1976d2',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: '#f8f9fa',
                textTransform: 'uppercase',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
              }}
            />
          ))}
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton
            expand="block"
            color="success"
            onClick={handleSubmit}
            style={{ margin: '8px 16px', fontWeight: 'bold' }}
          >
            확인 (정답 입력)
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default WordInputModal;