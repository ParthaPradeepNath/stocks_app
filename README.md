# 📈 Signalist — AI-Powered Stock Tracker

Signalist is a modern stock market dashboard built with **Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui**. Track real-time quotes, explore company fundamentals, search stocks, manage a watchlist, and get **AI-personalized welcome emails + daily market-news digests**.

> Bootstrapped from `create-next-app`, then extended with auth, MongoDB, Finnhub, TradingView, Inngest, Gemini AI, and Nodemailer.

---

## ✨ Features

### 📊 Market Dashboard (`/`)
- Market overview, stock heatmap, top stories timeline, and market quotes
- Powered by **TradingView widgets** (dark theme, transparent)
- Configs in `lib/constants.ts`: `MARKET_OVERVIEW_WIDGET_CONFIG`, `HEATMAP_WIDGET_CONFIG`, `TOP_STORIES_WIDGET_CONFIG`, `MARKET_DATA_WIDGET_CONFIG`

### 🔍 Stock Search + Details (`/stocks/[symbol]`)
- Global command-palette search (`Cmd+K`) with debounced **Finnhub** lookup — `components/SearchCommand.tsx`
- Detail page with:
  - Symbol info, advanced candlestick + baseline charts
  - Technical analysis, company profile, financials widgets
  - Watchlist toggle button
- Popular symbols fallback + `profile2` enrichment (`lib/actions/finnhub.actions.ts`)

### 🔐 Auth + Onboarding
- Email/password auth via **better-auth** + MongoDB adapter + `nextCookies()` (`lib/better-auth/auth.ts`)
- Protected routes via `middleware/index.ts` + `(root)/layout.tsx` session guard
- Rich sign-up form: full name, country (`react-select-country-list`), investment goals, risk tolerance, preferred industry (`react-hook-form` + shadcn forms)
- Sign-in / Sign-up split layout with dashboard preview image

### 📬 AI Emails (Inngest + Gemini + Nodemailer)
- `app/user.created` → AI-personalized welcome email (`gemini-2.5-flash-lite` + `PERSONALIZED_WELCOME_EMAIL_PROMPT`)
- Cron `0 12 * * *` (`app/send.daily.news`) → per-user watchlist news → Gemini summary (`NEWS_SUMMARY_EMAIL_PROMPT`) → Gmail via Nodemailer
- Served at `app/api/inngest/route.ts` — `serve({ client: inngest, functions: [sendSignUpEmail, sendDailyNewsSummary] })`
- Templates in `lib/nodemailer/templates.ts`, sender `Signalist <signalist@jsmastery.pro>`

### ⭐ Watchlist
- Mongoose model `database/models/watchlist.model.ts` — `{ userId (indexed), symbol (uppercase), company, addedAt }`, unique `{ userId, symbol }`
- Server actions in `lib/actions/watchlist.actions.ts`

### 🎨 UI/UX
- **shadcn/ui (radix-nova, neutral) + Tailwind v4 + `tw-animate-css`**, dark mode by default (`next-themes`, `app/layout.tsx` `class="dark"`)
- `lucide-react` icons, `sonner` toasts, `cmdk` command menu
- Custom components: `Header`, `NavItems`, `UserDropdown` (DiceBear avatars), `TradingViewWidget`, `WatchlistButton`, `forms/*`
- `components/ui/`: avatar, button, command, dialog, dropdown-menu, input, input-group, label, popover, select, sonner, textarea

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.0 (App Router), React 19.2.4, TypeScript 5 |
| Styling / UI | Tailwind CSS v4, shadcn/ui, Radix UI, clsx + tailwind-merge, lucide-react, sonner, cmdk, next-themes |
| Forms | react-hook-form, react-select-country-list |
| Auth | better-auth 1.5.6 + mongodbAdapter |
| Database | MongoDB 7 + Mongoose 9 (`lib` cached `connectToDatabase()`) |
| Market Data | Finnhub API (`/search`, `/stock/profile2`, `/company-news`, `/news`), TradingView embeds |
| Background / AI / Email | Inngest 4, Google Gemini `gemini-2.5-flash-lite` via `step.ai.infer`, Nodemailer 8 (Gmail) |
| Config | `next.config.ts` (ignores ESLint/TS errors on build), `@/*` path alias, PostCSS `@tailwindcss/postcss` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Bun also works — `bun.lock` is committed)
- MongoDB URI (Atlas or local)
- Finnhub API key — https://finnhub.io
- Gemini API key — https://aistudio.google.com
- Gmail app password for Nodemailer
- Inngest account / dev server (optional for local email jobs)

### 1. Install
```bash
npm install
# or
bun install
```

### 2. Environment
Create `.env` (see var names below — never commit secrets):

```bash
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database / Auth
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Market data
NEXT_PUBLIC_FINNHUB_API_KEY=...
# FINNHUB_API_KEY=...  # also supported server-side

# AI / Background jobs / Email
GEMINI_API_KEY=...
INNGEST_DEV=1
NODEMAILER_EMAIL=you@gmail.com
NODEMAILER_PASSWORD=your-gmail-app-password
```

### 3. Run
```bash
npm run dev
# open http://localhost:3000
```

### 4. Other scripts
```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
npm run test:db # node scripts/test-db.mjs — verifies MongoDB connection
```

### 5. Inngest (for emails)
Expose `http://localhost:3000/api/inngest` to Inngest dev server / cloud, and trigger:
- `app/user.created` on sign-up (`lib/actions/auth.actions.ts` → `inngest.send(...)`)
- `app/send.daily.news` on cron `0 12 * * *`

---

## 🗂️ Project Structure

```
app/
  layout.tsx                 # root: dark, Geist fonts, <Toaster/>, metadata "Signalist"
  globals.css
  (auth)/layout.tsx          # split auth layout + dashboard.png preview
  (auth)/sign-in/page.tsx
  (auth)/sign-up/page.tsx
  (root)/layout.tsx          # auth guard + <Header/>
  (root)/page.tsx            # dashboard: 4 TradingView widgets
  (root)/stocks/[symbol]/page.tsx
  api/inngest/route.ts       # GET,POST,PUT → sendSignUpEmail, sendDailyNewsSummary

components/
  Header.tsx NavItems.tsx SearchCommand.tsx TradingViewWidget.tsx
  WatchlistButton.tsx UserDropdown.tsx
  forms/InputField.tsx SelectField.tsx CountrySelectField.tsx FooterLink.tsx
  ui/ avatar button command dialog dropdown-menu input input-group label popover select sonner textarea

database/
  mongoose.ts                # cached connectToDatabase()
  models/watchlist.model.ts

lib/
  actions/auth.actions.ts    # signUpWithEmail, signInWithEmail, signOut
  actions/finnhub.actions.ts # fetchJSON, getNews(), searchStocks()
  actions/user.actions.ts    # getAllUsersForNewsEmail()
  actions/watchlist.actions.ts
  better-auth/auth.ts        # lazy getAuth()/auth singleton
  constants.ts               # NAV_ITEMS, form options, TradingView configs, POPULAR_STOCK_SYMBOLS
  utils.ts                   # cn, formatPrice, formatMarketCapValue, getDateRange, etc.
  inngest/client.ts          # new Inngest({ id: 'signalist', ai: { gemini } })
  inngest/functions.ts       # sendSignUpEmail, sendDailyNewsSummary
  inngest/prompt.ts
  nodemailer/index.ts templates.ts

hooks/
  useTradingViewWidget.tsx   # injects s3.tradingview.com script
  useDebounce.ts

middleware/index.ts          # getSessionCookie() guard (note: non-standard path, not root middleware.ts)
types/global.d.ts            # SignIn/UpFormData, Stock, Finnhub*, MarketNewsArticle, Watchlist, Alert...
scripts/test-db.mjs test-db.ts
public/assets/{icons/logo.svg, images/dashboard.png, ...}
```

> Note: `middleware/index.ts` uses `matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)']`. Next.js conventionally expects root `middleware.ts` — verify this runs in your Next 16 setup if auth redirects misbehave.

---

## 🔌 External Services

- **Finnhub** `https://finnhub.io/api/v1` — search, profiles, company-news (5-day window, round-robin max 6), general news fallback
- **TradingView** `https://s3.tradingview.com/external-embedding/embed-widget-*.js` — market-overview, stock-heatmap, timeline, market-quotes, symbol-info, advanced-chart, technical-analysis, company-profile, financials
- **Inngest** — events `app/user.created`, `app/send.daily.news`
- **Gemini** — `gemini-2.5-flash-lite`
- **Gmail (Nodemailer)** — transactional sends
- **DiceBear** `https://api.dicebear.com/9.x/glass/svg` — avatar fallback

---

## 🧭 Routes

| Route | Description |
|---|---|
| `/` | Dashboard (guarded) |
| `/search` | Search entry (via `NavItems` + `SearchCommand`) |
| `/stocks/[symbol]` | Stock detail |
| `/sign-in`, `/sign-up` | Auth |
| `/api/inngest` | Background job endpoint |

---

## 🤝 Contributing

1. Fork / branch → make changes
2. `npm run lint` + `npm run build` should pass (note: build currently ignores lint/TS errors per `next.config.ts` — tighten before production)
3. Open a PR with a clear description + screenshots for UI changes

---

## 📄 License

Private / no license specified (`"private": true` in `package.json`). Add a `LICENSE` if you plan to open-source.

---

Built with Next.js, Finnhub, TradingView, better-auth, Inngest, Gemini, and shadcn/ui.
