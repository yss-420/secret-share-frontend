import { useState, useEffect } from 'react';
import { useDevMode } from '@/hooks/useDevMode';

interface HeaderStats {
  gems: number;
  messages_today: number;
  subscription_type: string;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://pfuyxdqzbrjrtqlbkbku.supabase.co/functions/v1';
const FRONTEND_SECRET_KEY = import.meta.env.VITE_FRONTEND_SECRET_KEY;

async function fetchHeaderStats() {
  const tg = (window as any)?.Telegram?.WebApp?.initDataUnsafe;
  const telegram_id = Number(tg?.user?.id);
  
  if (!telegram_id) {
    throw new Error('No telegram_id available');
  }
  
  const res = await fetch(`${API_BASE}/api/user-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${FRONTEND_SECRET_KEY}`
    },
    body: JSON.stringify({ telegram_id })
  });
  
  if (!res.ok) throw new Error('status fetch failed');
  const { gems, messages_today, subscription_type } = await res.json();
  return { gems, messagesToday: messages_today, tier: subscription_type };
}

export const useHeaderStats = () => {
  const [stats, setStats] = useState<HeaderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDevMode, devUser } = useDevMode();

  useEffect(() => {
    const loadStats = async () => {
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

      try {
        console.log('🔍 Fetching header stats from API');
        const { gems, messagesToday, tier } = await fetchHeaderStats();
        
        setStats({
          gems,
          messages_today: messagesToday,
          subscription_type: tier
        });
        console.log('✅ Successfully fetched header stats:', { gems, messagesToday, tier });
      } catch (error) {
        console.error('💥 Failed to fetch header stats:', error);
        // Set placeholder values on error (will show as "—" in UI)
        setStats({
          gems: 0,
          messages_today: 0,
          subscription_type: 'free'
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isDevMode, devUser]);

  return { stats, loading };
};