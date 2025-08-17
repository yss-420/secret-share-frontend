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

      // Use dev data in development mode
      if (isDevMode && devUser) {
        console.log('🔧 Using dev mode data:', devUser);
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
      let backendSuccess = false;
      let currentStats: UserStats | null = null;

      // Try backend first for authoritative data
      if (telegramId) {
        try {
          console.log('🌐 Attempting backend fetch for telegram_id:', telegramId);
          const backend = await apiService.getUserStatus(telegramId);
          if (backend) {
            console.log('✅ Backend data received:', backend);
            backendSuccess = true;
            currentStats = {
              gems: backend.gems,
              messages_today: backend.messages_today,
              subscription_type: backend.subscription_type,
              // Default values for fields not from backend
              total_messages: 0,
              subscription_end: null,
              tier: 'free'
            };
          } else {
            console.log('❌ Backend returned null');
          }
        } catch (backendError) {
          console.error('🚨 Backend fetch failed:', backendError);
        }
      }

      // Use Supabase as fallback or to supplement missing fields
      if (telegramId) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('gems, total_messages, messages_today, subscription_type, subscription_end, tier')
            .eq('telegram_id', telegramId)
            .single();

          if (error) throw error;

          if (backendSuccess && currentStats) {
            // Backend succeeded - only supplement missing fields from Supabase
            console.log('📊 Supplementing backend data with Supabase fields');
            currentStats = {
              ...currentStats,
              // Keep backend gems/messages, get other fields from Supabase
              total_messages: data.total_messages,
              subscription_end: data.subscription_end,
              tier: data.tier || 'free'
            };
          } else {
            // Backend failed - use Supabase as complete fallback
            console.log('🔄 Using Supabase as complete fallback:', data);
            currentStats = {
              gems: data.gems,
              total_messages: data.total_messages,
              messages_today: data.messages_today,
              subscription_type: data.subscription_type,
              subscription_end: data.subscription_end,
              tier: data.tier || 'free'
            };
          }
        } catch (supabaseError) {
          console.error('🚨 Supabase fetch failed:', supabaseError);
          if (!backendSuccess) {
            throw supabaseError;
          }
        }
      }

      if (currentStats) {
        console.log('📈 Final user stats:', currentStats);
        setUserStats(currentStats);
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
  }, [telegramUser?.id, isDevMode]);

  return {
    userStats,
    loading,
    error,
    refreshUserData: fetchUserData,
    updateGems
  };
};