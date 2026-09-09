import { Workflow, ShieldCheck, BarChart3, Zap, GitBranch, Globe } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const features = [
  {
    icon: Workflow,
    title: 'Automated Workflows',
    description: 'Build custom workflows that run themselves. Trigger actions, send notifications, and move data between tools — no code required.',
    bg: 'bg-primary-500/5',
    iconBg: 'bg-primary-500',
    glowColor: 'shadow-primary-500/30',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track every metric that matters with live dashboards. Spot trends, catch issues early, and make data-driven decisions in seconds.',
    bg: 'bg-secondary-500/5',
    iconBg: 'bg-secondary-500',
    glowColor: 'shadow-secondary-500/30',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II, GDPR, and HIPAA compliant. End-to-end encryption, SSO, and granular permissions keep your data locked down.',
    bg: 'bg-primary-500/5',
    iconBg: 'bg-primary-500',
    glowColor: 'shadow-primary-500/30',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-100ms response times across the globe. Our edge infrastructure ensures your team never waits, no matter where they are.',
    bg: 'bg-primary-500/5',
    iconBg: 'bg-primary-500',
    glowColor: 'shadow-primary-500/30',
  },
  {
    icon: GitBranch,
    title: 'Seamless Integrations',
    description: 'Connect 200+ tools your team already uses. Slack, Salesforce, HubSpot, Stripe, and more — all working together in harmony.',
    bg: 'bg-secondary-500/5',
    iconBg: 'bg-secondary-500',
    glowColor: 'shadow-secondary-500/30',
  },
  {
    icon: Globe,
    title: 'Global Collaboration',
    description: 'Built for distributed teams. Real-time co-editing, comments, mentions, and presence indicators keep everyone in sync.',
    bg: 'bg-primary-500/5',
    iconBg: 'bg-primary-500',
    glowColor: 'shadow-primary-500/30',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-noir-950 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Everything you need to
              <br />
              <span className="gradient-text">scale your business</span>
            </h2>
            <p className="mt-6 text-lg text-noir-300 leading-relaxed">
              One platform that replaces a dozen tools. Powerful enough for enterprises,
              simple enough for startups.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Reveal
              key={feature.title}
              variant="fade-up"
              delay={index * 100}
              duration={600}
            >
              <div className="group relative bg-noir-900 rounded-2xl p-8 border border-primary-500/10 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 card-shine">
                <div className={`absolute inset-0 ${feature.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 shadow-lg ${feature.glowColor} group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-1 transition-all duration-500`}>
                    <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-noir-300 leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    Learn more
                    <span className="transition-transform">→</span>
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
