import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { login, signup } from '@/lib/api';

type Props = { mode: 'signin' | 'signup'; onClose: () => void; onLoginSuccess: () => void };

export default function AuthModal({ mode: initialMode, onClose, onLoginSuccess }: Props) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (mode === 'signup' && name.trim().length < 2) return setError('Please enter your full name.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(name.trim(), email.trim(), password);
        const result = await login(email.trim(), password);
        localStorage.setItem('access_token', result.access_token);
      } else {
        const result = await login(email.trim(), password);
        localStorage.setItem('access_token', result.access_token);
      }
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-600">Devigners</p><h2 className="mt-1 text-2xl font-extrabold text-slate-950">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2></div>
        <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Close"><X /></button>
      </div>
      <form onSubmit={submit} className="space-y-4 p-6">
        {mode === 'signup' && <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required className="field" placeholder="Your name" /></label>}
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="field" placeholder="you@example.com" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Password</span><div className="relative"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="field pr-12" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <button disabled={loading} className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
        <p className="text-center text-sm text-slate-500">{mode === 'signup' ? 'Already have an account?' : 'New to Devigners?'} <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }} className="font-extrabold text-red-600">{mode === 'signup' ? 'Sign in' : 'Create one'}</button></p>
      </form>
    </div>
  </div>;
}
