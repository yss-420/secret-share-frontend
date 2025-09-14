import { useEffect } from 'react';
import { adService } from '@/services/adService';

export const usePassiveAd = (
  userId?: number, 
  subscriptionType?: string,
  suppressAfterPayment = false
) => {
  useEffect(() => {
    // Only run passive ad logic once when the app initializes
    const runPassiveAd = async () => {
      if (!userId) {
        console.log('[usePassiveAd] No userId, skipping');
        return;
      }
      
      // Guard against double-trigger with 1-hour reset
      const now = Date.now();
      const lastShown = (window as any).__passiveShownTime || 0;
      const oneHour = 60 * 60 * 1000;
      
      if ((window as any).__passiveShown && (now - lastShown) < oneHour) {
        console.log('[usePassiveAd] Already shown recently, skipping');
        return;
      }
      (window as any).__passiveShown = true;
      (window as any).__passiveShownTime = now;
      
      console.log(`[usePassiveAd] Starting passive ad check for user ${userId}, subscription: ${subscriptionType}`);
      
      try {
        // Wait for SDK and check eligibility in parallel
        const [sdkReady, eligibility] = await Promise.all([
          waitForSDK(),
          checkEligibility(userId)
        ]);
        
        if (!sdkReady) {
          console.log('[usePassiveAd] SDK not ready after 2s, skipping');
          return;
        }
        
        if (!eligibility.allowed) {
          console.log('[usePassiveAd] Passive ad not eligible:', eligibility.reason);
          return;
        }
        
        // Step 2: Start ad session via HTTP
        console.log('[usePassiveAd] Step 2: Starting ad session via HTTP');
        const startResponse = await fetch(`https://secret-share-backend-production.up.railway.app/api/ads/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            type: 'interstitial'
          })
        });
        
        if (!startResponse.ok) {
          console.log('[usePassiveAd] Start ad session failed:', startResponse.status);
          return;
        }
        
        const session = await startResponse.json();
        console.log('[usePassiveAd] Start session response:', session);
        
        // Step 3: Show Monetag ad with proper API format
        console.log('[usePassiveAd] Step 3: Showing Monetag ad with session_id:', session.session_id);
        await showMonetag(session.session_id);
        
        // Step 4: Complete ad session via HTTP
        console.log('[usePassiveAd] Step 4: Completing ad session via HTTP');
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
        
        if (!completeResponse.ok) {
          console.log('[usePassiveAd] Complete ad session failed:', completeResponse.status);
          return;
        }
        
        const result = await completeResponse.json();
        console.log('[usePassiveAd] Complete session response:', result);
        
        console.log('[usePassiveAd] Passive ad flow completed successfully');
      } catch (error) {
        console.error('[usePassiveAd] Passive ad failed:', error);
      }
    };

    // Wait for SDK to be available (poll every 100ms for up to 2s)
    const waitForSDK = async (): Promise<boolean> => {
      let attempts = 0;
      const maxAttempts = 20; // 2 seconds max wait (100ms * 20)
      
      while (typeof (window as any).show_9674140 !== 'function' && attempts < maxAttempts) {
        console.log(`[usePassiveAd] Waiting for SDK... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      return typeof (window as any).show_9674140 === 'function';
    };

    // Check eligibility via HTTP
    const checkEligibility = async (userId: number) => {
      console.log('[usePassiveAd] Checking eligibility via HTTP');
      const eligibilityResponse = await fetch(
        `https://secret-share-backend-production.up.railway.app/api/ads/eligibility?user_id=${userId}&type=interstitial&first_session=0`,
        { method: 'GET' }
      );
      
      if (!eligibilityResponse.ok) {
        throw new Error(`Eligibility check failed: ${eligibilityResponse.status}`);
      }
      
      return await eligibilityResponse.json();
    };

    // Show Monetag ad with proper API format
    const showMonetag = async (sessionId: string) => {
      console.log('[usePassiveAd] Showing Monetag ad');
      
      try {
        const monetag = (window as any).show_9674140;
        const options = {
          type: 'inApp',
          ymid: sessionId,
          requestVar: sessionId
        };
        
        console.log('[usePassiveAd] Calling show_9674140 with options:', options);
        await monetag(options);
        console.log('[usePassiveAd] Ad shown successfully');
      } catch (error) {
        console.log('[usePassiveAd] First attempt failed, retrying in 3s:', error);
        
        // Wait 3-5s and retry once
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
        
        try {
          const monetag = (window as any).show_9674140;
          const options = {
            type: 'inApp',
            ymid: sessionId,
            requestVar: sessionId
          };
          
          await monetag(options);
          console.log('[usePassiveAd] Ad shown successfully on retry');
        } catch (retryError) {
          console.error('[usePassiveAd] Retry also failed:', retryError);
          throw retryError;
        }
      }
    };

    // Run passive ad after 2s delay to ensure proper initialization
    const timer = setTimeout(runPassiveAd, 2000);
    
    return () => clearTimeout(timer);
  }, [userId, subscriptionType, suppressAfterPayment]);
};