import { Reveal } from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import { Target, Users, Rocket } from 'lucide-react';

const values = [
  { icon: Target, title: 'Focused', body: 'We build fewer things, and make sure each one genuinely earns its place in your workflow.' },
  { icon: Users, title: 'Customer-led', body: 'Almost everything we ship traces back to a real request from a real team using Nexus.' },
  { icon: Rocket, title: 'Fast-moving', body: 'We ship improvements weekly, not quarterly, so feedback turns into changes quickly.' },
];

export default function About() {
  return (
    <div className="bg-noir-950">
      <PageHeader
        eyebrow="Company"
        title="Building the operating layer for modern teams"
        description="Nexus started as an internal tool to fix our own scattered workflows. Today it helps teams everywhere spend less time managing tools and more time doing the work that matters."
      />

      <section className="py-20 bg-noir-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Reveal key={value.title} variant="fade-up" delay={index * 120} duration={600}>
                <div className="p-8 rounded-2xl border border-primary-500/10 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10 transition-all h-full bg-noir-900">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5">
                    <value.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-noir-300 text-sm leading-relaxed">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-noir-900">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <Reveal variant="fade-up" duration={600}>
            <h2 className="text-2xl font-bold text-white mb-4">Where we are headed</h2>
            <p className="text-noir-300 leading-relaxed">
              We are focused on making Nexus the default place teams go to plan, track, and automate their
              work, expanding steadily based on what our users actually ask for, not what looks good on a
              roadmap slide.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
