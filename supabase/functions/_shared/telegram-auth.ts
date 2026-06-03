// Telegram Mini-App initData verification for edge functions.
// Uses the SAME proven algorithm as upsert-user (crypto.subtle; key="WebAppData", msg=bot token;
// data-check-string = all params except `hash`, sorted; matches Telegram's spec and is already
// validated in production by upsert-user). Returns the VERIFIED telegram user id, or null.
//
// Use this to authenticate edge functions: derive the user id from initData and IGNORE any
// client-supplied telegram_id — prevents acting on behalf of another user.

const ALLOWED_ORIGINS = [
  'https://secret-share.com',
  'https://t.me',
  'https://web.telegram.org',
];

export function corsHeadersFor(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : 'https://secret-share.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-telegram-init-data',
  };
}

// maxAgeSec defaults to 24h: these endpoints are polled with the launch-time initData, so a tight
// window would 401 legitimate users who keep the Mini-App open. 24h limits replay blast radius.
export async function verifyTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSec = 86400,
): Promise<number | null> {
  try {
    if (!initData || !botToken) return null;
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return null;
    params.delete('hash');

    const arr: string[] = [];
    for (const [k, v] of params.entries()) arr.push(`${k}=${v}`);
    arr.sort();
    const dataCheckString = arr.join('\n');

    const secretKey = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
    );
    const tokenBuffer = await crypto.subtle.sign('HMAC', secretKey, new TextEncoder().encode(botToken));
    const verificationKey = await crypto.subtle.importKey(
      'raw', tokenBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
    );
    const expectedBuffer = await crypto.subtle.sign('HMAC', verificationKey, new TextEncoder().encode(dataCheckString));
    const expectedHash = Array.from(new Uint8Array(expectedBuffer))
      .map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hash !== expectedHash) return null;

    const authDate = params.get('auth_date');
    if (!authDate) return null;
    if (Math.floor(Date.now() / 1000) - parseInt(authDate, 10) > maxAgeSec) return null;

    const userParam = params.get('user');
    if (!userParam) return null;
    const uid = JSON.parse(userParam).id;
    return (typeof uid === 'number' && uid > 0) ? uid : null;
  } catch (_e) {
    return null;
  }
}
