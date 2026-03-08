import { useState, useEffect } from 'react';
import { useDevMode } from '@/hooks/useDevMode';
import { supabase } from '@/integrations/supabase/client';

interface HeaderStats {
  gems: number;
  messages_today: number;
  subscription_type: string;
  daily_limit: number | null;
  intro: {
    is_active: boolean;
    start_at?: string;
    end_at?: string;
    seconds_remaining?: number;
  } | null;
}


async function fetchHeaderStats() {
  const tg = (window as any)?.Telegram?.WebApp;
  let telegram_id = null;

  if (tg?.initDataUnsafe?.user?.id) {
    telegram_id = Number(tg.initDataUnsafe.user.id);
  }

  if (!telegram_id && tg?.initData) {
    try {
      const urlParams = new URLSearchParams(tg.initData);
      const userParam = urlParams.get('user');
      if (userParam) {
        const userData = JSON.parse(decodeURIComponent(userParam));
        if (userData.id) {
          telegram_id = Number(userData.id);
        }
      }
    } catch {
      // Silently fail
    }
  }

  if (!telegram_id && tg?.WebAppUser?.id) {
    telegram_id = Number(tg.WebAppUser.id);
  }

  if (!telegram_id) {
    throw new Error('No telegram_id available');
  }

  const { data, error } = await supabase.functions.invoke('get-user-status', {
    body: { telegram_id }
  });

  if (error) {
    throw new Error(`API request failed: ${error.message}`);
  }

  const { gems, messages_today, subscription_type, daily_limit, intro } = data;
  return { gems, messagesToday: messages_today, tier: subscription_type, dailyLimit: daily_limit ?? null, intro: intro ?? null };
}

export const useHeaderStats = () => {
  const [stats, setStats] = useState<HeaderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDevMode, devUser } = useDevMode();

  useEffect(() => {
    const loadStats = async () => {
      if (isDevMode && devUser) {
        setStats({
          gems: devUser.gems,
          messages_today: devUser.messages_today,
          subscription_type: devUser.subscription_type || 'free',
          daily_limit: 50,
          intro: null
        });
        setLoading(false);
        return;
      }

      const tg = (window as any)?.Telegram?.WebApp?.initDataUnsafe;
      const telegram_id = Number(tg?.user?.id);

      if (!telegram_id && !isDevMode) {
        setStats({
          gems: 0,
          messages_today: 0,
          subscription_type: 'free',
          daily_limit: 50,
          intro: null
        });
        setLoading(false);
        return;
      }

      try {
        const { gems, messagesToday, tier, dailyLimit, intro } = await fetchHeaderStats();

        setStats({
          gems,
          messages_today: messagesToday,
          subscription_type: tier,
          daily_limit: dailyLimit,
          intro
        });
      } catch {
        setStats({
          gems: 0,
          messages_today: 0,
          subscription_type: 'free',
          daily_limit: 50,
          intro: null
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isDevMode, devUser]);

  return { stats, loading };
};
