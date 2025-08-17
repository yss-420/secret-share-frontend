
import { useState, useEffect } from 'react';

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
    const initTelegram = async () => {
      try {
        console.log('Starting Telegram WebApp initialization...');
        
        // Wait for Telegram WebApp to be available
        const waitForTelegram = (): Promise<boolean> => {
          return new Promise((resolve) => {
            const checkTelegram = () => {
              if (typeof window !== 'undefined' && 
                  window.Telegram && 
                  window.Telegram.WebApp &&
                  window.Telegram.WebApp.initData !== undefined) {
                console.log('Telegram WebApp is available');
                return resolve(true);
              }
              
              console.log('Waiting for Telegram WebApp...');
              setTimeout(checkTelegram, 100);
            };
            
            checkTelegram();
            
            // Timeout after 3 seconds
            setTimeout(() => {
              console.log('Telegram WebApp timeout');
              resolve(false);
            }, 3000);
          });
        };

        const telegramAvailable = await waitForTelegram();
        
        if (!telegramAvailable) {
          console.log('Telegram WebApp not available - likely running outside Telegram');
          setError('Not running in Telegram environment');
          setIsLoading(false);
          return;
        }

        const webApp = window.Telegram.WebApp;
        
        // Initialize Telegram WebApp
        console.log('Calling WebApp.ready()...');
        webApp.ready();
        
        // Wait a bit for initialization to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('WebApp initData:', webApp.initData);
        console.log('WebApp initDataUnsafe:', webApp.initDataUnsafe);
        
        // Get user data
        const telegramUser = webApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
          console.log('Telegram user found:', telegramUser);
        } else {
          console.log('No Telegram user data available in initDataUnsafe');
          console.log('Full initDataUnsafe object:', webApp.initDataUnsafe);
        }

        // Initialize Telegram Analytics with user ID
        try {
          const { initAnalytics, trackEvent } = await import('@/utils/analytics');
          initAnalytics(telegramUser?.id);
          
          // Track app launch event
          trackEvent('app_launch', {
            platform: 'telegram',
            user_id: telegramUser?.id || 0,
            timestamp: Date.now()
          });
        } catch (error) {
          console.warn('Failed to initialize Telegram Analytics:', error);
        }
        
        // Get init data
        const telegramInitData = webApp.initData;
        setInitData(telegramInitData);
        console.log('Init data length:', telegramInitData.length);

        // Configure WebApp appearance
        webApp.expand();
        
        // Use try-catch for setHeaderColor and setBackgroundColor as they might not be supported
        try {
          webApp.setHeaderColor('#000000');
        } catch (e) {
          console.warn('setHeaderColor not supported in this Telegram version');
        }
        
        try {
          webApp.setBackgroundColor('#000000');
        } catch (e) {
          console.warn('setBackgroundColor not supported in this Telegram version');
        }
        
        console.log('Telegram WebApp initialization completed successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Telegram WebApp:', error);
        setError(`Failed to initialize Telegram WebApp: ${error.message}`);
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  return {
    user,
    initData,
    isLoading,
    isAuthenticated: !!user,
    error
  };
};
