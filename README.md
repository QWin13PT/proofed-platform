# Proofed

> Prove your stats. Unlock better opportunities.

Proofed is a zero-knowledge platform that lets creators and businesses generate **verifiable badges** for their metrics—earnings, audience size, growth rates, and more—without exposing raw data.

## Why Proofed?

Screenshots can be faked. Sharing dashboards exposes sensitive data. Proofed solves this with **zero-knowledge proofs**: cryptographically verifiable credentials that prove thresholds (e.g., ">$10K revenue" or "100K+ subscribers") without revealing exact numbers.

## Key Features

- **100% Privacy**: Your data never leaves your device. Proofs are generated client-side in your browser.
- **Instant Verification**: Anyone can verify your badges in one click via zkVerify.
- **No Blockchain Hassle**: Web2-first experience—no wallet, no gas fees, no technical knowledge required.
- **Multi-Platform**: Connect YouTube, Stripe, Google Analytics, HubSpot, and more via OAuth.
- **Shareable Profiles**: Get a custom profile page with embeddable badges.

## How It Works

1. **Connect Platform** – Link your account via OAuth (YouTube, Stripe, etc.)
2. **Choose Metric** – Select what you want to prove (subscribers, revenue, traffic, etc.)
3. **Generate Proof** – Create your zero-knowledge proof instantly in-browser
4. **Share Badge** – Embed verifiable badges on socials, pitch decks, or your bio

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **ZK Proofs**: zkVerify SDK
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Add your OAuth credentials and zkVerify configuration

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Use Cases

**For Creators**:
- Prove subscriber counts to unlock brand deals
- Verify revenue thresholds for sponsorships
- Demonstrate engagement without exposing analytics

**For Businesses**:
- Prove ARR to investors without financial exposure
- Verify user metrics for partnerships
- Establish market credibility with verifiable stats


## License

MIT

---

**Built with [zkVerify](https://zkverify.io)** – Making zero-knowledge proofs accessible to everyone.
