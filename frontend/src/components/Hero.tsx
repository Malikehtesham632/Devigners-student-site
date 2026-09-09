import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, BarChart3, Zap, Users, TrendingUp, Sparkles } from 'lucide-react';

const logos = ['Acme Corp', 'Globex', 'Stark Industries', 'Umbrella', 'Wayne Co.', 'Cyberdyne'];

const barHeights = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMouse({
        x: (e.clientX - cx) / rect.width,
        y: (e.clientY - cy) / rect.height,
      });
    };

    el.addEventListener('mousemove', onMouseMove);
    return () => el.removeEventListener('mousemove', onMouseMove);
  }, []);

  const parallax = (depth: number) => ({
    transform: `translate(${mouse.x * depth}px, ${mouse.y * depth}px)`,
  });

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden gradient-bg">
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow"
        style={parallax(30)}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s', ...parallax(40) }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float-slow"
        style={parallax(50)}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6 animate-fade-in-down">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-secondary-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-secondary-400" />
              </span>
              New: AI-powered analytics now live
              <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-bounce-subtle" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight animate-fade-in-up">
              The platform that
              <br />
              <span className="text-gradient-animated">runs your business</span>
              <br />
              on autopilot
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl animate-fade-in-up animate-delay-200">
              Unify your teams, automate your workflows, and scale faster with one
              powerful platform built for modern businesses.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-300">
              <a
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-primary-300 to-primary-500 text-noir-950 rounded-xl font-semibold text-base shadow-2xl shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
              >
                <span className="relative">
                  Start free trial
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-noir-950/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#solutions"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 glass text-white rounded-xl font-semibold text-base hover:bg-white/10 transition-all"
              >
                <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                Watch demo
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-white/60 text-sm animate-fade-in animate-delay-500">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
                14-day free trial
              </span>
            </div>
          </div>

          <div
            className="relative hidden lg:block animate-scale-in animate-delay-300"
            style={parallax(-15)}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl animate-glow" />
            <div className="relative glass rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-400 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-400 transition-colors cursor-pointer" />
                </div>
                <span className="text-white/40 text-xs font-medium">nexus.app/dashboard</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { icon: TrendingUp, label: 'Revenue', value: '$847K', change: '+18%' },
                  { icon: Users, label: 'Active Users', value: '12,840', change: '+24%' },
                  { icon: Zap, label: 'Tasks Done', value: '1,294', change: '+32%' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="glass rounded-xl p-3 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${0.5 + i * 0.15}s` }}
                  >
                    <stat.icon className="w-4 h-4 text-secondary-400 mb-2" />
                    <p className="text-white/50 text-xs">{stat.label}</p>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-secondary-400 text-xs font-semibold">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <BarChart3 className="w-5 h-5 text-primary-300" />
                  <span className="text-white/50 text-xs">Weekly Performance</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {barHeights.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300 hover:from-secondary-600 hover:to-secondary-400 hover:scale-y-110 origin-bottom"
                      style={{
                        height: `${h}%`,
                        transitionDelay: `${i * 30}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3 animate-slide-in-right">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-bold">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">John Doe</p>
                    <p className="text-white/40 text-xs">Closed deal — $45,000</p>
                  </div>
                  <span className="text-secondary-400 text-xs">2m ago</span>
                </div>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex items-center gap-3 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
                    SK
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Sarah Kim</p>
                    <p className="text-white/40 text-xs">New project started</p>
                  </div>
                  <span className="text-white/40 text-xs">5m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-10 animate-fade-in animate-delay-700">
          <p className="text-center text-white/40 text-sm font-medium mb-6 uppercase tracking-wider">
            Trusted by 10,000+ companies worldwide
          </p>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-noir-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-noir-950 to-transparent z-10 pointer-events-none" />
            <div className="flex items-center gap-12 animate-marquee hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
              {[...logos, ...logos].map((logo, i) => (
                <span
                  key={i}
                  className="text-2xl font-bold text-white/30 hover:text-white/60 transition-all duration-300 whitespace-nowrap hover:scale-110"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
