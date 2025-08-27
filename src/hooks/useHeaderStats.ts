import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/hooks/useDevMode';

interface HeaderStats {
  gems: number;
  messages_today: number;
  subscription_type: string;
}

export const useHeaderStats = () => {
  const [stats, setStats] = useState<HeaderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { telegramUser } = useAuth();
  const { isDevMode, devUser } = useDevMode();

  useEffect(() => {
    const fetchStats = async () => {
      // In dev mode, use dev user data directly
      if (isDevMode && devUser) {
        console.log('🔧 Using dev mode stats:', devUser);
        setStats({
          gems: devUser.gems,
          messages_today: devUser.messages_today,
          subscription_type: devUser.subscription_type || 'free'
        });
        setLoading(false);
        return;
      }

      // Get the correct telegram_id - use telegram_id field if available (dev mode), otherwise use id
      const telegramId = telegramUser?.telegram_id || telegramUser?.id;
      
      if (!telegramId) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching header stats for telegram_id:', telegramId);
        
        const { data, error } = await supabase
          .from('user_status_public')
          .select('gems, messages_today, subscription_type')
          .eq('telegram_id', telegramId)
          .maybeSingle();

        console.log('📊 Supabase response:', { data, error });

        if (error) {
          console.error('🚨 Supabase error details:', error);
          throw error;
        }

        if (!data) {
          console.log('⚠️ No user data found for telegram_id:', telegramId);
          setStats({
            gems: 0,
            messages_today: 0,
            subscription_type: 'free'
          });
          return;
        }

        console.log('✅ Successfully fetched user stats:', data);
        setStats({
          gems: data.gems || 0,
          messages_today: data.messages_today || 0,
          subscription_type: data.subscription_type || 'free'
        });
      } catch (error) {
        console.error('💥 Failed to fetch header stats:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        // Set default values on error
        setStats({
          gems: 0,
          messages_today: 0,
          subscription_type: 'free'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Skip real-time updates in dev mode
    if (isDevMode) {
      return;
    }

    // Set up real-time subscription for updates on the users table since user_status_public is a view
    const telegramId = telegramUser?.telegram_id || telegramUser?.id;
    const channel = supabase
      .channel('header-stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `telegram_id=eq.${telegramId}`
        },
        (payload) => {
          const newData = payload.new as any;
          setStats({
            gems: newData.gems || 0,
            messages_today: newData.messages_today || 0,
            subscription_type: newData.subscription_type || 'free'
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramUser?.id, telegramUser?.telegram_id, isDevMode, devUser]);

  return { stats, loading };
};