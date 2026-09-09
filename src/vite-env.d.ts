/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BIRTHDAY_RECIPIENT_NAME?: string;
  readonly VITE_BIRTHDAY_SENDER_NAME?: string;
  readonly VITE_BIRTHDAY_SENDER_SIGNATURE?: string;
  readonly VITE_BIRTHDAY_COVER_TITLE?: string;
  readonly VITE_BIRTHDAY_LETTER_TITLE?: string;
  readonly VITE_BIRTHDAY_DATE?: string;
  readonly VITE_BIRTHDAY_MESSAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
