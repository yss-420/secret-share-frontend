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

      // Only use dev data in actual development (not production)
      if (isDevMode && devUser && window.location.hostname === 'localhost') {
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

      // Fetch real user data from Supabase
      if (user?.id) {
        const telegramId = parseInt(user.id);
        console.log('[USER_DATA] Fetching data for telegram_id:', telegramId);
        
        if (isNaN(telegramId)) {
          console.error('[USER_DATA] Invalid telegram_id:', user.id);
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('users')
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
      } else {
        console.log('[USER_DATA] No user.id available');
      }
    } catch (err) {
      console.error('[USER_DATA] Failed to fetch user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateGems = (amount: number) => {
    setUserStats(prev => prev ? { ...prev, gems: prev.gems + amount } : null);
  };

  useEffect(() => {
    if (isAuthenticated || isDevMode) {
      fetchUserData();
    }
  }, [isAuthenticated, user, isDevMode]);

  // Set up real-time subscription for gem updates
  useEffect(() => {
    if (!user?.id || isDevMode) return;

    const telegramId = parseInt(user.id);
    if (isNaN(telegramId)) return;

    const channel = supabase
      .channel('user-data-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `telegram_id=eq.${telegramId}`
        },
        (payload) => {
          if (payload.new) {
            setUserStats(prev => prev ? {
              ...prev,
              gems: payload.new.gems || 0,
              messages_today: payload.new.messages_today || 0,
              subscription_type: payload.new.subscription_type
            } : null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, isDevMode]);

  return {
    userStats,
    loading,
    error,
    refreshUserData: fetchUserData,
    updateGems
  };
};