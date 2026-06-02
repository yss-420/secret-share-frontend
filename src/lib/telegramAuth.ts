// Telegram Mini-App auth helper.
// The backend authenticates money/ad requests by verifying the signed Telegram initData
// (HMAC with the bot token) and derives the user id from it — it no longer trusts a
// client-supplied user_id. Every call to /api/ads/* and /api/create-invoice must send this header.

export function getTelegramInitData(): string {
  return (window as any)?.Telegram?.WebApp?.initData || '';
}

// Merge the X-Telegram-Init-Data header into an existing headers object.
export function telegramAuthHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const initData = getTelegramInitData();
  return initData ? { ...extra, 'X-Telegram-Init-Data': initData } : { ...extra };
}
