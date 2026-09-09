import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import ContactModal from '@/components/ContactModal';

export default function CTA() {
  const [formType, setFormType] = useState<'trial' | 'demo' | null>(null);
  return (
    <section className="relative py-24 overflow-hidden bg-noir-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal variant="scale" duration={800}>
          <div className="relative rounded-3xl overflow-hidden gradient-bg p-12 lg:p-20 text-center">
            <div className="absolute inset-0 grid-pattern opacity-40" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float-slow" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-secondary-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-secondary-400" />
                </span>
                Get started in minutes
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
                Ready to transform
                <br />
                <span className="text-gradient-animated">how you work?</span>
              </h2>
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Join 10,000+ teams already running on Nexus. Start your free trial today —
                no credit card required, no strings attached.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setFormType('trial')}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-300 to-primary-500 text-noir-950 rounded-xl font-semibold text-base shadow-2xl shadow-primary-500/20 hover:-translate-y-1 transition-all"
                >
                  Start free trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setFormType('demo')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 glass text-white rounded-xl font-semibold text-base hover:bg-white/10 hover:-translate-y-1 transition-all"
                >
                  Book a demo
                </button>
              </div>
              <p className="mt-8 text-white/40 text-sm">
                Average setup time: 15 minutes. Average ROI: 3x in first quarter.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {formType && <ContactModal formType={formType} onClose={() => setFormType(null)} />}
    </section>
  );
}
