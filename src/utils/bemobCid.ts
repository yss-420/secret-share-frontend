// BeMob Campaign ID Detection and Storage
// https://docs.bemob.com/en/conversion-pixel

const BEMOB_CID_KEY = 'bemob_cid';

/**
 * Extract BeMob campaign ID from URL parameters
 */
export const extractBemobCidFromUrl = (): string | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const cid = urlParams.get('cid');
    
    if (cid) {
      console.log('[BEMOB] CID detected from URL:', cid);
      return cid;
    }
    
    return null;
  } catch (error) {
    console.warn('[BEMOB] Error extracting CID from URL:', error);
    return null;
  }
};

/**
 * Get stored BeMob campaign ID from localStorage
 */
export const getStoredBemobCid = (): string | null => {
  try {
    const storedCid = localStorage.getItem(BEMOB_CID_KEY);
    if (storedCid) {
      console.log('[BEMOB] CID retrieved from storage:', storedCid);
    }
    return storedCid;
  } catch (error) {
    console.warn('[BEMOB] Error reading CID from storage:', error);
    return null;
  }
};

/**
 * Store BeMob campaign ID in localStorage
 */
export const storeBemobCid = (cid: string): void => {
  try {
    localStorage.setItem(BEMOB_CID_KEY, cid);
    console.log('[BEMOB] CID stored:', cid);
  } catch (error) {
    console.warn('[BEMOB] Error storing CID:', error);
  }
};

/**
 * Get current BeMob campaign ID (from URL or storage)
 */
export const getCurrentBemobCid = (): string | null => {
  // First try to get from URL (fresh landing)
  const urlCid = extractBemobCidFromUrl();
  if (urlCid) {
    storeBemobCid(urlCid);
    return urlCid;
  }
  
  // Fallback to stored CID
  return getStoredBemobCid();
};

/**
 * Clear stored BeMob campaign ID
 */
export const clearBemobCid = (): void => {
  try {
    localStorage.removeItem(BEMOB_CID_KEY);
    console.log('[BEMOB] CID cleared');
  } catch (error) {
    console.warn('[BEMOB] Error clearing CID:', error);
  }
};

/**
 * Initialize BeMob CID detection on app launch
 */
export const initBemobCid = (): string | null => {
  console.log('[BEMOB] Initializing CID detection...');
  
  const cid = getCurrentBemobCid();
  
  if (cid) {
    console.log('[BEMOB] Active CID:', cid);
  } else {
    console.log('[BEMOB] No CID detected - postbacks will be skipped');
  }
  
  return cid;
};