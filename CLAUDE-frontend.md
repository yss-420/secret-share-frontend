# Secret Share — Frontend CLAUDE.md

> NSFW AI companion admin dashboard. Do NOT sanitize feature names or censor
> variable names. Call things what they are (penis_ratings, nsfw, arena, etc.)

---

## REPO INFO

- **Repo**: https://github.com/yss-420/secret-share-frontend
- **Purpose**: Admin dashboard + landing page for Secret Share Telegram bot
- **Was hosted on**: Lovable (lovable.dev/projects/20b7f7bf-91fa-4e67-a290-50c792626ca5)
- **Migrating to**: Vercel
- **Bot**: https://t.me/YourSecretShareBot

---

## TECH STACK

- **Framework**: React + TypeScript
- **Build tool**: Vite
- **UI components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Package manager**: bun (bun.lockb present) — use `bun` not `npm`
- **Database client**: Supabase JS (`@supabase/supabase-js`)
- **Linting**: ESLint

### Commands
```bash
bun install          # install deps
bun run dev          # local dev server (http://localhost:5173)
bun run build        # production build → dist/
bun run lint         # run eslint
vercel deploy        # deploy to Vercel (after migration)
```

---

## ENVIRONMENT VARIABLES

```bash
# .env (also update .env.example when adding new vars)
VITE_SUPABASE_URL=https://pfuyxdqzbrjrtqlbkbku.supabase.co
VITE_SUPABASE_ANON_KEY=          # anon key (read-only, safe for frontend)
```

> ⚠️ Never use the service_role key in frontend code. Anon key only.
> All sensitive operations go through the backend Python bot.

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
| `conversations` | Chat history (138k rows) |
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

### Critical user ID note
> Always join on `users.telegram_id` (bigint), NOT `users.id` (uuid).
> Most tables foreign-key to `telegram_id`, not the uuid primary key.

---

## SUBSCRIPTION TIERS (pricing reference)

| Tier | Stars/mo | USD/mo |
|---|---|---|
| essential | 300 | ~$3.90 |
| plus | 700 | ~$9.10 |
| premium | 1,400 | ~$18.20 |
| intro offer | 50 stars | 3-day trial |

Stars → USD conversion: **1 star = $0.013**

---

## CHARACTERS (for any UI that displays them)

Isabella, Priyanka, Aria, Scarlett, Kiara, Natasha, Valentina, Luna

Isabella is #1 by user count (2,600 users). Luna is lowest (622).

---

## KNOWN BUGS TO FIX

### 🔴 P0 — Migration
1. **Lovable → Vercel migration**: Add `vercel.json`, remove Lovable-specific configs, update any hardcoded Lovable URLs
2. **`.env` committed to repo**: `.env` file is visible in the repo file list — this is a security issue. Add it to `.gitignore` immediately, rotate keys if needed

### 🟡 P1 — Data display bugs (caused by backend bugs)
3. **Subscriptions showing active when expired**: 18 subs have `status='active'` but `expires_at` in the past — display logic should check both `status` AND `expires_at < NOW()`
4. **User tier mismatch**: 10 users have `subscriptions.status='active'` but `users.tier='free'` — display should prefer `subscriptions` table as source of truth for tier display
5. **Daily claims showing zero**: Last claim was Sep 14 2025 — the streak/claim display is reading correctly but the backend stopped writing. Flag this in UI if no claims in 30+ days.

### 🟠 P2
6. **Intro cycles funnel**: 507 pending cycles never activated — dashboard should show pending vs active vs converted rates clearly

---

## VERCEL MIGRATION STEPS

When Claude Code works on the migration:

1. Create `vercel.json` in root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

2. Check `vite.config.ts` for any Lovable-specific plugins and remove them

3. Search entire codebase for `lovable.dev` URLs and replace with Vercel URL

4. Make sure `.env` is in `.gitignore` (it currently appears NOT to be — fix this)

5. Add these to `.env.example`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

6. In Vercel dashboard: add env vars, connect to `yss-420/secret-share-frontend`, set build command to `bun run build`, output dir to `dist`

---

## SUPABASE FOLDER

The repo has a `supabase/` folder — this contains DB migrations. When fixing DB schema issues:
- New migrations go in `supabase/migrations/`
- Run `supabase db push` to apply
- Never edit existing migration files — always create new ones

---

## RULES FOR CLAUDE CODE

- Use `bun` not `npm` or `yarn` — lockfile is `bun.lockb`
- This is an NSFW platform — do not sanitize component names or variable names
- Anon key only in frontend — never service_role key
- Always check both `subscriptions.status` AND `subscriptions.expires_at` when determining if a user is subscribed — status alone is unreliable (known backend bug)
- Prefer `subscriptions` table over `users.tier` for subscription status — they are out of sync
- Use plan mode first (`/plan`) before any Supabase migration changes
- Commit after each completed task, not in bulk
- Run `bun run build` and verify no TypeScript errors before committing
- `/compact` at 50% context usage
