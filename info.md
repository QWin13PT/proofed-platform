# Thrive zkVerify Web2 Program #41 — Grant Application Blueprint  
**Project Name:** Proofed  
**Domain suggestion:** proofed.xyz or getproofed.xyz  
**Current date:** December 11, 2025  
**Goal:** Lock in $50k–$150k milestone-based grant with a viral, expanded zkVerify app for creators *and* businesses

## 1. Grant Summary (directly from program page + latest updates)

- Program: zkVerify Web2 Builder Program #41
- Funding pool: ~$3.6 M (VFY + USDC)
- Grant per project: $10k – $150k+ (solo winners typically $50k–$90k)
- Hard milestones:
  - M1 (10%): Live production + open-source repo + docs
  - M2 (40%): 25 000+ zkVerify proofs + 250+ unique users
  - M3 (50%): Sustainable revenue + 250 000+ proofs (or clear path)
- Required focus areas:
  - Authenticity verification
  - Confidentiality protection
  - Fairness validation
  - Knowledge / ownership proofs without revealing data
- Must use zkVerify SDK + client-side proof generation
- Web2-first UX (no wallet, no gas for users)

## 2. Project — Proofed (Expanded Concept with Improved User Flow)

### Tagline
“Get Proofed or stay mid — for creators, businesses, and beyond.”

### One-liner (for the application form)
Proofed is a zero-knowledge platform that lets creators and businesses generate verifiable badges for earnings, audience, engagement, and growth metrics — all privately without exposing raw data.

### Why this is a layup win
- Hits “authenticity verification” + “confidentiality protection” across creator economy and B2B
- Expansion to businesses/metrics scales viral potential (e.g., startups flexing ARR to VCs)
- Name is Gen-Z slang; no competition in multi-metric ZK verifications
- 100% React + zkVerify SDK → textbook Web2-first, with easy tabs for user types
- Improved flow with personalized links + directory boosts discoverability and proof volume

### Improved User Flow (Optimized for Virality + Discoverability)
1. **Sign Up / Connect**: User picks “Creator” or “Business” → OAuth connect (YouTube/Stripe for creators; GA/HubSpot for biz). Auto-creates a unique username-based profile (e.g., proofed.xyz/@yourusername).
2. **Generate Proofs**: Select metric (Earnings > $Xk/mo, Audience > Xk subs, etc.) → Hit “Get Proofed” → zkVerify proof in-browser (data never leaves).
3. **Profile Page**: Each user gets a shareable link (proofed.xyz/@username) showing all their badges/metrics in a clean grid. Badges are verifiable (click to confirm via zkVerify) and embeddable.
4. **Directory Page**: Homepage or /explore lists all verified creators/businesses (searchable/filterable by category, e.g., "Top Proofed Creators" or "Businesses with >$1M ARR"). Drives cross-discovery and more proofs.
5. **Sharing & Embed**: From profile, grab embed code for badges → share on bios, pitch decks, LinkedIn, X. Directory promotes high-proof users for viral loops.

This flow keeps it 4-click simple while adding profiles/directory for retention—e.g., users return to update badges, browse others for inspo.

## 3. Tech Stack (solo-dev, pure Web2)

- Next.js 15 App Router (or Vite + React)
- Tailwind + shadcn/ui
- @zkverify/sdk (official npm package)
- OAuth 2.0 (YouTube, Stripe, Gumroad, Google Analytics, HubSpot — all client-side)
- Hosting: Vercel
- Analytics: Vercel Analytics + zkVerify proof counter
- For Profiles/Directory: Use Next.js dynamic routes (e.g., /@username) + simple in-memory or Vercel KV for user listings (no full DB for MVP)
- No backend, no database, or wallet connect required

## 4. MVP Timeline (6 weeks → Milestone 1, with expansion)

| Week | Deliverable                                   | Proof goal    |
|------|-----------------------------------------------|---------------|
| 1-2  | Core: Landing + Creator earnings/audience proofs (YouTube/Stripe) + basic profile page | 500 test proofs |
| 3-4  | Add engagement/growth metrics + Business tab (GA/HubSpot) + username links | 5 000 proofs   |
| 5    | Directory page (/explore) + badge generator + embed code + share buttons  | 15 000 proofs  |
| 6    | Polish, docs, open-source, submit Milestone 1 | 25k+ proofs    |

→ Milestone 2 hit in week 8–10 via creator buzz + B2B betas + directory traffic.

## 5. Sustainability / Revenue (Milestone 3 requirement)

- Free tier: Basic proofs up to mid-tier metrics
- Proofed Pro ($19/mo or $190/year): Unlimited/custom metrics, business integrations, featured directory spots, API access
- Year-1 projection: 800 creators + 400 businesses → $152k ARR

## 6. Ready-to-paste core component (works today on testnet)
