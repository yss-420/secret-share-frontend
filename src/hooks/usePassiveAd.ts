import { useEffect } from 'react';

const isDev = import.meta.env.DEV;
const log = (...args: any[]) => { if (isDev) console.log('[usePassiveAd]', ...args); };

export const usePassiveAd = (
  userId?: number,
  subscriptionType?: string,
  suppressAfterPayment = false
) => {
  useEffect(() => {
    const runPassiveAd = async () => {
      if (!userId) return;

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

        const startResponse = await fetch(`https://secret-share-backend-production.up.railway.app/api/ads/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, type: 'interstitial' })
        });

        if (!startResponse.ok) return;

        const session = await startResponse.json();
        await showMonetag(session.session_id);

        const completeResponse = await fetch(`https://secret-share-backend-production.up.railway.app/api/ads/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            type: 'interstitial',
            session_id: session.session_id,
            completed: true
          })
        });

        if (!completeResponse.ok) return;
        log('Passive ad flow completed');
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
        `https://secret-share-backend-production.up.railway.app/api/ads/eligibility?user_id=${userId}&type=interstitial&first_session=0`
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
