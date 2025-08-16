// Bemob Conversion Pixel Tracking
// https://docs.bemob.com/en/conversion-pixel

import { getCurrentBemobCid } from './bemobCid';

interface ConversionData {
  cid?: string;    // Campaign ID (optional)
  payout?: number; // Payout amount (optional)
  txid?: string;   // Transaction ID (optional)
}

/**
 * Fire conversion pixel for successful purchases
 * Should be called on thank you page or after successful payment
 */
export const fireConversionPixel = (data: ConversionData = {}) => {
  try {
    // Get stored BeMob CID if not provided
    const bemobCid = data.cid || getCurrentBemobCid();
    
    // Build pixel URL with optional parameters
    const baseUrl = 'https://jerd8.bemobtrcks.com/conversion.gif';
    const params = new URLSearchParams();
    
    if (bemobCid) params.append('cid', bemobCid);
    if (data.payout) params.append('payout', data.payout.toString());
    if (data.txid) params.append('txid', data.txid);
    
    const pixelUrl = `${baseUrl}?${params.toString()}`;
    
    // Method 1: Image pixel (most reliable for tracking)
    const img = new Image(1, 1);
    img.src = pixelUrl;
    img.style.position = 'absolute';
    img.style.left = '-9999px';
    img.style.top = '-9999px';
    document.body.appendChild(img);
    
    // Method 2: Script tag for additional tracking capabilities
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = pixelUrl.replace('conversion.gif', 'conversion.js');
    script.async = true;
    script.onerror = () => console.warn('Conversion script failed to load');
    document.head.appendChild(script);
    
    console.log('[BEMOB] Conversion pixel fired:', pixelUrl);
    if (bemobCid) {
      console.log('[BEMOB] CID included in pixel:', bemobCid);
    } else {
      console.log('[BEMOB] No CID available for pixel');
    }
    
    // Clean up after 5 seconds
    setTimeout(() => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error firing conversion pixel:', error);
  }
};

/**
 * Fire conversion for gem purchases
 */
export const trackGemPurchase = (gems: number, stars: number, transactionId?: string) => {
  fireConversionPixel({
    payout: stars, // Use star amount as payout value
    txid: transactionId || `gem_${gems}_${Date.now()}`
  });
};

/**
 * Fire conversion for subscription purchases
 */
export const trackSubscriptionPurchase = (planName: string, stars: number, transactionId?: string) => {
  fireConversionPixel({
    payout: stars, // Use star amount as payout value
    txid: transactionId || `sub_${planName}_${Date.now()}`
  });
};