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

      // Use dev data in development mode
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

      // Fetch real user data
      if (user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('gems, total_messages, messages_today, subscription_type, subscription_end, tier')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
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

    const channel = supabase
      .channel('user-data-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            setUserStats(prev => ({
              ...prev,
              gems: payload.new.gems,
              total_messages: payload.new.total_messages,
              messages_today: payload.new.messages_today,
              subscription_type: payload.new.subscription_type,
              subscription_end: payload.new.subscription_end,
              tier: payload.new.tier
            }));
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