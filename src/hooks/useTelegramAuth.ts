
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
        console.log('🔄 Starting Telegram WebApp initialization...');
        
        // Wait for Telegram WebApp to be available
        let attempts = 0;
        const maxAttempts = 30; // 3 seconds total
        
        while (!window.Telegram?.WebApp && attempts < maxAttempts) {
          console.log(`⏳ Waiting for Telegram WebApp... (attempt ${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Telegram?.WebApp) {
          console.log('⚠️ Telegram WebApp not available - likely not running in Telegram');
          setError('Not running in Telegram environment');
          setIsLoading(false);
          return;
        }

        const tg = window.Telegram.WebApp;
        console.log('✅ Telegram WebApp object found:', tg);
        
        // Initialize the app
        tg.ready();
        console.log('📱 Telegram WebApp ready() called');
        
        // Wait a bit more for initDataUnsafe to be populated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🔍 Checking initDataUnsafe:', tg.initDataUnsafe);
        console.log('👤 User data:', tg.initDataUnsafe?.user);
        console.log('📱 WebApp object:', { ready: !!tg.ready, expand: !!tg.expand });

        // Get user data
        const telegramUser = tg.initDataUnsafe?.user;
        if (telegramUser) {
          console.log('✅ Successfully retrieved Telegram user:', telegramUser);
          setUser(telegramUser);
          setInitData(tg.initData || '');
          
          // Initialize analytics
          try {
            const { initAnalytics, trackEvent } = await import('@/utils/analytics');
            initAnalytics(telegramUser.id);
            trackEvent('app_launch', {
              platform: 'telegram',
              user_id: telegramUser.id,
              timestamp: Date.now()
            });
          } catch (analyticsError) {
            console.warn('Failed to initialize analytics:', analyticsError);
          }
        } else {
          console.log('⚠️ No user data found in initDataUnsafe');
          setError('No user data available from Telegram');
        }

        // Configure appearance
        try {
          tg.expand();
          tg.setHeaderColor?.('#000000');
          tg.setBackgroundColor?.('#000000');
        } catch (appearanceError) {
          console.warn('Failed to set appearance:', appearanceError);
        }

      } catch (error) {
        console.error('❌ Error initializing Telegram WebApp:', error);
        setError(error instanceof Error ? error.message : 'Unknown Telegram initialization error');
      } finally {
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
