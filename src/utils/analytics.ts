// Telegram Analytics implementation with SDK Auth Key integration

let isInitialized = false;
let analyticsToken: string | null = null;
let appConfig: any = null;

// Parse the SDK Auth Key to extract app configuration
const parseSDKAuthKey = (sdkAuthKey: string) => {
  try {
    const [encodedData, signature] = sdkAuthKey.split('!');
    const decodedData = atob(encodedData);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Failed to parse SDK Auth Key:', error);
    return null;
  }
};

// Initialize analytics with SDK Auth Key
export const initAnalytics = (sdkAuthKey: string, appName: string = 'Secret Share') => {
  try {
    if (!isInitialized && sdkAuthKey) {
      analyticsToken = sdkAuthKey;
      appConfig = parseSDKAuthKey(sdkAuthKey);
      isInitialized = true;
      
      console.log('📊 Telegram Analytics initialized:', {
        app_name: appConfig?.app_name || appName,
        app_url: appConfig?.app_url,
        token_present: !!analyticsToken
      });
      
      // Track initialization
      trackEvent('analytics_initialized', {
        app_name: appConfig?.app_name || appName,
        app_url: appConfig?.app_url,
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

// Send event to Telegram Analytics API
const sendToTelegramAnalytics = async (eventData: any) => {
  try {
    if (!analyticsToken) {
      console.warn('Analytics token not available');
      return;
    }

    // Telegram Analytics API endpoint (this may need to be verified/updated)
    const apiEndpoint = 'https://api.telegram.org/analytics/event';
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${analyticsToken}`
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
      event: eventName,
      properties: {
        ...properties,
        app_name: appConfig?.app_name || 'Secret Share',
        app_url: appConfig?.app_url
      },
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      platform: 'telegram'
    };
    
    // Always log to console for debugging
    console.log(`📊 Analytics Event: ${eventName}`, eventData);
    
    // Send to Telegram Analytics API if initialized
    if (isInitialized && analyticsToken) {
      sendToTelegramAnalytics(eventData);
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