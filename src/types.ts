export type ScreenStep = 'cover' | 'wish' | 'gift' | 'letter';

export interface LetterContent {
  recipientName: string;
  senderName: string;
  senderSignature: string;
  coverTitle: string;
  letterTitle: string;
  birthdayDate: string;
  letterParagraphs: string[];
}

export interface SoundState {
  isMusicPlaying: boolean;
  isMuted: boolean;
  volume: number;
}
