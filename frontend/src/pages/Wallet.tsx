import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { WalletCards, Gift, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { getMe, getWallet, Wallet as WalletData } from '@/lib/api';
import { Reveal } from '@/components/Reveal';

type UserData = {
  name: string;
  email: string;
};

export default function Wallet() {
  const [user, setUser] = useState<UserData | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAuthenticated, setNotAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setNotAuthenticated(true);
      setLoading(false);
      return;
    }

    Promise.all([getMe(token), getWallet(token)])
      .then(([userData, walletData]) => {
        setUser(userData);
        setWallet(walletData);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        setError('Unable to load your wallet.');
        setNotAuthenticated(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-noir-950" />;
  }

  if (notAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const balance = Number(wallet?.balance ?? 0);

  return (
    <div className="bg-noir-950 min-h-screen">
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-to-br from-primary-600 via-primary-800 to-noir-950 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <Reveal variant="fade-up" duration={500}>
            <div className="flex items-center gap-2 text-primary-300 text-sm font-semibold mb-4">
              <WalletCards className="w-5 h-5" />
              My Wallet
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mb-3">
              Your Nexus credits
            </h1>
            <p className="text-white/65 max-w-xl">
              Welcome, {user.name.split(' ')[0]}. Your credits stay inside Nexus and can be used for eligible site features.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative -mt-12 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <Reveal variant="fade-up" duration={500}>
            <div className="rounded-3xl bg-noir-900 border border-primary-500/20 shadow-2xl shadow-black/40 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-noir-400 text-sm mb-3">
                      <WalletCards className="w-4 h-4" />
                      Available balance
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl sm:text-6xl font-display font-bold text-white">
                        ${balance.toFixed(2)}
                      </span>
                      <span className="text-noir-500 mb-2">{wallet?.currency ?? 'USD'}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-primary-500/10 border border-primary-500/20 px-5 py-4">
                    <div className="flex items-center gap-2 text-primary-300 font-semibold text-sm">
                      <Gift className="w-4 h-4" />
                      Welcome reward
                    </div>
                    <p className="text-white font-bold mt-1">$60 site credits</p>
                    <p className="text-noir-500 text-xs mt-1">Included with account creation</p>
                  </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                    <Sparkles className="w-5 h-5 text-primary-300 mb-3" />
                    <p className="text-sm font-semibold text-white">Site-only credits</p>
                    <p className="text-xs text-noir-500 mt-1">No cash withdrawal or transfer.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                    <ShieldCheck className="w-5 h-5 text-secondary-400 mb-3" />
                    <p className="text-sm font-semibold text-white">Account protected</p>
                    <p className="text-xs text-noir-500 mt-1">Balance is stored with your account.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                    <ArrowUpRight className="w-5 h-5 text-primary-300 mb-3" />
                    <p className="text-sm font-semibold text-white">Ready to use</p>
                    <p className="text-xs text-noir-500 mt-1">Use credits on supported Nexus features.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 px-6 sm:px-8 py-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-xs text-noir-500">
                  Your balance is maintained by the Nexus backend.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-all"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
