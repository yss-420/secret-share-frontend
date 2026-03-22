# Secret Share — Frontend CLAUDE.md

> NSFW AI companion webapp + admin dashboard. Do NOT sanitize feature names or censor
> variable names. Call things what they are (penis_ratings, nsfw, arena, etc.)

---

## DEPLOYMENT WORKFLOW

**IMPORTANT**: Always create a PR to merge changes into `main` when making any frontend changes. Vercel auto-deploys from `main` — the Telegram mini-app only shows production deployments (merged to `main`), not preview deployments from feature branches. Workflow:
1. Develop on feature branch
2. Commit and push to feature branch
3. Create PR to merge into `main`
4. Once merged, Vercel auto-deploys to production

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

Isabella is #1 by user count (8,640 users). Luna is lowest (5,871).

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

### Ad System Fixes (March 10, 2026) — PR #12
20. **Edge function rewrite** (`ads-offer-webhook`): Fixed `session.type` → `session.ad_type`; fixed writing non-existent columns; added Monetag macro support (`reward=yes/no`, `event_type`, `estimated_price`); idempotency; always 200
21. **Interstitial fix** (`usePassiveAd.ts`): Removed premature `completed: true` — completion now via Monetag webhook server-side; added subscriber skip
22. **Quick earn fix** (`adService.ts`): Added webhook polling fallback if backend complete doesn't confirm; better error handling
23. **Bonus fix** (`adService.ts`): Extended polling 60s → 120s; early exit on rejected/error/closed; better timeout message
24. **Subscriber guardrail**: `isPaidUser()` correctly excludes essential/plus/premium; intro still gets limited ads
25. **DB migration**: Added `completed_at`, `postback_data`, `estimated_price` to `ad_sessions`; `expired` status; indexes

---

## MONETAG AD SYSTEM

### Key files
- `src/services/adService.ts` — main ad service (eligibility, start, complete, status, Monetag SDK wrapper)
- `src/hooks/usePassiveAd.ts` — interstitial ads (auto-show on page load, 1x/hour)
- `src/hooks/useAdEligibility.ts` — eligibility check hook
- `src/components/EarnModal.tsx` — quick earn + bonus UI
- `src/components/FreeGemsButton.tsx` — free gems button
- `supabase/functions/ads-offer-webhook/index.ts` — Monetag postback webhook

### Monetag SDK
- Zone ID: `9674140`
- SDK loaded in `index.html`: `<script src='//libtl.com/sdk.js' data-zone='9674140' data-sdk='show_9674140'></script>`
- Global function: `window.show_9674140`

### Completion flow (after March 10 fix)
1. Frontend calls `/api/ads/start` → gets `session_id`
2. Frontend calls Monetag SDK with `ymid=session_id` (for postback tracking)
3. Monetag fires postback → edge function processes it, marks session completed, awards gems
4. Frontend polls `/api/ads/status` for bonus/quick fallback
5. Interstitial: NO frontend complete call — webhook only

### Postback URL format (Monetag dashboard) — ✅ Updated March 14, 2026
```
https://secret-share-backend-production.up.railway.app/api/ads/offer-webhook?session_id={ymid}&user_id={telegram_id}&reward={reward_event_type}&event_type={event_type}&zone_id={zone_id}&subzone_id={sub_zone_id}&price={estimated_price}
```
> Postbacks activated for zone 9674140 (confirmed by Monetag support).

---

## SECRET SCORE (CHEMISTRY %) — Frontend Components

### Files
- `src/components/ChemistryHeart.tsx` — SVG heart that fills proportional to score + color-coded percentage pill
  - Colors: 0-20 red (#EF4444), 21-40 orange (#F97316), 41-60 yellow (#EAB308), 61-80 green (#22C55E), 81-100 bright green (#10B981)
  - Click opens Popover with score explanation + tips to raise it
  - Uses Radix UI Popover (`@/components/ui/popover`)
- `src/hooks/useChemistryScores.ts` — Fetches scores from `BACKEND_URL/api/chemistry?user_id={telegramId}`
  - Returns `{ scores: Record<string, number>, loading: boolean }`
  - Graceful degradation: silently fails if API is down, cards render without hearts
- `src/components/CompanionCard.tsx` — Updated with optional `chemistryScore` prop, renders ChemistryHeart at bottom-left
- `src/pages/Index.tsx` — Calls `useChemistryScores(telegramUser?.id)`, passes scores to CompanionCard via `companion.name.toLowerCase()` key

### How it works
1. `useChemistryScores` hook fetches all scores for the user on page load
2. Each CompanionCard receives its score via `chemistryScore` prop
3. If score > 0, a ChemistryHeart badge appears at bottom-left of the card image
4. Clicking the heart opens a Popover explaining the score and how to increase it
5. Only visible to authenticated users (score is undefined when not logged in)

---

## REMAINING KNOWN ISSUES

1. ~~**Interstitial/bonus ads 0% completion**~~ ✅ FULLY FIXED (March 14, 2026) — code fixed March 10-11; Monetag postback URL updated to Railway backend with correct macros; postbacks activated for zone 9674140.
2. ~~**Monetag postback URL**~~ ✅ DONE — Configured in Monetag dashboard pointing to Railway backend with correct macros (`{reward_event_type}`, `{sub_zone_id}`)

---

## PR HISTORY (all 17 merged to main)

| PR | Title |
|---|---|
| #1 | feat: fetch gems/messages from backend /user_status via Telegram id |
| #2 | Add Supabase temporary directory to gitignore |
| #3 | Set up Vercel Speed Insights tracking |
| #4-7 | Multiple frontend fixes (auth, env vars, paid user flash) |
| #8 | fix: use VITE_BACKEND_URL env var, standardize endpoints |
| #9 | fix: add VITE_BACKEND_URL fallback for payments |
| #10-12 | docs: update CLAUDE-frontend.md (multiple updates) |
| #13 | fix: repair entire ad system — edge function, completion flows |
| #14 | feat: enable ads-offer-webhook edge function as backup handler |
| #15 | fix: bonus ad completion — read SDK reward_event_type from pop ads |
| #16 | fix: Monetag SDK pop call — use single options object |
| #17 | docs: update CLAUDE-frontend.md — Monetag postbacks fully configured |

---

## LIVE STATUS (Verified March 19, 2026)

- Frontend: `https://secret-share.com/` — deployed on Vercel, latest commit: PR #17
- Backend: `https://secret-share-backend-production.up.railway.app/api/ads/health` — HTTP 200, healthy
- Vercel project: `secret-share-frontend` — READY/PROMOTED
- All payment types verified live (gems, essential, plus, premium, intro)
- Monetag postbacks: ✅ active, 17 bonus completions confirmed

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
