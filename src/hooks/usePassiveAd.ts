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
      
      console.log(`[usePassiveAd] Starting passive ad check for user ${userId}, subscription: ${subscriptionType}`);
      
      // Check if user should see passive ads - FREE ONLY (not paid, but Intro is OK)
      const isPaidUser = adService.isPaidUser(subscriptionType);
      
      // Only suppress for truly paid users, not Intro
      if (isPaidUser && subscriptionType !== 'intro') {
        console.log('[usePassiveAd] Passive ad suppressed - user has paid subscription');
        return;
      }
      
      
      // Suppress if payment happened recently in this session
      if (suppressAfterPayment) {
        console.log('[usePassiveAd] Passive ad suppressed - recent payment in session');
        return;
      }
      
      // Check if rewarded ad was watched recently (within 2 minutes)
      if (adService.hasRecentRewardedAd()) {
        console.log('[usePassiveAd] Passive ad suppressed - recent rewarded ad');
        return;
      }
      
      try {
        // Step 1: Check eligibility via HTTP
        console.log('[usePassiveAd] Step 1: Checking eligibility via HTTP');
        const eligibilityResponse = await fetch(
          `https://secret-share-backend-production.up.railway.app/api/ads/eligibility?user_id=${userId}&type=interstitial&first_session=0`,
          { method: 'GET' }
        );
        
        if (!eligibilityResponse.ok) {
          console.log('[usePassiveAd] Eligibility check failed:', eligibilityResponse.status);
          return;
        }
        
        const eligibility = await eligibilityResponse.json();
        console.log('[usePassiveAd] Eligibility response:', eligibility);
        
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
        
        // Step 3: Show Monetag ad
        console.log('[usePassiveAd] Step 3: Showing Monetag ad with session_id:', session.session_id);
        await adService.showMonetag('inApp', session.session_id);
        
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

    // Run passive ad after 1-2s delay to ensure proper initialization
    const timer = setTimeout(runPassiveAd, 2000);
    
    return () => clearTimeout(timer);
  }, [userId, subscriptionType, suppressAfterPayment]);
};