'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect to account
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      router.push('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="bg-[#141418] border border-[#24242E] p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="font-brand text-2xl font-extrabold text-gold-gradient tracking-widest block">
            DS WARDROBE
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
            Patron Sign In
          </h1>
          <p className="text-xs text-[#8A8A96]">
            Sign in to access your bespoke order history, saved looks, and exclusive drops.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#3A1818] border border-[#5E2222] text-[#FCA5A5] text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="patron@dswardrobe.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#181820] border border-[#2E2E3C] rounded-xl px-4 py-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <Mail className="w-4 h-4 text-[#7A7A8A] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#A0A0B0] font-semibold uppercase tracking-wider">
                Password *
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#181820] border border-[#2E2E3C] rounded-xl px-4 py-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <Lock className="w-4 h-4 text-[#7A7A8A] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#E5C058] text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-[#202028] text-[11px] text-center space-y-2">
          <span className="text-[#808090] block">Quick Testing Accounts:</span>
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              onClick={() => handleQuickFill('patron@dswardrobe.com', 'patron123')}
              className="px-2.5 py-1 bg-[#1A1A22] border border-[#2A2A38] text-[#D4AF37] rounded-lg hover:border-[#D4AF37]"
            >
              Fill Patron
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@dswardrobe.com', 'admin123')}
              className="px-2.5 py-1 bg-[#1A1A22] border border-[#2A2A38] text-[#D4AF37] rounded-lg hover:border-[#D4AF37]"
            >
              Fill Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#808090]">
          Don't have a patron account?{' '}
          <Link href="/signup" className="text-[#D4AF37] font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
