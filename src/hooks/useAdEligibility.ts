import { useState, useEffect } from 'react';
import { adService, AdType, AdEligibilityResponse } from '@/services/adService';

export const useAdEligibility = (userId?: number, type?: AdType) => {
  const [eligibility, setEligibility] = useState<AdEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEligibility = async (adType?: AdType, firstSession = false) => {
    if (!userId || !adType) return;
    
    setLoading(true);
    try {
      const result = await adService.checkEligibility(userId, adType, firstSession);
      setEligibility(result);
    } catch (error) {
      console.error('Failed to check ad eligibility:', error);
      setEligibility({ allowed: false, reason: 'Service unavailable' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && type) {
      checkEligibility(type);
    }
  }, [userId, type]);

  const formatCooldown = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return '';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatNextAvailable = (nextAvailableAt?: string): string => {
    if (!nextAvailableAt) return '';
    
    const targetTime = new Date(nextAvailableAt);
    const now = new Date();
    const diffMs = targetTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Available now';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  return {
    eligibility,
    loading,
    checkEligibility,
    formatCooldown,
    formatNextAvailable,
    refresh: () => checkEligibility(type),
  };
};