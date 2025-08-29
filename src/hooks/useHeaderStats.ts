import { useState, useEffect } from 'react';
import { useDevMode } from '@/hooks/useDevMode';

interface HeaderStats {
  gems: number;
  messages_today: number;
  subscription_type: string;
  daily_limit: number | null;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://pfuyxdqzbrjrtqlbkbku.supabase.co/functions/v1';
const FRONTEND_SECRET_KEY = import.meta.env.VITE_FRONTEND_SECRET_KEY;

async function fetchHeaderStats() {
  // Try multiple methods to get telegram_id for real users
  const tg = (window as any)?.Telegram?.WebApp;
  let telegram_id = null;

  // Method 1: From initDataUnsafe (most common)
  if (tg?.initDataUnsafe?.user?.id) {
    telegram_id = Number(tg.initDataUnsafe.user.id);
  }
  
  // Method 2: From initData parsed (fallback)
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
    } catch (e) {
      console.warn('Failed to parse initData:', e);
    }
  }

  // Method 3: Direct from WebApp object (last resort)
  if (!telegram_id && tg?.WebAppUser?.id) {
    telegram_id = Number(tg.WebAppUser.id);
  }

  console.log('🔍 Telegram ID extraction:', { 
    hasWebApp: !!tg,
    hasInitDataUnsafe: !!tg?.initDataUnsafe,
    hasInitData: !!tg?.initData,
    telegram_id,
    initDataUnsafe: tg?.initDataUnsafe,
    webAppVersion: tg?.version
  });
  
  if (!telegram_id) {
    throw new Error('No telegram_id available from any method');
  }

  console.log('🌐 Making API request for real user:', telegram_id);
  
  const res = await fetch(`${API_BASE}/api/user-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${FRONTEND_SECRET_KEY}`
    },
    body: JSON.stringify({ telegram_id })
  });
  
  console.log('📡 API Response status:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ API Error:', errorText);
    throw new Error(`API request failed: ${res.status} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('✅ Real user data received:', data);
  
  const { gems, messages_today, subscription_type, daily_limit } = data;
  return { gems, messagesToday: messages_today, tier: subscription_type, dailyLimit: daily_limit ?? null };
}

export const useHeaderStats = () => {
  const [stats, setStats] = useState<HeaderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDevMode, devUser } = useDevMode();

  console.log('📊 useHeaderStats render:', { isDevMode, devUser: !!devUser, loading });

  useEffect(() => {
    const loadStats = async () => {
      console.log('🚀 loadStats called with:', { isDevMode, devUser: !!devUser });
      
      // In dev mode, use dev user data directly
      if (isDevMode && devUser) {
        console.log('🔧 Using dev mode stats:', devUser);
        setStats({
          gems: devUser.gems,
          messages_today: devUser.messages_today,
          subscription_type: devUser.subscription_type || 'free',
          daily_limit: 50
        });
        setLoading(false);
        return;
      }

      // Skip API call if no dev mode but also no Telegram data
      const tg = (window as any)?.Telegram?.WebApp?.initDataUnsafe;
      const telegram_id = Number(tg?.user?.id);
      
      if (!telegram_id && !isDevMode) {
        console.log('⚠️ No Telegram ID and not in dev mode - using fallback');
        setStats({
          gems: 0,
          messages_today: 0,
          subscription_type: 'free',
          daily_limit: 50
        });
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching header stats from API');
        const { gems, messagesToday, tier, dailyLimit } = await fetchHeaderStats();
        
        setStats({
          gems,
          messages_today: messagesToday,
          subscription_type: tier,
          daily_limit: dailyLimit
        });
        console.log('✅ Successfully fetched header stats:', { gems, messagesToday, tier, dailyLimit });
      } catch (error) {
        console.error('💥 Failed to fetch header stats:', error);
        // Set placeholder values on error (will show as "—" in UI)
        setStats({
          gems: 0,
          messages_today: 0,
          subscription_type: 'free',
          daily_limit: 50
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isDevMode, devUser]);

  return { stats, loading };
};