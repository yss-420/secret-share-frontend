
import { useState, useEffect } from 'react';

interface DevUser {
  id: string;
  telegram_id: number;
  user_name: string;
  username: string;
  gems: number;
  total_messages: number;
  messages_today: number;
  subscription_type: string | null;
  subscription_end: string | null;
  tier: string;
}

const DEV_USER: DevUser = {
  id: 'dev-user-123',
  telegram_id: 123456789,
  user_name: 'Dev User',
  username: 'devuser',
  gems: 250,
  total_messages: 42,
  messages_today: 5,
  subscription_type: null,
  subscription_end: null,
  tier: 'free'
};

export const useDevMode = () => {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Only enable dev mode with explicit ?dev=true parameter
    const hasDevParam = new URLSearchParams(window.location.search).get('dev') === 'true';
    
    console.log('[DEV_MODE] Check:', { 
      hasDevParam, 
      hostname: window.location.hostname,
      isDev: import.meta.env.DEV,
      finalDevMode: hasDevParam
    });
    
    setIsDevMode(hasDevParam);
  }, []);

  const getDevUser = () => isDevMode ? DEV_USER : null;

  return {
    isDevMode,
    devUser: getDevUser()
  };
};
