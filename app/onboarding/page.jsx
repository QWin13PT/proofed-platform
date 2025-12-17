'use client';

/**
 * Onboarding Page
 * Collect user type and initial profile info
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/context/auth-context';

const progressIndicator = (step) => {
  return (
      <>
   
    <div className="w-full h-2 bg-dark/5 rounded-full overflow-hidden mb-2">
      <div className="h-full bg-accent transition-all duration-300 rounded-full" style={{ width: `${step * 50}%` }}></div>
    </div>
    <div className="flex items-center justify-between ">
      <span className="text-sm font-medium text-dark">Step {step} of 2</span>
      <span className="text-sm font-medium text-dark">{step * 50}%</span>
    </div>
    </>
  )
}

export default function OnboardingPage() {
  const { user, createProfile } = useAuthContext();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createProfile({
        username: formData.username.toLowerCase().trim(),
        display_name: formData.displayName || user?.user_metadata?.full_name || 'User',
        bio: formData.bio,
        user_type: userType,
        avatar_url: user?.user_metadata?.avatar_url || '',
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4 relative">
        <Link href="/" className="absolute top-8 left-8 z-10">
          <h1 className="text-4xl font-bold mb-2 text-dark font-[family-name:var(--font-outfit)]">
            proofed
          </h1>
        </Link>
        <Card className="w-full max-w-2xl p-8">
        

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Proofed!</h1>
            <p className="text-dark">
              Let's set up your account. First, tell us what type of user you are:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => handleUserTypeSelect('creator')}
              className="p-8 border-2 border-dark/20 rounded-2xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all text-left"
            >
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold mb-2">Creator</h3>
              <p className="text-muted-foreground text-sm">
                Prove your YouTube subscribers, earnings, and engagement metrics privately.
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                <li>✓ YouTube verification</li>
                <li>✓ Earnings badges</li>
                <li>✓ Audience proofs</li>
              </ul>
            </button>

            <button
              onClick={() => handleUserTypeSelect('business')}
              className="p-8 border-2 rounded-lg hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950 transition-all text-left"
            >
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-muted-foreground text-sm">
                Prove your ARR, MAU, and growth metrics without exposing exact numbers.
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                <li>✓ Revenue verification</li>
                <li>✓ User metrics</li>
                <li>✓ Growth proofs</li>
              </ul>
            </button>
          </div>
            {/* Progress Indicator */}
            {progressIndicator(1)}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4 relative">
      <Link href="/" className="absolute top-8 left-8 z-10">
        <h1 className="text-4xl font-bold mb-2 text-dark font-[family-name:var(--font-outfit)]">
          proofed
        </h1>
      </Link>
      <Card className="w-full max-w-2xl p-8">
      

        {/* Back Button */}
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-dark transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to user type
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">
            Choose a username and personalize your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Username *
            </label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="yourname"
              required
              className="lowercase"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your unique handle (proofed.xyz/@{formData.username || 'yourname'})
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Display Name
            </label>
            <Input
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder={user?.user_metadata?.full_name || 'Your Name'}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Bio
            </label>
            <Input
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mb-6" disabled={loading}>
            {loading ? 'Creating Profile...' : 'Complete Setup'}
          </Button>

            {/* Progress Indicator */}
        {progressIndicator(2)}
        </form>
      </Card>
    </div>
  );
}

