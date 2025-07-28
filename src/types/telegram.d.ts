
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
    showInvoice(invoice: {
      title: string;
      description: string;
      provider_token: string;
      currency: string;
      prices: Array<{ label: string; amount: number }>;
      payload: string;
    }, callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void;
    showPopup(params: {
      title: string;
      message: string;
      buttons: Array<{ id: string; type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }>;
    }, callback: (buttonId: string) => void): void;
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp;
  }
}

export {};
