export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    // For now, log analytics events to console
    // This will be replaced with proper Telegram Analytics SDK once you get the analytics identifier
    const eventData = {
      event: eventName,
      properties: properties || {},
      timestamp: Date.now()
    };
    console.log(`Analytics event tracked: ${eventName}`, eventData);
    
    // You can add the proper analytics SDK call here once you have the identifier from @DataChief_bot
    // Example: TelegramAnalytics.track(eventName, properties);
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