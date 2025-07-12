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
}

export const useTelegramAuth = (): TelegramAuthData => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initTelegram = () => {
      try {
        // Initialize Telegram WebApp
        WebApp.ready();
        
        // Get init data
        const telegramInitData = WebApp.initData;
        setInitData(telegramInitData);
        
        // Get user data
        const telegramUser = WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
        }

        // Configure WebApp appearance
        WebApp.expand();
        WebApp.setHeaderColor('#000000');
        WebApp.setBackgroundColor('#000000');
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Telegram WebApp:', error);
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  return {
    user,
    initData,
    isLoading,
    isAuthenticated: !!user
  };
};