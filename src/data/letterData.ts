import { LetterContent } from '../types';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';

// Fallback to environment variables if explicitly set, otherwise use BIRTHDAY_CONFIG directly
const envRecipient = (import.meta.env?.VITE_BIRTHDAY_RECIPIENT_NAME as string | undefined)?.trim();
const envSender = (import.meta.env?.VITE_BIRTHDAY_SENDER_NAME as string | undefined)?.trim();
const envSignature = (import.meta.env?.VITE_BIRTHDAY_SENDER_SIGNATURE as string | undefined)?.trim();
const envCoverTitle = (import.meta.env?.VITE_BIRTHDAY_COVER_TITLE as string | undefined)?.trim();
const envLetterTitle = (import.meta.env?.VITE_BIRTHDAY_LETTER_TITLE as string | undefined)?.trim();
const envBirthdayDate = (import.meta.env?.VITE_BIRTHDAY_DATE as string | undefined)?.trim();
const envMessage = (import.meta.env?.VITE_BIRTHDAY_MESSAGE as string | undefined)?.trim();

function parseCustomParagraphs(raw?: string): string[] {
  if (!raw) return BIRTHDAY_CONFIG.letterParagraphs;
  const delimiter = raw.includes('|') ? '|' : '\n\n';
  const parts = raw
    .split(delimiter)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  return parts.length > 0 ? parts : BIRTHDAY_CONFIG.letterParagraphs;
}

export const defaultLetterContent: LetterContent = {
  recipientName: envRecipient || BIRTHDAY_CONFIG.recipientName,
  senderName: envSender || BIRTHDAY_CONFIG.senderName,
  senderSignature: envSignature || BIRTHDAY_CONFIG.senderSignature,
  coverTitle: envCoverTitle || BIRTHDAY_CONFIG.coverTitle,
  letterTitle: envLetterTitle || BIRTHDAY_CONFIG.letterTitle,
  birthdayDate: envBirthdayDate || BIRTHDAY_CONFIG.birthdayDate,
  letterParagraphs: envMessage ? parseCustomParagraphs(envMessage) : [...BIRTHDAY_CONFIG.letterParagraphs]
};

export function getInitialLetterContent(): LetterContent {
  if (typeof window === 'undefined') return defaultLetterContent;
  
  try {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    const fromParam = params.get('from');

    return {
      recipientName: toParam ? decodeURIComponent(toParam).trim() : defaultLetterContent.recipientName,
      senderName: defaultLetterContent.senderName,
      senderSignature: fromParam ? decodeURIComponent(fromParam).trim() : defaultLetterContent.senderSignature,
      coverTitle: defaultLetterContent.coverTitle,
      letterTitle: defaultLetterContent.letterTitle,
      birthdayDate: defaultLetterContent.birthdayDate,
      letterParagraphs: [...defaultLetterContent.letterParagraphs]
    };
  } catch {
    return defaultLetterContent;
  }
}
