import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderStats {
  gems: number;
  messages_today: number;
  tier: string;
  subscription_end: string | null;
}

export const useHeaderStats = () => {
  const [stats, setStats] = useState<HeaderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { telegramUser } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!telegramUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('gems, messages_today, tier, subscription_end')
          .eq('telegram_id', telegramUser.id)
          .single();

        if (error) throw error;

        setStats({
          gems: data.gems || 0,
          messages_today: data.messages_today || 0,
          tier: data.tier || 'free',
          subscription_end: data.subscription_end
        });
      } catch (error) {
        console.error('Failed to fetch header stats:', error);
        // Set default values on error
        setStats({
          gems: 0,
          messages_today: 0,
          tier: 'free',
          subscription_end: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription for updates
    const channel = supabase
      .channel('header-stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `telegram_id=eq.${telegramUser?.id}`
        },
        (payload) => {
          const newData = payload.new as any;
          setStats({
            gems: newData.gems || 0,
            messages_today: newData.messages_today || 0,
            tier: newData.tier || 'free',
            subscription_end: newData.subscription_end
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramUser?.id]);

  return { stats, loading };
};