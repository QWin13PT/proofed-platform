import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t mt-16 bg-dark text-light">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-2xl mb-4 font-[family-name:var(--font-outfit)] select-none">proofed</h3>
            <p className="text-sm text-muted-foreground">
              Zero-knowledge verification for creators and businesses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/explore" className="hover:underline">Explore</a></li>
              <li><a href="/pricing" className="hover:underline">Pricing</a></li>
              <li><a href="/docs" className="hover:underline">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">YouTube Verification</a></li>
              <li><a href="#" className="hover:underline">Earnings Badges</a></li>
              <li><a href="#" className="hover:underline">Audience Proofs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Business</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Analytics Verification</a></li>
              <li><a href="#" className="hover:underline">ARR Badges</a></li>
              <li><a href="#" className="hover:underline">Growth Metrics</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-light/10 text-center text-sm flex justify-between">
          <p>© {new Date().getFullYear()} <span className="font-bold font-[family-name:var(--font-outfit)] select-none">proofed</span>. </p>
          <div className="flex items-center gap-2">
            <Link href="https://zkverify.io/" target="_blank" className="flex items-center gap-2">Powered by
              <Image src="/images/brands/zkverify-white.svg" alt="zkVerify" width={64} height={10} />
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}

