
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
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost';
    const hasDevParam = new URLSearchParams(window.location.search).has('dev');

    // Only enable dev mode in actual development environments
    const isDevEnvironment =
      import.meta.env.MODE === 'development' ||
      isLocalhost ||
      (import.meta.env.DEV && hasDevParam);

    setIsDevMode(isDevEnvironment);
  }, []);

  const getDevUser = () => isDevMode ? DEV_USER : null;

  return {
    isDevMode,
    devUser: getDevUser()
  };
};
