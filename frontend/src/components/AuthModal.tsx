import { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { signup, login } from '@/lib/api';

type AuthModalProps = {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess: () => void;
};

export default function AuthModal({ mode, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(name, email, password);
        setSuccess('Account created! Your $60 welcome credits are ready in your wallet.');
        setIsSignup(false);
      } else {
        const result = await login(email, password);
        localStorage.setItem('access_token', result.access_token);
        setSuccess('Signed in successfully!');
        onLoginSuccess();
        setTimeout(onClose, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative bg-noir-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-noir-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="text-noir-400 text-sm mb-4">
          {isSignup ? 'Start your free trial today' : 'Sign in to your account'}
        </p>

        {isSignup && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-500/20 bg-primary-500/5 px-4 py-3">
            <Gift className="w-4 h-4 text-primary-300 flex-shrink-0" />
            <p className="text-xs text-noir-200">
              Create an account and receive <span className="font-bold text-primary-300">$60 in site credits</span>.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-3 rounded-xl bg-noir-800 border border-white/10 text-white placeholder:text-noir-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded-xl bg-noir-800 border border-white/10 text-white placeholder:text-noir-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-xl bg-noir-800 border border-white/10 text-white placeholder:text-noir-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-primary-300 to-primary-500 text-noir-950 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign up & claim $60' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-noir-400 mt-6">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setError('');
              setSuccess('');
              setIsSignup(!isSignup);
            }}
            className="text-primary-400 font-semibold hover:underline"
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
