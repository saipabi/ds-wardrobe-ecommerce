'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password
      });
      router.push('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="bg-[#141418] border border-[#24242E] p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="font-brand text-2xl font-extrabold text-gold-gradient tracking-widest block">
            DS WARDROBE
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
            Create Patron Circle Account
          </h1>
          <p className="text-xs text-[#8A8A96]">
            Join our circle for early access to couture capsule drops and personalized sizing.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#3A1818] border border-[#5E2222] text-[#FCA5A5] text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                First Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ananya"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-[#181820] border border-[#2E2E3C] rounded-xl px-3 py-3 pl-8 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <User className="w-3.5 h-3.5 text-[#7A7A8A] absolute left-2.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="Rao"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-[#181820] border border-[#2E2E3C] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="ananya.rao@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#181820] border border-[#2E2E3C] rounded-xl px-4 py-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <Mail className="w-4 h-4 text-[#7A7A8A] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#181820] border border-[#2E2E3C] rounded-xl px-4 py-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <Phone className="w-4 h-4 text-[#7A7A8A] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[#A0A0B0] font-semibold mb-1 uppercase tracking-wider">
              Password (Min. 6 chars) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Patron Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#808090]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#D4AF37] font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
