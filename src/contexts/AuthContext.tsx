
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useDevMode } from '@/hooks/useDevMode';
import { Tables } from '@/integrations/supabase/types';
import { WELCOME_GEMS_BONUS } from '@/constants/gems';
import { toast } from '@/hooks/use-toast';

type User = Tables<'users'>;

interface AuthContextType {
  user: User | null;
  telegramUser: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: telegramUser, initData, isLoading: telegramLoading, isAuthenticated: telegramAuthenticated, error: telegramError } = useTelegramAuth();
  const { isDevMode, devUser } = useDevMode();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dailyClaimAttempted = useRef(false);

  const isAuthenticated = telegramAuthenticated || isDevMode;

  const refreshUser = async () => {
    try {
      setError(null);

      if (isDevMode && devUser) {
        setUser(devUser as User);
        setIsLoading(false);
        return;
      }

      if (!telegramUser?.id) {
        if (telegramError) {
          setError(telegramError);
        }
        setIsLoading(false);
        return;
      }

      // Route through upsert-user edge function (bypasses RLS via service_role)
      if (initData) {
        const { data, error: fnError } = await supabase.functions.invoke('upsert-user', {
          body: { initData }
        });

        if (fnError) {
          // Fallback to get-user-status if upsert-user not deployed yet
          if (import.meta.env.DEV) console.warn('upsert-user failed, using fallback:', fnError);
          await fetchViaGetUserStatus(telegramUser);
        } else if (data?.user) {
          setUser(data.user);

          // Auto-trigger daily reward claim on app open (once per session)
          if (!dailyClaimAttempted.current) {
            dailyClaimAttempted.current = true;
            claimDailyReward(telegramUser.id);
          }
        }
      } else {
        await fetchViaGetUserStatus(telegramUser);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error in refreshUser:', err);
      setError('Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchViaGetUserStatus = async (tgUser: any) => {
    const { data: statusData, error: statusError } = await supabase.functions.invoke('get-user-status', {
      body: { telegram_id: tgUser.id }
    });
    if (!statusError && statusData) {
      setUser({
        telegram_id: tgUser.id,
        username: tgUser.username,
        user_name: tgUser.first_name,
        gems: statusData.gems ?? WELCOME_GEMS_BONUS,
        tier: statusData.subscription_type || 'free',
        messages_today: statusData.messages_today ?? 0,
      } as User);
    } else {
      setError('Failed to fetch user data');
    }
  };

  // Auto-claim daily reward (non-blocking, fire-and-forget)
  const claimDailyReward = async (telegramId: number) => {
    try {
      const lastClaim = localStorage.getItem(`daily_claim_${telegramId}`);
      const today = new Date().toDateString();
      if (lastClaim === today) return;

      const { data, error } = await supabase.functions.invoke('claim-daily-reward', {
        body: { telegram_id: telegramId }
      });

      if (!error && data?.awarded) {
        localStorage.setItem(`daily_claim_${telegramId}`, today);
        toast({
          title: "Daily Bonus Claimed!",
          description: `+${data.amount || 10} Gems! Streak: ${data.streak || 1} day(s)`,
        });
      } else if (!error && data && !data.awarded) {
        localStorage.setItem(`daily_claim_${telegramId}`, today);
      }
    } catch {
      // Non-critical — silently fail
    }
  };

  useEffect(() => {
    if (isDevMode) {
      refreshUser();
      return;
    }

    if (telegramLoading) return;

    if (isAuthenticated && telegramUser) {
      refreshUser();
    } else {
      setIsLoading(false);
      if (telegramError) {
        setError(telegramError);
      }
    }
  }, [telegramUser, telegramAuthenticated, telegramLoading, telegramError, isDevMode]);

  // Real-time subscription for user data updates
  useEffect(() => {
    if (!user?.telegram_id || isDevMode) return;

    const channel = supabase
      .channel('user_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `telegram_id=eq.${user.telegram_id}`
        },
        (payload) => {
          setUser(payload.new as User);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.telegram_id, isDevMode]);

  return (
    <AuthContext.Provider value={{
      user,
      telegramUser: telegramUser || (isDevMode ? devUser : null),
      isLoading: isDevMode ? false : isLoading,
      isAuthenticated,
      error,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
