
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
        // Check if we're running in Telegram WebApp environment
        const isTelegramAvailable = typeof window !== 'undefined' && 
          window.Telegram && 
          window.Telegram.WebApp;

        if (!isTelegramAvailable) {
          console.log('Telegram WebApp not available - likely running outside Telegram');
          setError('Not running in Telegram environment');
          setIsLoading(false);
          return;
        }

        // Initialize Telegram WebApp
        WebApp.ready();
        
        // Initialize Telegram Analytics SDK
        try {
          // Initialize analytics with the provided SDK Auth Key
          import('@/utils/analytics').then(({ initAnalytics, trackEvent }) => {
            initAnalytics('eyJhcHBfbmFtZSI6InNlY3JldF9zaGFyZSIsImFwcF91cmwiOiJodHRwczovL3QubWUvWW91clNlY3JldFNoYXJlQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vc2VjcmV0LXNoYXJlLmNvbS8ifQ==!5qhdK7t9nNztBOn4RaVlQXF7KccCDMRR8BSmYRHi/S8=');
            
            // Track app launch event
            trackEvent('app_launch', {
              platform: 'telegram',
              timestamp: Date.now()
            });
          });
        } catch (error) {
          console.warn('Failed to initialize Telegram Analytics:', error);
        }
        
        // Get init data
        const telegramInitData = WebApp.initData;
        setInitData(telegramInitData);
        
        // Get user data
        const telegramUser = WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
          console.log('Telegram user found:', telegramUser);
        } else {
          console.log('No Telegram user data available');
        }

        // Configure WebApp appearance
        WebApp.expand();
        
        // Use try-catch for setHeaderColor and setBackgroundColor as they might not be supported
        try {
          WebApp.setHeaderColor('#000000');
        } catch (e) {
          console.warn('setHeaderColor not supported in this Telegram version');
        }
        
        try {
          WebApp.setBackgroundColor('#000000');
        } catch (e) {
          console.warn('setBackgroundColor not supported in this Telegram version');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Telegram WebApp:', error);
        setError('Failed to initialize Telegram WebApp');
        setIsLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Telegram initialization timeout');
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
