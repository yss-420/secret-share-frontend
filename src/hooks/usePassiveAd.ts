import { useEffect } from 'react';

const isDev = import.meta.env.DEV;
const log = (...args: any[]) => { if (isDev) console.log('[usePassiveAd]', ...args); };
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://secret-share-backend-production.up.railway.app';

export const usePassiveAd = (
  userId?: number,
  subscriptionType?: string,
  suppressAfterPayment = false
) => {
  useEffect(() => {
    const runPassiveAd = async () => {
      if (!userId) return;

      // Don't show ads to paid users
      if (subscriptionType && subscriptionType !== 'free') return;

      // Suppress after recent payment
      if (suppressAfterPayment) return;

      const now = Date.now();
      const lastShown = (window as any).__passiveShownTime || 0;
      const oneHour = 60 * 60 * 1000;

      if ((window as any).__passiveShown && (now - lastShown) < oneHour) return;
      (window as any).__passiveShown = true;
      (window as any).__passiveShownTime = now;

      try {
        const [sdkReady, eligibility] = await Promise.all([
          waitForSDK(),
          checkEligibility(userId)
        ]);

        if (!sdkReady || !eligibility.allowed) {
          log('Skipping:', !sdkReady ? 'SDK not ready' : eligibility.reason);
          return;
        }

        const startResponse = await fetch(`${BACKEND_URL}/api/ads/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, type: 'interstitial' })
        });

        if (!startResponse.ok) return;

        const session = await startResponse.json();

        // Show the ad — Monetag SDK call.
        // Interstitials are impression-based: Monetag does NOT fire postbacks
        // for inApp ads, so we must mark completion from the frontend when
        // the SDK resolves (meaning the ad was displayed). This is safe
        // because interstitials award 0 gems.
        try {
          await showMonetag(session.session_id);
          log('Monetag SDK call resolved for session:', session.session_id);
          // Mark as completed — interstitials give 0 gems, no exploit risk
          try {
            await fetch(`${BACKEND_URL}/api/ads/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: userId,
                type: 'interstitial',
                session_id: session.session_id,
                completed: true
              })
            });
          } catch {
            // Best-effort — session will expire via cron if this fails
          }
        } catch (sdkError) {
          log('Monetag SDK call rejected:', sdkError);
          // Mark as closed since the ad didn't show properly
          try {
            await fetch(`${BACKEND_URL}/api/ads/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: userId,
                type: 'interstitial',
                session_id: session.session_id,
                completed: false
              })
            });
          } catch {
            // Best-effort cleanup
          }
          return;
        }

      } catch (error) {
        if (isDev) console.error('[usePassiveAd] Failed:', error);
      }
    };

    const waitForSDK = async (): Promise<boolean> => {
      let attempts = 0;
      while (typeof (window as any).show_9674140 !== 'function' && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      return typeof (window as any).show_9674140 === 'function';
    };

    const checkEligibility = async (userId: number) => {
      const response = await fetch(
        `${BACKEND_URL}/api/ads/eligibility?user_id=${userId}&type=interstitial&first_session=0`
      );
      if (!response.ok) throw new Error(`Eligibility check failed: ${response.status}`);
      return await response.json();
    };

    const showMonetag = async (sessionId: string) => {
      try {
        const monetag = (window as any).show_9674140;
        await monetag({ type: 'inApp', ymid: sessionId, requestVar: sessionId });
      } catch {
        // Retry once after delay
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
        const monetag = (window as any).show_9674140;
        await monetag({ type: 'inApp', ymid: sessionId, requestVar: sessionId });
      }
    };

    const timer = setTimeout(runPassiveAd, 2000);
    return () => clearTimeout(timer);
  }, [userId, subscriptionType, suppressAfterPayment]);
};
