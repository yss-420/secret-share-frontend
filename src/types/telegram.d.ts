
interface TelegramWebApp {
  WebApp: {
    ready(): void;
    expand(): void;
    close(): void;
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
    openInvoice(invoiceLink: string, callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void;
    showAlert(message: string): void;
    showPopup(params: {
      title: string;
      message: string;
      buttons: Array<{ id: string; type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }>;
    }, callback: (buttonId: string) => void): void;
    sendData(data: string): void;
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp;
  }
}

export {};
