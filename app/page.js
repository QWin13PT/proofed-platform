import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { HugeiconsIcon } from '@hugeicons/react';
import { WaterfallUp01Icon, UserStoryIcon, Briefcase02Icon } from '@hugeicons-pro/core-solid-standard';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Header theme="transparent" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-dark">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 blur-sm"
          >
            <source src="/videos/landing-page/hero.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay to darken video */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent z-[5]"></div>

          <div className="container mx-auto px-4 py-24 md:py-32 text-center relative z-10 max-w-7xl">
            <Badge className="mb-6 bg-highlight text-dark font-semibold px-4 py-1.5">
              Powered by <Image src="/images/brands/zkverify.svg" alt="zkVerify" width={60} height={12} />
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Prove Your Stats.<br />Unlock Better Opportunities.
            </h1>
            <p className="text-xl md:text-2xl text-light/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stand out with verifiable proof of your audience, income, and growth. All on-chain, with complete privacy: no data shared, no details exposed.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="light" asChild>
                <Link href="/dashboard">Get Verified</Link>
              </Button>

            </div>
          </div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-[1]"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
              <div className="bg-white p-6 rounded-3xl flex flex-col  justify-between">
                <div className="text-5xl font-bold mb-2 text-dark">100<span className=" text-accent">%</span></div>
                <div className="text-dark font-medium ">Privacy Guaranteed<br /><span className="text-base text-dark/50">→ Your data never leaves your device</span></div>
              </div>
              <div className="bg-white p-8 rounded-3xl flex flex-col  justify-between">
                <div className="text-5xl font-bold mb-2 text-dark">&lt;5<span className=" text-accent">s</span></div>
                <div className="text-dark font-medium">Proof Generation<br /><span className="text-base text-dark/50">→ Instant verification, zero wait</span></div>
              </div>
              <div className="bg-white p-8 rounded-3xl flex flex-col  justify-between">
                <div className="text-5xl font-bold mb-2 text-dark">$0</div>
                <div className="text-dark font-medium">Gas Fees<br /><span className="text-base text-dark/50">→ No wallet, no blockchain hassle</span></div>
              </div>
              <div className="bg-white p-8 rounded-3xl flex flex-col  justify-between">
                <div className="text-5xl font-bold mb-2 text-accent">∞</div>
                <div className="text-dark font-medium">Verifications<br /><span className="text-base text-dark/50">→ Anyone can verify, anytime</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-dark">
              Credibility Without Compromise
            </h2>
            <p className="text-xl text-dark/60 text-center mb-16 max-w-3xl mx-auto">
            Proving your numbers shouldn’t mean faking it or exposing everything. There’s a smarter, more secure way.
            </p>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Old Way */}
              <div className="space-y-6 border-2 border-dark/10 p-8 rounded-3xl">
                <h3 className="text-3xl font-bold text-dark mb-6">The problem with traditional proof:</h3>
                <div className="space-y-4">
                  <div className="py-3 border-l-4 border-dark pl-4">
                    <p className="text-dark/80 font-medium">Screenshots can be faked in seconds</p>
                  </div>
                  <div className="py-3 border-l-4 border-dark pl-4">
                    <p className="text-dark/80 font-medium">Sharing dashboards exposes sensitive business data</p>
                  </div>
                  <div className="py-3 border-l-4 border-dark pl-4">
                    <p className="text-dark/80 font-medium">No real verification = zero trust from brands</p>
                  </div>
                  <div className="py-3 border-l-4 border-dark pl-4">
                    <p className="text-dark/80 font-medium">Data leaks can kill your edge</p>
                  </div>
                </div>
              </div>

              {/* New Way */}
              <div className="space-y-6 bg-accent p-8 rounded-3xl">
                <h3 className="text-3xl font-bold text-white mb-6">The new standard: Zero-Knowledge Proofs</h3>
                <div className="space-y-4">
                  <div className="py-3 border-l-4 border-highlight pl-4">
                    <p className="text-light/90 font-medium">Cryptographically unfakeable verification</p>
                  </div>
                  <div className="py-3 border-l-4 border-highlight pl-4">
                    <p className="text-light/90 font-medium">Prove thresholds without revealing exact numbers</p>
                  </div>
                  <div className="py-3 border-l-4 border-highlight pl-4">
                    <p className="text-light/90 font-medium">Anyone can verify in one click</p>
                  </div>
                  <div className="py-3 border-l-4 border-highlight pl-4">
                    <p className="text-light/90 font-medium">Your raw data never leaves your device</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center mt-16">

              <Button size="lg"  asChild>
                <Link href="/dashboard">Ready for proof that actually protects you?</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left Side - Text */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark">Get Verified in Minutes.</h2>
                <p className="text-xl text-dark/60 mb-12 leading-relaxed">
                A simple, secure process that turns your real metrics into trusted proof - fast.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-dark text-highlight font-bold text-xl flex items-center justify-center rounded-full flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2">Connect Platform</h3>
                      <p className="text-dark/70 leading-relaxed">Securely link YouTube, Stripe, Google Analytics, HubSpot, or others via OAuth.
                      Quick, safe—no full access granted.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-dark text-highlight font-bold text-xl flex items-center justify-center rounded-full flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2">Choose Metric</h3>
                      <p className="text-dark/70 leading-relaxed">Pick what you want to prove: subscribers, revenue, monthly users, growth rate—whatever matters most to brands.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-dark text-highlight font-bold text-xl flex items-center justify-center rounded-full flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2">Generate Proof</h3>
                      <p className="text-dark/70 leading-relaxed">Create your zero-knowledge proof right in your browser.
                      Your data stays on your device—nothing uploaded, nothing exposed.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-dark text-highlight font-bold text-xl flex items-center justify-center rounded-full flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2">Share Badge</h3>
                      <p className="text-dark/70 leading-relaxed">Embed a sleek, verifiable badge on socials, pitch decks, or your bio.
                      Brands (or anyone) can check authenticity with one click.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Video */}
              <div className="relative">
                <div className="relative w-full aspect-square bg-light rounded-3xl overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/landing-page/tiktok.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Floating Metric Card */}
                  <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-5 shadow-xl flex items-end justify-between gap-6">
                    <div className="flex flex-col">
                      <div className="w-10 h-10 bg-accent/50 rounded-full flex items-center justify-center mb-3">
                        <HugeiconsIcon icon={WaterfallUp01Icon} size={16} className="text-dark" />
                      </div>
                      <div className="text-xs font-medium text-dark/50 mb-1">Views</div>
                      <div className="text-xl font-semibold text-dark ">125K</div>
                      </div>
                      <div className="flex flex">
                      <div className="flex items-end gap-1.5 h-12">
                        <div className="w-3 bg-accent/20 rounded-full" style={{ height: '30%' }}></div>
                        <div className="w-3 bg-accent/30 rounded-full" style={{ height: '50%' }}></div>
                        <div className="w-3 bg-accent/60 rounded-full" style={{ height: '70%' }}></div>
                        <div className="w-3 bg-accent rounded-full" style={{ height: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases with Examples */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-dark">
              Why Creators and Businesses Choose Proofed
            </h2>
            <p className="text-xl text-dark/60 text-center mb-16 max-w-3xl mx-auto">
              Whether you're negotiating brand deals or fundraising, credibility is currency. Proofed gives you both.
            </p>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Creators */}
              <Card className="p-10 bg-white border-2 border-dark/10">
                <HugeiconsIcon icon={UserStoryIcon} size={56} className="text-accent mb-6" />
                <h3 className="text-3xl font-bold mb-3 text-dark">For Creators</h3>
                <p className="text-dark/60 mb-8 text-lg">Land better deals without exposing your full business</p>
                <div className="space-y-5 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="text-dark font-bold text-lg">→</div>
                    <div>
                      <p className="text-dark font-semibold">Unlock brand partnerships</p>
                      <p className="text-dark/60 text-sm">Prove 10K+, 50K+, or 100K+ subscribers without screenshots</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-dark font-bold text-lg">→</div>
                    <div>
                      <p className="text-dark font-semibold">Negotiate sponsorship rates</p>
                      <p className="text-dark/60 text-sm">Verify $5K, $10K, $50K+ monthly earnings privately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-dark font-bold text-lg">→</div>
                    <div>
                      <p className="text-dark font-semibold">Demonstrate audience quality</p>
                      <p className="text-dark/60 text-sm">Show engagement rates without exposing analytics</p>
                    </div>
                  </div>
                </div>
                <div className="bg-light p-5 rounded-xl border-2 border-dark/10">
                  <p className="text-sm text-dark/80 leading-relaxed"><span className="font-bold">Real example:</span> A creator proves "100K+ subs, $15K+/mo revenue" to land premium brand deals—without sharing dashboard access.</p>
                </div>
              </Card>

              {/* Businesses */}
              <Card className="p-10 bg-white border-2 border-dark/10">
                <HugeiconsIcon icon={Briefcase02Icon} size={56} className="text-accent mb-6" />
                <h3 className="text-3xl font-bold mb-3 text-dark">For Businesses</h3>
                <p className="text-dark/60 mb-8 text-lg">Win trust in fundraising, sales, and partnerships</p>
                <div className="space-y-5 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="text-dark font-bold text-lg">→</div>
                    <div>
                      <p className="text-dark font-semibold">Accelerate fundraising</p>
                      <p className="text-dark/60 text-sm">Prove $1M, $5M, $10M+ ARR to VCs without financial exposure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-dark font-bold text-lg">→</div>
                    <div>
                      <p className="text-dark font-semibold">Close enterprise partnerships</p>
                      <p className="text-dark/60 text-sm">Verify 100K+ MAU or rapid growth without leaking strategy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-dark font-bold text-lg">→</div>
                    <div>
                      <p className="text-dark font-semibold">Establish market credibility</p>
                      <p className="text-dark/60 text-sm">Show CRM size, customer count, or retention metrics safely</p>
                    </div>
                  </div>
                </div>
                <div className="bg-light p-5 rounded-xl border-2 border-dark/10">
                  <p className="text-sm text-dark/80 leading-relaxed"><span className="font-bold">Real example:</span> A SaaS startup proves "$3M ARR, 30% MoM growth" during Series A—investors verify instantly, zero data shared.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-dark">
              Transparent Pricing
            </h2>
            <p className="text-xl text-dark/60 text-center mb-16">Start free. Scale when you're ready. No hidden fees.</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Tier */}
              <Card className="p-10 bg-light border-2 border-dark/10">
                <h3 className="text-2xl font-bold mb-2 text-dark">Free</h3>
                <div className="text-5xl font-bold mb-2 text-dark">$0</div>
                <p className="text-dark/60 mb-8">Perfect for getting started</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <span className="text-dark text-lg">✓</span>
                    <span className="text-dark/80">Basic metric proofs (earnings, audience)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dark text-lg">✓</span>
                    <span className="text-dark/80">Public profile page</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dark text-lg">✓</span>
                    <span className="text-dark/80">Embeddable badges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dark text-lg">✓</span>
                    <span className="text-dark/80">Directory listing</span>
                  </li>
                </ul>
                <Button className="w-full bg-dark text-white hover:bg-dark/90 py-6 text-base font-semibold" asChild>
                  <Link href="/dashboard">Start Free</Link>
                </Button>
              </Card>

              {/* Pro Tier */}
              <Card className="p-10 bg-dark text-white border-4 border-highlight relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-highlight text-dark font-bold px-4 py-1">RECOMMENDED</Badge>
                <h3 className="text-2xl font-bold mb-2">Proofed Pro</h3>
                <div className="text-5xl font-bold mb-2">$19</div>
                <p className="text-light/70 mb-8">For serious creators and businesses</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <span className="text-highlight text-lg">✓</span>
                    <span className="text-light/90">Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-highlight text-lg">✓</span>
                    <span className="text-light/90">Unlimited custom metric thresholds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-highlight text-lg">✓</span>
                    <span className="text-light/90">Business tools (Google Analytics, HubSpot)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-highlight text-lg">✓</span>
                    <span className="text-light/90">Featured directory placement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-highlight text-lg">✓</span>
                    <span className="text-light/90">API access for automation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-highlight text-lg">✓</span>
                    <span className="text-light/90">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-highlight text-dark hover:bg-highlight/90 py-6 text-base font-bold" asChild>
                  <Link href="/dashboard">Upgrade to Pro</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-dark">
Have questions? We've got answers.             </h2>
            <p className="text-xl text-dark/60 text-center mb-16">Everything you need to know about zero-knowledge proofs and Proofed</p>
            <div className="space-y-4">
              <details className="bg-white p-7 rounded-2xl border border-dark/10 hover:border-dark/30 transition-all group cursor-pointer">
                <summary className="font-bold text-lg cursor-pointer text-dark list-none flex justify-between items-center">
                  How does zero-knowledge proof work?
                  <span className="text-dark/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  Zero-knowledge proofs are cryptographic methods that let you prove something is true without revealing the underlying data. For example, you can prove "My revenue exceeds $10K/month" without showing your actual earnings. The proof is generated in your browser using zkVerify's SDK, verified on-chain, and impossible to fake.
                </p>
              </details>

              <details className="bg-white p-7 rounded-2xl border border-dark/10 hover:border-dark/30 transition-all group cursor-pointer">
                <summary className="font-bold text-lg cursor-pointer text-dark list-none flex justify-between items-center">
                  Do I need a crypto wallet or blockchain knowledge?
                  <span className="text-dark/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  No. Proofed is built Web2-first. You sign in with OAuth (just like any normal app), connect your platforms, and generate proofs. No wallet setup, no gas fees, no technical knowledge required. We handle the blockchain complexity behind the scenes.
                </p>
              </details>

              <details className="bg-white p-7 rounded-2xl border border-dark/10 hover:border-dark/30 transition-all group">
                <summary className="font-bold text-lg cursor-pointer text-dark list-none flex justify-between items-center">
                  Can anyone verify my proofs?
                  <span className="text-dark/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  Yes. Anyone can click your badge and verify it instantly through zkVerify. Verification is instant, cryptographically secure, and reveals zero private information. This is what makes Proofed badges superior to screenshots or self-reported claims.
                </p>
              </details>

              <details className="bg-white p-7 rounded-2xl border border-dark/10 hover:border-dark/30 transition-all group cursor-pointer">
                <summary className="font-bold text-lg cursor-pointer text-dark list-none flex justify-between items-center">
                  What platforms and metrics can I prove?
                  <span className="text-dark/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  Currently supported: YouTube (subscribers, views), Stripe & Gumroad (revenue), Google Analytics (traffic, MAU), and HubSpot (contacts, deals). You can prove subscriber counts, revenue thresholds, user counts, growth rates, and more. We add new integrations regularly based on demand.
                </p>
              </details>

              <details className="bg-white p-7 rounded-2xl border border-dark/10 hover:border-dark/30 transition-all group cursor-pointer">
                <summary className="font-bold text-lg cursor-pointer text-dark list-none flex justify-between items-center">
                  Is my data truly private?
                  <span className="text-dark/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  Yes. Your raw data never leaves your device. Proof generation happens entirely client-side in your browser. Proofed never sees, stores, or has access to your actual numbers—only the cryptographic proof that a threshold was met. This is mathematically guaranteed by zero-knowledge cryptography.
                </p>
              </details>

              <details className="bg-white p-7 rounded-2xl border border-dark/10 hover:border-dark/30 transition-all group cursor-pointer">
                <summary className="font-bold text-lg cursor-pointer text-dark list-none flex justify-between items-center">
                  How fast can I get started?
                  <span className="text-dark/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-dark/70 leading-relaxed">
                  Most users generate their first proof in under 3 minutes. The process is simple: sign up, connect your platform via OAuth, select a metric to prove, and generate your badge. That's it. Your verifiable credential is ready to share immediately.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-dark text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Your Credibility. Your Data.<br />Your Competitive Edge.
            </h2>
            <p className="text-xl md:text-2xl text-light/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop compromising between privacy and proof. Get both with zero-knowledge verification.
            </p>
            <Button size="lg" className="bg-highlight text-dark hover:bg-highlight/90 font-bold px-12 py-7 text-lg" asChild>
              <Link href="/dashboard">Get Proofed Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
