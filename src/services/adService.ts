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
  remaining_today?: number;
  next_available_at?: string;
  cooldown_seconds?: number;
}

export interface AdStatusResponse {
  status: 'started' | 'completed' | 'closed' | 'rejected' | 'expired' | 'failed';
  gems_awarded?: number;
}

export type AdType = 'interstitial' | 'quick' | 'bonus';

class AdService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL || 'https://secret-share-backend-production.up.railway.app';
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
  // Returns SDK result for pop/rewarded ads (contains reward_event_type)
  async showMonetag(type?: 'inApp' | 'pop', sessionId?: string): Promise<any> {
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
          options.inAppSettings = {
            frequency: 2,
            capping: 0.1,
            interval: 30,
            timeout: 5,
            everyPage: false
          };
          if (sessionId) {
            options.ymid = sessionId;
            options.requestVar = sessionId;
          }
          console.log('[AdService] Calling show_9674140 with inApp options:', options);
          monetag(options)
            .then((result: any) => resolve(result))
            .catch((error: any) => reject(error));
        } else if (type === 'pop') {
          // Monetag SDK expects a single options object, NOT ('pop', options)
          // See: https://docs.monetag.com/docs/sdk-reference/
          options.type = 'pop';
          console.log('[AdService] Calling show_9674140 with pop options:', options);
          monetag(options)
            .then((result: any) => resolve(result))
            .catch((error: any) => reject(error));
        } else {
          // Default rewarded interstitial
          monetag(sessionId ? options : undefined)
            .then((result: any) => resolve(result))
            .catch((error: any) => reject(error));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Quick earn rewarded ad (10 gems) - Max 5 per day
  async showQuickEarnAd(userId: number): Promise<{ success: boolean; message: string; gemsAdded?: number; remaining_today?: number; next_available_at?: string; cooldown_seconds?: number }> {
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

        // Monetag SDK resolved — the ad was shown. Try the backend complete call
        // (which credits gems for quick ads). The webhook may also fire, but the
        // backend is idempotent so double-calling is safe.
        const result = await this.completeAdSession(userId, 'quick', session.session_id, true);

        this.markRewardedAdWatched();

        if (result.ok) {
          return {
            success: true,
            message: `+${result.gems_awarded || 10} gems`,
            gemsAdded: result.gems_awarded || 10,
            remaining_today: result.remaining_today,
            next_available_at: result.next_available_at,
            cooldown_seconds: result.cooldown_seconds
          };
        }

        // Backend didn't confirm — poll for webhook completion as fallback
        let status = 'started';
        let attempts = 0;
        const maxAttempts = 15; // 30 seconds
        while (status !== 'completed' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const statusResponse = await this.getAdStatus(session.session_id);
          status = statusResponse.status;
          attempts++;
          if (status === 'completed') {
            this.markRewardedAdWatched();
            return {
              success: true,
              message: `+${statusResponse.gems_awarded || 10} gems`,
              gemsAdded: statusResponse.gems_awarded || 10,
            };
          }
        }

        return {
          success: false,
          message: result.message || 'Watch the full video to earn gems.'
        };
      } catch (error) {
        console.error('Quick earn ad failed:', error);
        try {
          await this.completeAdSession(userId, 'quick', session.session_id, false);
        } catch {
          // Best-effort cleanup
        }
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
        const sdkResult = await this.showMonetag('pop', session.session_id);

        // If SDK returns reward_event_type=valued, complete immediately from frontend
        // (like quick ads do). This bypasses the webhook which may not fire for pop ads.
        if (sdkResult?.reward_event_type === 'valued') {
          console.log('[AdService] Bonus ad SDK returned valued, completing from frontend');
          try {
            const result = await this.completeAdSession(userId, 'bonus', session.session_id, true);
            if (result.ok) {
              this.markRewardedAdWatched();
              return {
                success: true,
                message: `+${result.gems_awarded || 50} gems`,
                gemsAdded: result.gems_awarded || 50
              };
            }
          } catch (e) {
            console.error('[AdService] Frontend bonus complete failed, falling through to poll:', e);
          }
        }

        // Fallback: poll for completion status via webhook
        // Extended timeout to 120s (offer walls can take a while).
        let status = 'started';
        let attempts = 0;
        const maxAttempts = 60; // 120 seconds (2s intervals)

        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const statusResponse = await this.getAdStatus(session.session_id);
          status = statusResponse.status;
          attempts++;

          if (status === 'completed') {
            this.markRewardedAdWatched();
            return {
              success: true,
              message: `+${statusResponse.gems_awarded || 50} gems`,
              gemsAdded: statusResponse.gems_awarded || 50
            };
          }

          // Stop polling if the session was explicitly rejected or errored
          if (status === 'rejected' || status === 'error' || status === 'closed') {
            return {
              success: false,
              message: 'Offer was not completed. Try again later.'
            };
          }
        }

        return {
          success: false,
          message: 'Offer timed out. If you completed it, gems will be credited shortly.'
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
  // Paid tiers: essential, plus, premium — these should NEVER see ads
  isPaidUser(subscriptionType?: string): boolean {
    if (!subscriptionType || subscriptionType === 'free') return false;
    // Intro users get limited ads, not ad-free
    if (subscriptionType === 'intro') return false;
    return true;
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