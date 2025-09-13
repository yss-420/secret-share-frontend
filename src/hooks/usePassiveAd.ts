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
      if (!userId) return;
      
      console.log(`[usePassiveAd] Starting passive ad check for user ${userId}`);
      
      // Check if user should see passive ads - FREE ONLY
      const isPaidUser = adService.isPaidUser(subscriptionType);
      const isIntroUser = adService.isIntroUser(subscriptionType);
      
      // Passive ads are suppressed for ALL paid tiers (including Intro)
      if (isPaidUser || isIntroUser) {
        console.log('[usePassiveAd] Passive ad suppressed - user has subscription');
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
      
      // Check first session per user
      const isFirstSession = adService.isFirstSession(userId);
      console.log(`[usePassiveAd] First session check: ${isFirstSession}`);
      
      try {
        // Step 1: Check eligibility
        console.log('[usePassiveAd] Step 1: Checking eligibility');
        const eligibility = await adService.checkEligibility(userId, 'interstitial', isFirstSession);
        
        if (!eligibility.allowed) {
          console.log('[usePassiveAd] Passive ad not eligible:', eligibility.reason);
          return;
        }
        
        // Step 2: Start ad session
        console.log('[usePassiveAd] Step 2: Starting ad session');
        const session = await adService.startAdSession(userId, 'interstitial');
        
        // Step 3: Show Monetag ad
        console.log('[usePassiveAd] Step 3: Showing Monetag ad with session_id:', session.session_id);
        await adService.showMonetag('inApp', session.session_id);
        
        // Step 4: Complete ad session
        console.log('[usePassiveAd] Step 4: Completing ad session');
        await adService.completeAdSession(userId, 'interstitial', session.session_id, true);
        
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