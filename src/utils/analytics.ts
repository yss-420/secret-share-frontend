import TelegramAnalytics from '@telegram-apps/analytics';

let isInitialized = false;

// Initialize analytics with identifier (to be provided by @DataChief_bot)
export const initAnalytics = (analyticsIdentifier: string, appName: string = 'Secret Share') => {
  try {
    if (!isInitialized) {
      TelegramAnalytics.init({
        token: analyticsIdentifier,
        appName: appName
      });
      isInitialized = true;
      console.log('Telegram Analytics SDK initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Telegram Analytics:', error);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (isInitialized) {
      // Most events are tracked automatically by the SDK
      // Custom events can be tracked if needed, but the SDK handles most cases
      console.log(`Analytics event: ${eventName}`, properties);
    } else {
      // Fallback to console logging if not initialized
      console.log(`Analytics event tracked: ${eventName}`, { 
        event: eventName,
        properties: properties || {},
        timestamp: Date.now()
      });
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