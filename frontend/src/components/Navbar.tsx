import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Gem, User, LogOut, WalletCards } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { getMe } from '@/lib/api';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  function checkLoginStatus() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUserName(null);
      return;
    }
    getMe(token)
      .then((user) => setUserName(user.name))
      .catch(() => {
        localStorage.removeItem('access_token');
        setUserName(null);
      });
  }

  function handleSignOut() {
    localStorage.removeItem('access_token');
    setUserName(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    checkLoginStatus();

    const openSignup = () => setAuthMode('signup');
    window.addEventListener('open-signup', openSignup);

    return () => window.removeEventListener('open-signup', openSignup);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-noir-950/85 backdrop-blur-lg shadow-lg shadow-black/40 border-b border-primary-500/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-105">
              <Gem className="w-5 h-5 text-noir-950" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Nexus
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg text-noir-200 hover:text-primary-300 hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {userName ? (
              <>
                <Link
                  to="/wallet"
                  className="flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200 transition-colors"
                >
                  <WalletCards className="w-4 h-4" />
                  Wallet
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-semibold text-noir-200 hover:text-primary-300 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Hi, {userName}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm font-semibold text-noir-200 hover:text-primary-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-sm font-semibold text-noir-200 hover:text-primary-300 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-sm font-semibold text-noir-950 bg-gradient-to-r from-primary-300 to-primary-500 px-5 py-2.5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-noir-900 rounded-2xl shadow-xl border border-primary-500/10 mt-2 mb-4 p-4 animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-noir-200 hover:text-primary-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 my-2" />
              {userName ? (
                <>
                  <Link
                    to="/wallet"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-semibold text-primary-300 flex items-center gap-2 hover:text-primary-200"
                  >
                    <WalletCards className="w-4 h-4" />
                    Wallet
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-noir-200 flex items-center gap-2 hover:text-primary-300"
                  >
                    <User className="w-4 h-4" />
                    Hi, {userName}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-3 text-sm font-semibold text-noir-200 hover:text-primary-300 rounded-lg transition-colors text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setMobileOpen(false);
                    }}
                    className="px-4 py-3 text-sm font-semibold text-noir-200 hover:text-primary-300 rounded-lg transition-colors text-left"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setMobileOpen(false);
                    }}
                    className="px-4 py-3 text-sm font-semibold text-noir-950 bg-gradient-to-r from-primary-300 to-primary-500 rounded-xl text-center"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onLoginSuccess={checkLoginStatus}
        />
      )}
    </header>
  );
}
