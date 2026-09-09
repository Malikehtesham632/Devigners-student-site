import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { getMe } from '@/lib/api';

const links = [
  { label: 'Home', to: '/' },
  { label: 'CUBE', to: '/cube' },
  { label: 'COHORT', to: '/cohort' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const refreshUser = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return setUserName(null);
    getMe(token).then((user) => setUserName(user.name)).catch(() => {
      localStorage.removeItem('access_token');
      setUserName(null);
    });
  };

  useEffect(() => {
    refreshUser();
    const onOpenSignup = () => setAuthMode('signup');
    window.addEventListener('open-signup', onOpenSignup);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('open-signup', onOpenSignup);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const signOut = () => {
    localStorage.removeItem('access_token');
    setUserName(null);
    setOpen(false);
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'border-b border-red-100 bg-white/95 shadow-sm backdrop-blur' : 'bg-white/90 backdrop-blur-sm'}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img src="/devigners-logo.gif" alt="Devigners" className="h-11 w-11 rounded-xl object-cover" />
            <div>
              <div className="text-lg font-extrabold tracking-tight text-slate-950">DEVIGNERS</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-600">Learning Institute</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-slate-50 hover:text-red-600'}`}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {userName ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-red-200 hover:text-red-600">
                  <User className="h-4 w-4" /> {userName}
                </Link>
                <button onClick={signOut} className="rounded-full p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthMode('signin')} className="text-sm font-bold text-slate-600 hover:text-red-600">Sign in</button>
                <button onClick={() => setAuthMode('signup')} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">Join Devigners</button>
              </>
            )}
          </div>

          <button className="rounded-xl p-2 text-slate-800 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}>{link.label}</NavLink>)}
              <div className="my-2 h-px bg-slate-100" />
              {userName ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-bold text-slate-700">My profile</Link>
                  <button onClick={signOut} className="flex items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-600"><LogOut className="h-4 w-4" /> Sign out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('signin'); setOpen(false); }} className="px-4 py-3 text-left text-sm font-bold text-slate-700">Sign in</button>
                  <button onClick={() => { setAuthMode('signup'); setOpen(false); }} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white">Join Devigners</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onLoginSuccess={refreshUser} />}
    </>
  );
}
