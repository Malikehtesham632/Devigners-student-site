import { Star, Quote } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, Lattice Labs',
    avatar: 'SC',
    avatarBg: 'from-primary-400 to-primary-600',
    quote: "Nexus replaced six different tools for us. Our team ships twice as fast and our data is finally in one place. It's been transformative.",
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'COO, BrightPath',
    avatar: 'MJ',
    avatarBg: 'from-secondary-400 to-secondary-600',
    quote: 'The automation workflows alone saved us 30+ hours per week. What used to take a full-time role is now running on autopilot.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'VP Operations, DataFlow',
    avatar: 'ER',
    avatarBg: 'from-primary-300 to-primary-600',
    quote: 'We evaluated every platform on the market. Nexus was the only one that could scale from our 20-person team to 500 without missing a beat.',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Founder, Stackpine',
    avatar: 'JP',
    avatarBg: 'from-primary-400 to-primary-600',
    quote: 'The real-time analytics are a game-changer. We catch issues before they become problems and make decisions based on actual data, not gut feelings.',
    rating: 5,
  },
  {
    name: 'Aisha Bello',
    role: 'Head of Growth, Vertex',
    avatar: 'AB',
    avatarBg: 'from-secondary-400 to-secondary-600',
    quote: 'Setup took 15 minutes. Fifteen. Our integrations were connected, dashboards were live, and the team was collaborating the same afternoon.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'CTO, Northwind',
    avatar: 'DK',
    avatarBg: 'from-primary-300 to-primary-600',
    quote: 'As a CTO, security is my top concern. Nexus checked every box — SOC 2, SSO, granular permissions. My security team signed off in record time.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 bg-noir-950 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-25" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Loved by teams
              <span className="gradient-text"> everywhere</span>
            </h2>
            <p className="mt-6 text-lg text-noir-300 leading-relaxed">
              Don't just take our word for it. Here's what 10,000+ teams have to say.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <Reveal
              key={t.name}
              variant="scale"
              delay={(index % 3) * 120}
              duration={600}
            >
              <div className="group relative bg-noir-900 rounded-2xl p-7 border border-primary-500/10 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 card-shine">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 group-hover:text-primary-500/20 group-hover:scale-110 transition-all duration-500" />

                <div className="flex gap-1 mb-4 relative">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary-400 text-primary-400 transition-transform duration-300"
                      style={{
                        transitionDelay: `${i * 50}ms`,
                        transform: 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                <p className="text-noir-200 leading-relaxed text-[15px] mb-6 relative">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 relative">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-noir-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
