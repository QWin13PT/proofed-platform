# Proofed — Architecture & Folder Structure

## Tech Stack Recap
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS + shadcn/ui
- **ZK Proofs**: @zkverify/sdk
- **Auth**: OAuth 2.0 (client-side)
- **State**: React Context / Zustand (optional)
- **Storage**: Vercel KV (for profiles/directory) or in-memory for MVP
- **Deployment**: Vercel

---

## Folder Structure

```
proofed/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD for automated testing
├── app/
│   ├── (marketing)/                  # Route group for public pages
│   │   ├── layout.jsx                # Marketing layout (header, footer)
│   │   ├── page.jsx                  # Homepage (landing)
│   │   └── pricing/
│   │       └── page.jsx              # Pricing page
│   ├── (dashboard)/                  # Route group for authenticated pages
│   │   ├── layout.jsx                # Dashboard layout (sidebar, nav)
│   │   ├── dashboard/
│   │   │   └── page.jsx              # Main dashboard
│   │   ├── creator/
│   │   │   └── page.jsx              # Creator flow (earnings, audience, engagement)
│   │   └── business/
│   │       └── page.jsx              # Business flow (ARR, MAU, growth)
│   ├── explore/
│   │   └── page.jsx                  # Directory/explore page (all users)
│   ├── @[username]/
│   │   └── page.jsx                  # Public profile page (@username)
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.js          # OAuth callback handler
│   │   ├── profiles/
│   │   │   ├── [username]/
│   │   │   │   └── route.js          # GET/PUT profile by username
│   │   │   └── route.js              # POST new profile, GET all profiles
│   │   └── proofs/
│   │       └── verify/
│   │           └── route.js          # Optional: verify proof on backend
│   ├── layout.jsx                    # Root layout (fonts, providers)
│   ├── globals.css                   # Global styles + Tailwind imports
│   └── error.jsx                     # Global error boundary
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── badge.jsx
│   │   ├── tabs.jsx
│   │   └── ...                       # Other shadcn components
│   ├── marketing/
│   │   ├── hero.jsx                  # Landing hero section
│   │   ├── features.jsx              # Features grid
│   │   ├── testimonials.jsx          # Social proof
│   │   └── cta.jsx                   # Call-to-action
│   ├── dashboard/
│   │   ├── metric-selector.jsx       # Dropdown to select proof type
│   │   ├── proof-generator.jsx       # "Get Proofed" button + progress
│   │   ├── badge-grid.jsx            # Display user's badges
│   │   └── stats-card.jsx            # Dashboard stat cards
│   ├── profile/
│   │   ├── profile-header.jsx        # Username, avatar, bio
│   │   ├── badge-display.jsx         # Public badge grid on profile
│   │   └── share-buttons.jsx         # Share to X, LinkedIn, copy link
│   ├── directory/
│   │   ├── user-card.jsx             # Card for each user in directory
│   │   ├── filters.jsx               # Filter by category, metrics
│   │   └── search-bar.jsx            # Search users
│   └── shared/
│       ├── header.jsx                # Global header/nav
│       ├── footer.jsx                # Global footer
│       ├── badge-embed.jsx           # Embeddable badge component
│       └── oauth-button.jsx          # Generic OAuth connect button
├── lib/
│   ├── zkverify/
│   │   ├── client.js                 # zkVerify SDK client setup
│   │   ├── proof-types.js            # Define proof schemas (earnings, audience, etc.)
│   │   ├── generators/
│   │   │   ├── creator-proofs.js     # Generate creator proofs (YouTube, Stripe)
│   │   │   └── business-proofs.js    # Generate business proofs (GA, HubSpot)
│   │   └── verifier.js               # Verify proofs client-side
│   ├── oauth/
│   │   ├── youtube.js                # YouTube OAuth + API calls
│   │   ├── stripe.js                 # Stripe OAuth + earnings fetch
│   │   ├── google-analytics.js       # GA OAuth + metrics
│   │   └── hubspot.js                # HubSpot OAuth + CRM data
│   ├── storage/
│   │   ├── profiles.js               # CRUD for user profiles (Vercel KV)
│   │   └── proofs.js                 # Store proof metadata (optional)
│   ├── utils/
│   │   ├── cn.js                     # classnames utility (shadcn)
│   │   ├── format.js                 # Format numbers, dates, currencies
│   │   └── validation.js             # Input validation helpers
│   └── config.js                     # App config (OAuth keys, zkVerify endpoints)
├── hooks/
│   ├── use-auth.js                   # Authentication state hook
│   ├── use-proof-generator.js        # Hook for generating proofs
│   ├── use-profile.js                # Fetch/update profile data
│   └── use-toast.js                  # Toast notifications (shadcn)
├── context/
│   └── auth-context.jsx              # Global auth context (optional vs Zustand)
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── badges/                   # Badge SVG assets
│   │   └── og-image.png              # Open Graph image
│   └── embed/
│       └── badge-widget.html         # Standalone embeddable badge HTML
├── styles/
│   └── animations.css                # Custom animations (proof generation, etc.)
├── .env.local.example                # Example environment variables
├── .gitignore
├── components.json                   # shadcn/ui config
├── next.config.js                    # Next.js config
├── package.json
├── tailwind.config.js
├── jsconfig.json                     # JavaScript path aliases
└── README.md
```

---

## Key Architecture Decisions

### 1. **Route Groups** (`(marketing)` and `(dashboard)`)
- **Why**: Organize routes without affecting URL structure
- **Benefit**: Different layouts for public vs. authenticated pages

### 2. **App Router API Routes** (`app/api/*`)
- **OAuth callbacks**: Handle redirects after OAuth flow
- **Profile CRUD**: Lightweight endpoints for storing/fetching user profiles
- **Proof verification**: Optional server-side verification (zkVerify SDK)

### 3. **zkVerify Integration** (`lib/zkverify/*`)
- **Centralized proof logic**: All proof generation in one place
- **Schema definitions**: Define proof types for creators vs. businesses (using JSDoc)
- **Client-side only**: No private data sent to server

### 4. **OAuth Abstraction** (`lib/oauth/*`)
- **Per-platform modules**: One file per integration (YouTube, Stripe, etc.)
- **Consistent API**: All return normalized metric data
- **Client-side flow**: Use PKCE for secure OAuth without backend

### 5. **Storage Strategy** (`lib/storage/*`)
- **MVP**: Vercel KV (Redis-like, serverless)
- **Schema**: Store username, badges, proof metadata (not raw data)
- **Alternative**: Start in-memory, migrate to KV when needed

### 6. **Component Organization**
- **`ui/`**: Pure shadcn components (no business logic)
- **`marketing/`**: Landing page sections
- **`dashboard/`**: Proof generation, metrics
- **`profile/`**: Public profile display
- **`directory/`**: Explore/search features
- **`shared/`**: Used across multiple areas

### 7. **JavaScript Best Practices**
- **JSDoc comments**: Use JSDoc for function parameters and return types
- **PropTypes**: Optional validation with `prop-types` package
- **Modern ES6+**: Destructuring, async/await, optional chaining
- **Path aliases**: Configure in `jsconfig.json` for clean imports (`@/components`, `@/lib`, etc.)

---

## Data Flow Example: Creator Generates Earnings Proof

1. **User clicks "Get Proofed" for "Earnings > $5k/mo"**
   - Component: `components/dashboard/proof-generator.jsx`
   - Hook: `hooks/use-proof-generator.js`

2. **Check OAuth connection**
   - If not connected: Redirect to `lib/oauth/stripe.js` → OAuth flow
   - If connected: Fetch earnings from Stripe API (client-side)

3. **Generate ZK proof**
   - Call `lib/zkverify/generators/creator-proofs.js`
   - Use `@zkverify/sdk` to create proof (data never leaves browser)
   - Returns proof object + badge metadata

4. **Store badge on profile**
   - Call `lib/storage/profiles.js` → Update user's badge list
   - Save proof metadata (proof hash, timestamp, metric type)

5. **Display on profile**
   - Navigate to `app/@[username]/page.jsx`
   - Fetch profile from storage
   - Render badges via `components/profile/badge-display.jsx`

6. **Share/Embed**
   - User clicks "Share" → `components/profile/share-buttons.jsx`
   - Copy embed code → `public/embed/badge-widget.html`

---

## Environment Variables (`.env.local`)

```bash
# OAuth Credentials
NEXT_PUBLIC_YOUTUBE_CLIENT_ID=
NEXT_PUBLIC_STRIPE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS_CLIENT_ID=
NEXT_PUBLIC_HUBSPOT_CLIENT_ID=

# zkVerify
NEXT_PUBLIC_ZKVERIFY_ENDPOINT=https://testnet-rpc.zkverify.io
NEXT_PUBLIC_ZKVERIFY_NETWORK=testnet

# Storage (Vercel KV)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## JavaScript Code Patterns

### JSDoc Example (for type hints and documentation)

```javascript
/**
 * Generates a zero-knowledge proof for creator earnings
 * @param {Object} options - Proof generation options
 * @param {string} options.platform - Platform name (e.g., 'stripe', 'youtube')
 * @param {number} options.threshold - Minimum threshold to prove
 * @param {string} options.accessToken - OAuth access token
 * @returns {Promise<{proof: string, metadata: Object}>} The generated proof and metadata
 */
export async function generateEarningsProof({ platform, threshold, accessToken }) {
  // Implementation
}
```

### Path Aliases (jsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"]
    }
  }
}
```

---

## Next Steps

1. **Initialize Next.js 15**:
   ```bash
   npx create-next-app@latest proofed --js --tailwind --app
   ```

2. **Install Dependencies**:
   ```bash
   npm install @zkverify/sdk @vercel/kv zustand clsx tailwind-merge
   npx shadcn@latest init
   ```

3. **Set up shadcn components**:
   ```bash
   npx shadcn@latest add button card dialog badge tabs
   ```

4. **Create folder structure** (start with `lib/zkverify` and `lib/oauth`)

5. **Build MVP flow**:
   - Landing page (`app/page.jsx`)
   - Creator dashboard (`app/(dashboard)/creator/page.jsx`)
   - First proof type (Stripe earnings)
   - Profile page (`app/@[username]/page.jsx`)

---

## File Priorities for Week 1-2 (Core MVP)

| Priority | File/Folder | Purpose |
|----------|-------------|---------|
| 🔴 High | `lib/zkverify/client.js` | zkVerify SDK setup |
| 🔴 High | `lib/oauth/stripe.js` | Stripe earnings fetch |
| 🔴 High | `components/dashboard/proof-generator.jsx` | Main UX component |
| 🔴 High | `app/(dashboard)/creator/page.jsx` | Creator flow |
| 🔴 High | `app/@[username]/page.jsx` | Profile page |
| 🟡 Medium | `lib/storage/profiles.js` | Store badges |
| 🟡 Medium | `app/api/profiles/route.js` | Profile API |
| 🟢 Low | `components/marketing/hero.jsx` | Landing page |

---


