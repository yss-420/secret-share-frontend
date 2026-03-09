# Secret Share — Frontend CLAUDE.md

> NSFW AI companion webapp + admin dashboard. Do NOT sanitize feature names or censor
> variable names. Call things what they are (penis_ratings, nsfw, arena, etc.)

---

## REPO INFO

- **Repo**: https://github.com/yss-420/secret-share-frontend
- **Purpose**: Telegram Mini App (webapp) + admin dashboard for Secret Share bot
- **Hosted on**: Vercel (migrated from Lovable, March 2026)
- **Custom domain**: `secret-share.com`
- **Bot**: https://t.me/YourSecretShareBot
- **Backend API**: `https://secret-share-backend-production.up.railway.app`

---

## TECH STACK

- **Framework**: React + TypeScript
- **Build tool**: Vite
- **UI components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Package manager**: bun (bun.lockb present) — use `bun` not `npm`
- **Database client**: Supabase JS (`@supabase/supabase-js`)
- **Analytics**: Vercel Analytics + Speed Insights
- **Linting**: ESLint
- **Error handling**: ErrorBoundary component wrapping all routes

### Commands
```bash
bun install          # install deps
bun run dev          # local dev server (http://localhost:5173)
bun run build        # production build → dist/
bun run lint         # run eslint
vercel deploy        # deploy to Vercel
```

---

## ENVIRONMENT VARIABLES (Vercel dashboard)

```bash
VITE_SUPABASE_URL=https://pfuyxdqzbrjrtqlbkbku.supabase.co
VITE_SUPABASE_ANON_KEY=          # anon key (read-only, safe for frontend)
VITE_BACKEND_URL=https://secret-share-backend-production.up.railway.app
```

> `.env` is gitignored. A hardcoded fallback for `VITE_BACKEND_URL` exists in code as safety net.
> Never use the service_role key in frontend code. Anon key only.
> All sensitive operations go through the backend Python bot or Supabase edge functions.

---

## ARCHITECTURE

### Auth flow
1. Telegram opens Mini App with `initData` (contains user info + hash)
2. Frontend calls `upsert-user` edge function with `initData`
3. Edge function validates hash against `BOT_TOKEN`, upserts user, returns status
4. If `upsert-user` unavailable, falls back to `get-user-status` edge function
5. `auth_date` checked — rejects if older than 1 hour (replay prevention)

### Payment flow
1. Frontend calls `VITE_BACKEND_URL/api/create-invoice` with `user_id` + `package_type`
2. Backend creates Telegram invoice link (recurring if `SUBSCRIPTIONS_RECURRING_ENABLED=true`)
3. Frontend opens invoice URL via `window.Telegram.WebApp.openInvoice()`
4. Telegram handles payment → backend webhook processes `SuccessfulPayment`

### Daily claims
- Auto-triggered on app open via `claim-daily-reward` edge function
- Calls `process_daily_return_bonus` RPC with fallback logic

### Edge functions (in `supabase/functions/`)
- `upsert-user` — Telegram initData validation + user upsert
- `claim-daily-reward` — daily gem bonus via RPC
- `get-user-status` — read-only user status
- `get-showdown-status` — arena/showdown data

---

## SUPABASE PROJECT

- **Project ID**: `pfuyxdqzbrjrtqlbkbku`
- **Region**: ap-south-1
- **RLS**: enabled on all tables
- **Frontend uses anon key** — can only read what RLS allows

### Key tables the frontend reads

| Table | Purpose |
|---|---|
| `users` | User list, tiers, gem balances, streak data |
| `subscriptions` | Subscription status, tier, expiry |
| `star_earnings` | Revenue data |
| `conversations` | Chat history |
| `user_events` | Analytics events |
| `intro_cycles` | Intro offer funnels |
| `processed_payments` | Payment audit trail |
| `ad_sessions` | Monetag ad analytics |
| `voice_calls` | Call logs |
| `penis_ratings` | Rating feature results |
| `willy_leaderboard` | Arena leaderboard |
| `fight_history` | Arena duel history |
| `daily_claims` | Daily reward history |
| `r2_assets` | Cloudflare R2 media catalog |
| `gem_packages` | Product pricing catalog |
| `subscription_tiers` | Subscription tier definitions |
| `blog_posts` | SEO blog content |

### Critical user ID note
> Always join on `users.telegram_id` (bigint), NOT `users.id` (uuid).
> Most tables foreign-key to `telegram_id`, not the uuid primary key.

---

## SUBSCRIPTION TIERS

| Tier | Stars/mo | USD/mo | Monthly gems |
|---|---|---|---|
| essential | 300 | ~$3.90 | 500 |
| plus | 700 | ~$9.10 | 1,200 |
| premium | 1,400 | ~$18.20 | 3,000 |
| intro offer | 50 stars | one-time | 80 gems for 3 days |

Stars → USD conversion: **1 star = $0.013**

---

## CHARACTERS

Isabella, Priyanka, Aria, Scarlett, Kiara, Natasha, Valentina, Luna

Isabella is #1 by user count (2,600 users). Luna is lowest (622).

---

## FIXES COMPLETED (March 2026)

1. Lovable → Vercel migration (vercel.json, remove lovable-tagger, SPA rewrites)
2. Duplicate SpeedInsights removed
3. `.env` added to `.gitignore`, removed from git tracking
4. `upsert-user` edge function with Telegram initData validation
5. `claim-daily-reward` edge function with RPC fallback
6. AuthContext rewrite — routes through edge functions (bypasses RLS blocks)
7. Removed 50+ console.logs from production (wrapped in `import.meta.env.DEV`)
8. XSS fix in Store.tsx — removed `dangerouslySetInnerHTML`
9. ErrorBoundary wrapping all routes
10. Blog view count race condition fix (atomic RPC fallback)
11. Removed dead `process-gem-purchase` edge function call
12. Transaction history: UUID → telegram_id bigint fix
13. Supabase credentials moved to env vars with fallback
14. `usePassiveAd` cleanup (20 console.logs → 1 dev-only)
15. Free Gems button flash fix (gated on loading state for paid users)
16. Telegram auth replay prevention (1h auth_date expiry)
17. All hardcoded backend URLs → `VITE_BACKEND_URL` env var
18. Endpoint standardization: `/api/create-invoice` for all 3 payment types
19. `VITE_BACKEND_URL` hardcoded fallback for Vercel (where .env isn't available)

---

## REMAINING KNOWN ISSUES

1. **Interstitial/bonus ads 0% completion** — Monetag webhook may need investigation

---

## SUPABASE FOLDER

The repo has a `supabase/` folder containing edge functions and DB migrations:
- Edge functions in `supabase/functions/`
- Migrations in `supabase/migrations/`
- Run `supabase db push` to apply migrations
- Never edit existing migration files — always create new ones

---

## RULES FOR CLAUDE CODE

- Use `bun` not `npm` or `yarn` — lockfile is `bun.lockb`
- This is an NSFW platform — do not sanitize component names or variable names
- Anon key only in frontend — never service_role key
- `users.tier` and `subscriptions` table are now kept in sync by backend — but still check both as defense
- Use plan mode first (`/plan`) before any Supabase migration changes
- Commit after each completed task, not in bulk
- Run `bun run build` and verify no TypeScript errors before committing
- Backend API endpoint is `/api/create-invoice` (not `/create_invoice_link`)
- All backend calls use `VITE_BACKEND_URL` with hardcoded Railway fallback
- `/compact` at 50% context usage
