import { Gift, X } from 'lucide-react';
import { useState } from 'react';

type OfferBannerProps = {
  onGetStarted: () => void;
};

export default function OfferBanner({ onGetStarted }: OfferBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-noir-900/95 backdrop-blur-lg border-b border-primary-500/20">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-xs sm:text-sm">
        <Gift className="w-4 h-4 text-primary-300 flex-shrink-0" />
        <span className="text-white/90">
          <span className="font-semibold text-primary-300">$60 welcome credits</span>
          {' '}when you create an account.
        </span>
        <button
          onClick={onGetStarted}
          className="font-semibold text-primary-300 hover:text-primary-200 underline underline-offset-2"
        >
          Get started
        </button>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 sm:right-6 p-1 text-noir-400 hover:text-white transition-colors"
          aria-label="Close offer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
