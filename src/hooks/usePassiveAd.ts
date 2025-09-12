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
      
      // Check if user should see passive ads
      const isPaidUser = adService.isPaidUser(subscriptionType);
      const isIntroUser = adService.isIntroUser(subscriptionType);
      
      // Passive ads are suppressed for ALL paid tiers (including Intro)
      if (isPaidUser || isIntroUser) {
        console.log('Passive ad suppressed - user has subscription');
        return;
      }
      
      // Suppress if payment happened recently in this session
      if (suppressAfterPayment) {
        console.log('Passive ad suppressed - recent payment in session');
        return;
      }
      
      // Check if this is first session
      const isFirstSession = adService.isFirstSession();
      
      // Suppress on very first session
      if (isFirstSession) {
        console.log('Passive ad suppressed - first session');
        return;
      }
      
      try {
        await adService.showPassiveAd(userId, false);
      } catch (error) {
        console.error('Passive ad failed:', error);
      }
    };

    // Run passive ad after a small delay to ensure proper initialization
    const timer = setTimeout(runPassiveAd, 2000);
    
    return () => clearTimeout(timer);
  }, [userId, subscriptionType, suppressAfterPayment]);
};