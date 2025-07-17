
interface TelegramWebApp {
  WebApp: {
    ready(): void;
    expand(): void;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    initData: string;
    initDataUnsafe?: {
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        is_premium?: boolean;
        photo_url?: string;
      };
    };
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp;
  }
}

export {};
