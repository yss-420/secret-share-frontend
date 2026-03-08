import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

export interface UserStats {
  gems: number;
  total_messages: number;
  messages_today: number;
  subscription_type: string | null;
  subscription_end: string | null;
  tier: string;
}

export interface GemPurchase {
  gems: number;
  price: string;
  package_type: string;
}

class ApiService {
  async getUserStatus(telegramId: number): Promise<Pick<UserStats, 'gems' | 'messages_today' | 'subscription_type'> | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-user-status', {
        body: { telegram_id: telegramId }
      });

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching user status:', error);
        return null;
      }

      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching user status:', error);
      return null;
    }
  }

  async purchaseGems(purchase: GemPurchase): Promise<boolean> {
    try {
      // Gem purchases are handled through Railway backend invoice flow (Store.tsx)
      // This method is kept for API compatibility but should not be called directly
      if (import.meta.env.DEV) {
        toast({
          title: "Purchase Successful!",
          description: `You've received ${purchase.gems} gems!`,
        });
        return true;
      }

      toast({
        title: "Use Store",
        description: "Please purchase gems through the Store page.",
      });
      return false;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Gem purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process your purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  async getTransactionHistory(telegramId: number): Promise<Transaction[]> {
    try {
      // Route through get-user-status or direct query with telegram_id (bigint, not UUID)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', telegramId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to fetch transaction history:', error);
      return [];
    }
  }

  async updateUserSettings(userId: string, settings: Record<string, any>): Promise<boolean> {
    try {
      localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
      return true;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to update settings:', error);
      toast({
        title: "Update Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  async getUserSettings(userId: string): Promise<Record<string, any>> {
    try {
      const stored = localStorage.getItem(`user_settings_${userId}`);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to get user settings:', error);
      return {};
    }
  }

  async claimDailyReward(telegramId: number): Promise<boolean> {
    try {
      const lastClaim = localStorage.getItem(`daily_claim_${telegramId}`);
      const today = new Date().toDateString();

      if (lastClaim === today) {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily reward today!",
          variant: "destructive",
        });
        return false;
      }

      // Call the claim-daily-reward edge function
      const { data, error } = await supabase.functions.invoke('claim-daily-reward', {
        body: { telegram_id: telegramId }
      });

      if (error) throw error;

      if (data?.awarded) {
        localStorage.setItem(`daily_claim_${telegramId}`, today);
        toast({
          title: "Daily Reward Claimed!",
          description: `You've received ${data.amount || 10} gems!`,
        });
        return true;
      } else {
        localStorage.setItem(`daily_claim_${telegramId}`, today);
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily reward today!",
        });
        return false;
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to claim daily reward:', error);
      toast({
        title: "Claim Failed",
        description: "Unable to claim reward. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }
}

export const apiService = new ApiService();
