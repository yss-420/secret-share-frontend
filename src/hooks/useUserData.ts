import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from './useDevMode';
import { UserStats, apiService } from '@/services/api';

export const useUserData = () => {
  const { user, isAuthenticated, telegramUser } = useAuth();
  const { isDevMode, devUser } = useDevMode();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTelegramId = (): string | null => {
    console.log('[USER_DATA] Debugging Telegram access sources:', {
      // Auth context data (from @twa-dev/sdk)
      authTelegramUser: telegramUser,
      authTelegramUserId: telegramUser?.id,
      
      // Direct window access
      windowTelegramExists: !!window.Telegram,
      windowWebAppExists: !!window.Telegram?.WebApp,
      windowInitDataExists: !!window.Telegram?.WebApp?.initDataUnsafe,
      windowUserExists: !!window.Telegram?.WebApp?.initDataUnsafe?.user,
      windowUserId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    });

    // Primary: Use telegram user from auth context (@twa-dev/sdk)
    if (telegramUser?.id) {
      const telegramId = String(telegramUser.id);
      console.log('[USER_DATA] ✅ Using telegram_id from auth context:', telegramId);
      return telegramId;
    }

    // Fallback: Direct window access
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const telegramIdRaw = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (telegramIdRaw) {
        const telegramId = String(telegramIdRaw);
        console.log('[USER_DATA] ✅ Using telegram_id from window fallback:', telegramId);
        return telegramId;
      }
    }
    
    console.log('[USER_DATA] ❌ No telegram_id found from any source');
    return null;
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use dev data in development environment
      if (isDevMode && devUser) {
        console.log('[USER_DATA] Using dev user:', devUser);
        setUserStats({
          gems: devUser.gems,
          total_messages: devUser.total_messages,
          messages_today: devUser.messages_today,
          subscription_type: devUser.subscription_type,
          subscription_end: devUser.subscription_end,
          tier: devUser.tier
        });
        setLoading(false);
        return;
      }

      // Get telegram ID
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        console.log('[USER_DATA] No telegram user found');
        setError('No Telegram user found');
        setLoading(false);
        return;
      }

      console.log('[USER_DATA] Fetching data from backend API for telegram_id:', telegramId);

      // Use backend API instead of direct Supabase query
      const data = await apiService.getUserStatus(telegramId);

      if (!data) {
        console.log('[USER_DATA] No user found with telegram_id:', telegramId);
        setError('User not found. Please hit /start in the bot first.');
        setLoading(false);
        return;
      }

      console.log('[USER_DATA] Successfully fetched user data:', data);
      setUserStats({
        gems: data.gems || 0,
        total_messages: 0,
        messages_today: data.messages_today || 0,
        subscription_type: data.subscription_type,
        subscription_end: null,
        tier: 'free'
      });
    } catch (err) {
      console.error('[USER_DATA] Failed to fetch user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log('[USER_DATA] useEffect triggered, dependencies:', { 
      isDevMode, 
      hasTelegramUser: !!telegramUser,
      telegramUserId: telegramUser?.id 
    });
    
    // Wait for auth context to initialize or use dev mode
    if (isDevMode || telegramUser) {
      fetchUserData();
    }
  }, [isDevMode, telegramUser]);

  // Update gems function now refetches data instead of using realtime
  const updateGems = (amount: number) => {
    // Refetch data after payment instead of relying on realtime
    fetchUserData();
  };

  return {
    userStats,
    loading,
    error,
    refreshUserData: fetchUserData,
    updateGems
  };
};