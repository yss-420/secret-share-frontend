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
  const { user, telegramUser } = useAuth();
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

      // Get telegram_id from multiple sources - prioritize real Telegram user
      let telegramId = null;
      
      // First try to get from Telegram WebApp user
      if (telegramUser?.id) {
        telegramId = telegramUser.id;
        console.log('🔍 Using Telegram WebApp user ID:', telegramId);
      }
      // Fallback to authenticated user telegram_id
      else if (user?.telegram_id) {
        telegramId = user.telegram_id;
        console.log('🔍 Using authenticated user telegram_id:', telegramId);
      }
      
      if (!telegramId) {
        console.log('❌ No telegram_id found in user or telegramUser');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching header stats for telegram_id:', telegramId);
        
        // Use the new dedicated header stats function
        const { data, error } = await supabase
          .rpc('get_header_stats', { p_telegram_id: telegramId });

        console.log('📊 Header stats response:', { data, error });

        if (error) {
          console.error('🚨 Supabase error details:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('⚠️ No header stats found for telegram_id:', telegramId);
          setStats({
            gems: 100,
            messages_today: 0,
            subscription_type: 'free'
          });
          return;
        }

        const userStats = data[0];
        console.log('✅ Successfully fetched header stats:', userStats);
        setStats({
          gems: userStats.gems || 100,
          messages_today: userStats.messages_today || 0,
          subscription_type: userStats.subscription_type || 'free'
        });
      } catch (error) {
        console.error('💥 Failed to fetch header stats:', error);
        // Set default values on error
        setStats({
          gems: 100,
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

    // Note: Real-time updates removed for security - views can't have proper RLS
    // Users will see updates on page refresh or when the hook re-runs
  }, [user?.telegram_id, telegramUser?.id, isDevMode, devUser]);

  return { stats, loading };
};