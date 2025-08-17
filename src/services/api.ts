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
  async getUserStatus(telegramId: string): Promise<{ gems: number; messages_today: number; subscription_type: string | null; } | null> {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const frontendSecretKey = import.meta.env.VITE_FRONTEND_SECRET_KEY;

      console.log('[API_SERVICE] Environment check:', {
        hasBackendUrl: !!backendUrl,
        hasFrontendSecret: !!frontendSecretKey,
        telegramId: telegramId
      });
      console.log('[API_SERVICE] Calling URL:', `${backendUrl}/api/user-status`);

      const response = await fetch(`${backendUrl}/api/user-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${frontendSecretKey}`
        },
        body: JSON.stringify({ telegram_id: telegramId })
      });

      if (!response.ok) {
        console.error('[API_SERVICE] Backend API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      console.log('[API_SERVICE] Backend API response:', data);

      return {
        gems: data.gems || 0,
        messages_today: data.messages_today || 0,
        subscription_type: data.subscription_type || null
      };
    } catch (error) {
      console.error('[API_SERVICE] Failed to fetch user status:', error);
      return null;
    }
  }

  async purchaseGems(purchase: GemPurchase): Promise<boolean> {
    try {
      // In development, simulate successful purchase
      if (import.meta.env.DEV) {
        toast({
          title: "Purchase Successful!",
          description: `You've received ${purchase.gems} gems!`,
        });
        return true;
      }

      // TODO: Implement actual payment processing
      // This would typically involve calling a payment processor
      const { error } = await supabase.functions.invoke('process-gem-purchase', {
        body: purchase
      });

      if (error) throw error;

      toast({
        title: "Purchase Successful!",
        description: `You've received ${purchase.gems} gems!`,
      });
      return true;
    } catch (error) {
      console.error('Gem purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process your purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      return [];
    }
  }

  async updateUserSettings(userId: string, settings: Record<string, any>): Promise<boolean> {
    try {
      // For now, store settings in local storage
      // In production, this would sync to Supabase
      localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
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
      console.error('Failed to get user settings:', error);
      return {};
    }
  }

  async claimDailyReward(userId: string): Promise<boolean> {
    try {
      // Check if already claimed today
      const lastClaim = localStorage.getItem(`daily_claim_${userId}`);
      const today = new Date().toDateString();
      
      if (lastClaim === today) {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily reward today!",
          variant: "destructive",
        });
        return false;
      }

      // Simulate claiming reward
      localStorage.setItem(`daily_claim_${userId}`, today);
      
      toast({
        title: "Daily Reward Claimed!",
        description: "You've received 10 free gems!",
      });
      return true;
    } catch (error) {
      console.error('Failed to claim daily reward:', error);
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