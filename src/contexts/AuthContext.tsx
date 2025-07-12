import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { Tables } from '@/integrations/supabase/types';

type User = Tables<'users'>;

interface AuthContextType {
  user: User | null;
  telegramUser: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: telegramUser, isLoading: telegramLoading, isAuthenticated } = useTelegramAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    if (!telegramUser?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            user_name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
            nickname: telegramUser.first_name,
            gems: 50,
            tier: 'free'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
        } else {
          setUser(newUser);
        }
      } else if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error in refreshUser:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (telegramLoading) return;
    
    if (isAuthenticated && telegramUser) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [telegramUser, isAuthenticated, telegramLoading]);

  // Set up real-time subscription for user data
  useEffect(() => {
    if (!user?.telegram_id) return;

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
  }, [user?.telegram_id]);

  return (
    <AuthContext.Provider value={{
      user,
      telegramUser,
      isLoading: isLoading || telegramLoading,
      isAuthenticated: isAuthenticated && !!user,
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