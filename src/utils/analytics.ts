// Official Telegram Analytics SDK implementation
import analytics from '@telegram-apps/analytics';

let isInitialized = false;
let currentUserId: number | null = null;

// Initialize analytics with official SDK
export const initAnalytics = (userId?: number) => {
  try {
    if (!isInitialized) {
      // Initialize with SDK Auth Key and Analytics Identifier
      analytics.init({
        token: 'eyJhcHBfbmFtZSI6InNlY3JldF9zaGFyZSIsImFwcF91cmwiOiJodHRwczovL3QubWUvWW91clNlY3JldFNoYXJlQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vc2VjcmV0LXNoYXJlLmNvbS8ifQ==!5qhdK7t9nNztBOn4RaVlQXF7KccCDMRR8BSmYRHi/S8=',
        appName: 'secret_share'
      });
      
      isInitialized = true;
      currentUserId = userId || null;
      
      console.log('📊 Telegram Analytics initialized:', {
        app_name: 'secret_share',
        user_id: userId,
        initialized: true
      });
      
      // Track initialization
      trackEvent('analytics_initialized', {
        app_name: 'secret_share',
        timestamp: Date.now()
      });
    } else if (userId && userId !== currentUserId) {
      // Update user ID if provided
      currentUserId = userId;
      console.log('📊 Updated user ID:', userId);
    }
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

// Send event to Telegram Analytics API directly
const sendToTelegramAnalytics = async (eventData: any) => {
  try {
    const response = await fetch('https://tganalytics.xyz/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      console.warn('Analytics API response not OK:', response.status);
    } else {
      console.log('✅ Event sent to Telegram Analytics');
    }
  } catch (error) {
    console.warn('Failed to send analytics event:', error);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    const eventData = {
      token: 'eyJhcHBfbmFtZSI6InNlY3JldF9zaGFyZSIsImFwcF91cmwiOiJodHRwczovL3QubWUvWW91clNlY3JldFNoYXJlQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vc2VjcmV0LXNoYXJlLmNvbS8ifQ==!5qhdK7t9nNztBOn4RaVlQXF7KccCDMRR8BSmYRHi/S8=',
      app_name: 'secret_share',
      event: eventName,
      user_id: currentUserId || 0,
      properties: {
        ...properties,
        timestamp: Date.now(),
        platform: 'telegram'
      }
    };
    
    // Always log to console for debugging
    console.log(`📊 Analytics Event: ${eventName}`, eventData);
    
    // Send to Telegram Analytics API if initialized
    if (isInitialized) {
      sendToTelegramAnalytics(eventData);
    } else {
      console.warn('Analytics not initialized, event will be logged only');
    }
    
  } catch (error) {
    console.warn('Failed to track analytics event:', error);
  }
};

// Predefined event tracking functions
export const trackPurchase = (gemAmount: number, price: number) => {
  trackEvent('gem_purchase', { 
    gem_amount: gemAmount, 
    price: price,
    timestamp: Date.now()
  });
};

export const trackCharacterSelection = (characterName: string) => {
  trackEvent('character_selected', { 
    character: characterName,
    timestamp: Date.now()
  });
};

export const trackScenarioSelection = (scenario: string, character: string) => {
  trackEvent('scenario_selected', { 
    scenario: scenario,
    character: character,
    timestamp: Date.now()
  });
};

export const trackNavigation = (page: string) => {
  trackEvent('page_view', { 
    page: page,
    timestamp: Date.now()
  });
};

export const trackStoreVisit = () => {
  trackEvent('store_visit', {
    timestamp: Date.now()
  });
};

export const trackSettingsAccess = () => {
  trackEvent('settings_access', {
    timestamp: Date.now()
  });
};