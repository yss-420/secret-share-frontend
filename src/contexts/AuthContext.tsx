
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useDevMode } from '@/hooks/useDevMode';
import { Tables } from '@/integrations/supabase/types';
import { WELCOME_GEMS_BONUS } from '@/constants/gems';

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
  const { user: telegramUser, isLoading: telegramLoading, isAuthenticated: telegramAuthenticated, error: telegramError } = useTelegramAuth();
  const { isDevMode, devUser } = useDevMode();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if user is authenticated (either via Telegram or dev mode)
  const isAuthenticated = telegramAuthenticated || isDevMode;

  const refreshUser = async () => {
    try {
      setError(null);
      
      // Use dev user in development mode
      if (isDevMode && devUser) {
        console.log('Using dev user:', devUser);
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

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // User doesn't exist, create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            user_name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
            nickname: telegramUser.first_name,
            gems: WELCOME_GEMS_BONUS,
            tier: 'free'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          setError('Failed to create user account');
        } else {
          setUser(newUser);
        }
      } else if (fetchError) {
        console.error('Error fetching user:', fetchError);
        setError('Failed to fetch user data');
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error in refreshUser:', error);
      setError('Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Don't wait for Telegram if we're in dev mode
    if (isDevMode) {
      refreshUser();
      return;
    }

    // Wait for Telegram auth to complete
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

  // Set up real-time subscription for user data (only in production)
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
