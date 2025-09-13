import { supabase } from '@/integrations/supabase/client';

export interface AdEligibilityResponse {
  allowed: boolean;
  next_available_at?: string;
  remaining_today?: number;
  cooldown_seconds?: number;
  reason?: string;
}

export interface AdStartResponse {
  session_id: string;
  zone: string;
}

export interface AdCompleteResponse {
  ok: boolean;
  gems_awarded?: number;
  message?: string;
}

export interface AdStatusResponse {
  status: 'started' | 'completed' | 'failed';
  gems_awarded?: number;
}

export type AdType = 'interstitial' | 'quick' | 'bonus';

class AdService {
  private baseUrl = 'https://secret-share-backend-production.up.railway.app';
  private isAdRunning = false;

  // Debounce mechanism to ensure only one ad runs at a time
  private async withAdLock<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isAdRunning) {
      throw new Error('Another ad is already running. Please wait.');
    }
    
    this.isAdRunning = true;
    try {
      return await fn();
    } finally {
      this.isAdRunning = false;
    }
  }

  async checkEligibility(userId: number, type: AdType, firstSession = false): Promise<AdEligibilityResponse> {
    try {
      console.log(`[AdService] Checking eligibility: user_id=${userId}, type=${type}, first_session=${firstSession ? 1 : 0}`);
      const response = await fetch(
        `${this.baseUrl}/api/ads/eligibility?user_id=${userId}&type=${type}&first_session=${firstSession ? 1 : 0}`,
        {
          method: 'GET',
          // No Content-Type header on GET to avoid preflight
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ad eligibility check failed:', error);
      return { allowed: false, reason: 'Ad service unavailable' };
    }
  }

  async startAdSession(userId: number, type: AdType): Promise<AdStartResponse> {
    console.log(`[AdService] Starting ad session: user_id=${userId}, type=${type}`);
    const response = await fetch(`${this.baseUrl}/api/ads/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        type,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start ad session: ${response.status}`);
    }

    return await response.json();
  }

  async completeAdSession(
    userId: number,
    type: AdType,
    sessionId: string,
    completed: boolean
  ): Promise<AdCompleteResponse> {
    console.log(`[AdService] Completing ad session: user_id=${userId}, type=${type}, session_id=${sessionId}, completed=${completed}`);
    const response = await fetch(`${this.baseUrl}/api/ads/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        type,
        session_id: sessionId,
        completed,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to complete ad session: ${response.status}`);
    }

    return await response.json();
  }

  async getAdStatus(sessionId: string): Promise<AdStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/ads/status?session_id=${sessionId}`, {
      method: 'GET',
      // No Content-Type header on GET to avoid preflight
    });

    if (!response.ok) {
      throw new Error(`Failed to get ad status: ${response.status}`);
    }

    return await response.json();
  }

  // Monetag SDK wrapper - now public for direct use in usePassiveAd
  async showMonetag(type?: 'inApp' | 'pop', sessionId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Check if Monetag SDK is available
        if (typeof (window as any).show_9674140 !== 'function') {
          throw new Error('Monetag SDK not loaded');
        }

        const monetag = (window as any).show_9674140;
        
        // Create options object with session ID for postback tracking
        const options: any = {};
        if (sessionId) {
          options.ymid = sessionId; // Pass session_id as YMID for postback tracking
          options.requestVar = sessionId; // Pass session_id as requestVar for safety
        }
        
        if (type === 'inApp') {
          options.type = 'inApp';
          if (sessionId) {
            options.ymid = sessionId;
            options.requestVar = sessionId;
          }
          console.log('[AdService] Calling show_9674140 with options:', options);
          monetag(options)
            .then(() => resolve())
            .catch((error: any) => reject(error));
        } else if (type === 'pop') {
          monetag('pop', options)
            .then(() => resolve())
            .catch((error: any) => reject(error));
        } else {
          // Default rewarded interstitial
          monetag(sessionId ? options : undefined)
            .then(() => resolve())
            .catch((error: any) => reject(error));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Quick earn rewarded ad (10 gems) - Max 5 per day
  async showQuickEarnAd(userId: number): Promise<{ success: boolean; message: string; gemsAdded?: number }> {
    return this.withAdLock(async () => {
      const eligibility = await this.checkEligibility(userId, 'quick');
      
      if (!eligibility.allowed) {
        return { 
          success: false, 
          message: eligibility.reason || 'Ad not available right now'
        };
      }

      const session = await this.startAdSession(userId, 'quick');
      
      try {
        await this.showMonetag(undefined, session.session_id);
        const result = await this.completeAdSession(userId, 'quick', session.session_id, true);
        
        // Mark that a rewarded ad was just watched
        this.markRewardedAdWatched();
        
        if (result.ok) {
          return {
            success: true,
            message: `+${result.gems_awarded || 10} gems`,
            gemsAdded: result.gems_awarded || 10
          };
        } else {
          return {
            success: false,
            message: result.message || 'Watch the full video to earn gems.'
          };
        }
      } catch (error) {
        console.error('Quick earn ad failed:', error);
        await this.completeAdSession(userId, 'quick', session.session_id, false);
        return {
          success: false,
          message: 'Watch the full video to earn gems.'
        };
      }
    });
  }

  // Big bonus rewarded popup (50 gems) - Max 1 per week
  async showBigBonusAd(userId: number): Promise<{ success: boolean; message: string; gemsAdded?: number }> {
    return this.withAdLock(async () => {
      const eligibility = await this.checkEligibility(userId, 'bonus');
      
      if (!eligibility.allowed) {
        return { 
          success: false, 
          message: eligibility.reason || 'Bonus not available yet'
        };
      }

      const session = await this.startAdSession(userId, 'bonus');
      
      try {
        await this.showMonetag('pop', session.session_id);
        
        // Poll for completion status
        let status = 'started';
        let attempts = 0;
        const maxAttempts = 30;
        
        while (status !== 'completed' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const statusResponse = await this.getAdStatus(session.session_id);
          status = statusResponse.status;
          attempts++;
          
          if (status === 'completed') {
            // Mark that a rewarded ad was just watched
            this.markRewardedAdWatched();
            return {
              success: true,
              message: `+${statusResponse.gems_awarded || 50} gems`,
              gemsAdded: statusResponse.gems_awarded || 50
            };
          }
        }
        
        return {
          success: false,
          message: 'Offer not completed yet.'
        };
      } catch (error) {
        console.error('Big bonus ad failed:', error);
        return {
          success: false,
          message: 'Ad unavailable, try again soon.'
        };
      }
    });
  }


  // Check if user has paid subscription that should hide ads
  isPaidUser(subscriptionType?: string): boolean {
    return subscriptionType !== undefined && 
           subscriptionType !== 'free' && 
           subscriptionType !== null;
  }

  // Check if user is intro tier (gets limited ads)
  isIntroUser(subscriptionType?: string): boolean {
    return subscriptionType === 'intro';
  }

  // Check first session using user-specific localStorage key
  isFirstSession(userId: number): boolean {
    const k = `tma_first_seen_v1_${userId}`;
    const first = !localStorage.getItem(k);
    if (first) localStorage.setItem(k, '1');
    return first;
  }

  // Check if rewarded ad was watched recently (within 2 minutes)
  hasRecentRewardedAd(): boolean {
    const lastRewarded = localStorage.getItem('last_rewarded_ad');
    if (!lastRewarded) return false;
    
    const lastTime = parseInt(lastRewarded);
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    
    return (now - lastTime) < twoMinutes;
  }

  // Mark that a rewarded ad was just watched
  markRewardedAdWatched(): void {
    localStorage.setItem('last_rewarded_ad', Date.now().toString());
  }
}

export const adService = new AdService();