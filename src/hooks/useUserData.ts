import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from './useDevMode';
import { UserStats } from '@/services/api';

export const useUserData = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDevMode, devUser } = useDevMode();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // Get telegramId directly from Telegram WebApp
      console.log('[USER_DATA] Telegram WebApp available:', !!window.Telegram?.WebApp);
      console.log('[USER_DATA] initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe);
      console.log('[USER_DATA] user object:', window.Telegram?.WebApp?.initDataUnsafe?.user);
      
      const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      console.log('[USER_DATA] Raw telegramId:', telegramId, 'type:', typeof telegramId);
      
      if (!telegramId || typeof telegramId !== 'number') {
        console.log('[USER_DATA] No valid telegram user found - telegramId:', telegramId);
        setError('No Telegram user found');
        setLoading(false);
        return;
      }

      console.log('[USER_DATA] Fetching data from user_status_public for telegram_id:', telegramId);

      // Fetch from user_status_public view instead of users table
      const { data, error } = await supabase
        .from('user_status_public')
        .select('gems, messages_today, subscription_type')
        .eq('telegram_id', telegramId)
        .maybeSingle();

      if (error) {
        console.error('[USER_DATA] Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.log('[USER_DATA] No user found with telegram_id:', telegramId);
        setError('User not found in database');
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
    // Always try to fetch data if Telegram is available or in dev mode
    fetchUserData();
  }, [isDevMode]);

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