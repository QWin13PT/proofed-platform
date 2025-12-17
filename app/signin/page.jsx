'use client';

import Link from 'next/link';
import Image from 'next/image';
/**
 * Sign In Page
 * Google OAuth authentication
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';

export default function SignInPage() {
  const { signInWithGoogle, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-end justify-end">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-end bg-dark p-8 relative overflow-hidden">
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
      
      {/* Copywriting text */}
      <div className="absolute bottom-12 left-8 z-10 max-w-2xl">
        <h2 className="text-5xl font-bold text-white mb-4 leading-tight font-[family-name:var(--font-outfit)]">
          Prove what matters.<br />
          Keep what's private.
        </h2>
        <p className="text-xl text-white/80 leading-relaxed">
          Transform your achievements into verifiable badges without exposing your data. 
          Zero-knowledge proofs meet real-world credentials.
        </p>
      </div>
      
      <Link href="/" className="absolute top-8 left-8 z-10">
        <h1 className="text-4xl font-bold mb-2 text-highlight font-[family-name:var(--font-outfit)]">
          proofed
        </h1>
      </Link>
      <Card className="w-auto h-[calc(100vh-64px)] relative z-10 flex flex-col justify-center">

        <div className="space-y-4 flex flex-col ">
          <div className="text-center mb-8 ">
            <h2 className="text-2xl font-bold mb-2 font-[family-name:var(--font-outfit)]">Welcome!</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to start proving your metrics privately with zero-knowledge proofs.
            </p>
           
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="border"
            size="lg"
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <span className="text-center text-sm text-dark/50 font-medium" >By signing in, you agree to our Terms of Service and Privacy Policy.</span>
          
          {/* User Avatars Section */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                B
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                C
              </div>
            </div>
            <span className="text-xs text-muted-foreground/70">Used by privacy-conscious professionals</span>
          </div>
    
          <div className="text-sm font-medium mt-8 text-center flex items-center justify-center gap-2 absolute bottom-12 left-0 right-0">
              Powered by <Image src="/images/brands/zkverify.svg" alt="zkVerify" width={64} height={10} />
            </div>
        </div>

        
      </Card>
    </div>
  );
}

