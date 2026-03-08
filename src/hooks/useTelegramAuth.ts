
import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramAuthData {
  user: TelegramUser | null;
  initData: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useTelegramAuth = (): TelegramAuthData => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTelegram = () => {
      try {
        const isTelegramAvailable = typeof window !== 'undefined' &&
          window.Telegram &&
          window.Telegram.WebApp;

        if (!isTelegramAvailable) {
          setError('Not running in Telegram environment');
          setIsLoading(false);
          return;
        }

        WebApp.ready();

        const telegramUser = WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
        }

        // Initialize analytics
        try {
          import('@/utils/analytics').then(({ initAnalytics, trackEvent }) => {
            initAnalytics(telegramUser?.id);
            trackEvent('app_launch', {
              platform: 'telegram',
              user_id: telegramUser?.id || 0,
              timestamp: Date.now()
            });
          });
        } catch {
          // Analytics init failed — non-critical
        }

        const telegramInitData = WebApp.initData;
        setInitData(telegramInitData);

        // BeMob tracking
        const startParam = WebApp.initDataUnsafe?.start_param || '';
        const cid = startParam.startsWith('cid-') ? startParam.slice(4) : null;
        if (cid) {
          localStorage.setItem('bemob_cid', cid);
          try {
            WebApp.sendData(JSON.stringify({ action: 'init', cid }));
          } catch {
            // Non-critical
          }
        }

        WebApp.expand();

        try { WebApp.setHeaderColor('#000000'); } catch { /* unsupported */ }
        try { WebApp.setBackgroundColor('#000000'); } catch { /* unsupported */ }

        setIsLoading(false);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to initialize Telegram WebApp:', err);
        setError('Failed to initialize Telegram WebApp');
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError('Telegram initialization timeout');
        setIsLoading(false);
      }
    }, 5000);

    initTelegram();

    return () => clearTimeout(timeoutId);
  }, []);

  return {
    user,
    initData,
    isLoading,
    isAuthenticated: !!user,
    error
  };
};
