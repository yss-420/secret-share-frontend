/**
 * Admin Protection System
 * Only Telegram ID 1226785406 can access admin panel
 */

const ADMIN_IDS = [
  1226785406,  // Primary admin
];

export const isAdmin = (telegramId: number): boolean => {
  return ADMIN_IDS.includes(telegramId);
};

export const requireAdmin = (telegramUser: any): void => {
  if (!telegramUser || !isAdmin(telegramUser.id)) {
    throw new Error('Admin access required');
  }
};

export const getTelegramUser = () => {
  if (typeof window === 'undefined') return null;
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user || null;
};
