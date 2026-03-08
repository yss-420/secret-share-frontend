import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from './useDevMode';
import { UserStats, apiService } from '@/services/api';

export const useUserData = () => {
  const { user, isAuthenticated, telegramUser } = useAuth();
  const { isDevMode, devUser } = useDevMode();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isDevMode && devUser) {
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

      const telegramId = telegramUser?.id;
      if (!telegramId) {
        setLoading(false);
        return;
      }

      // Use edge function only (bypasses RLS via service_role)
      const backend = await apiService.getUserStatus(telegramId);
      if (backend) {
        setUserStats({
          gems: backend.gems,
          messages_today: backend.messages_today,
          subscription_type: backend.subscription_type,
          total_messages: user?.total_messages ?? 0,
          subscription_end: user?.subscription_end ?? null,
          tier: user?.tier || backend.subscription_type || 'free'
        });
      } else if (user) {
        // Fallback: use AuthContext user data
        setUserStats({
          gems: user.gems ?? 0,
          total_messages: user.total_messages ?? 0,
          messages_today: user.messages_today ?? 0,
          subscription_type: user.subscription_type ?? null,
          subscription_end: user.subscription_end ?? null,
          tier: user.tier || 'free'
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch user data:', err);
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

  // Real-time subscription for gem updates
  useEffect(() => {
    if (!telegramUser?.id || isDevMode) return;

    const channel = supabase
      .channel('user-data-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `telegram_id=eq.${telegramUser.id}`
        },
        (payload) => {
          if (payload.new) {
            setUserStats(prev => ({
              ...prev,
              gems: (payload.new as any).gems,
              total_messages: (payload.new as any).total_messages,
              messages_today: (payload.new as any).messages_today,
              subscription_type: (payload.new as any).subscription_type,
              subscription_end: (payload.new as any).subscription_end,
              tier: (payload.new as any).tier
            } as UserStats));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramUser?.id, isDevMode]);

  return {
    userStats,
    loading,
    error,
    refreshUserData: fetchUserData,
    updateGems
  };
};
