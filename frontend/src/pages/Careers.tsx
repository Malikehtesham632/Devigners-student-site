import { Reveal } from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import { MapPin, Clock } from 'lucide-react';

const openRoles = [
  { title: 'Senior Backend Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Customer Success Manager', team: 'Customer Success', location: 'Remote', type: 'Full-time' },
  { title: 'Growth Marketer', team: 'Marketing', location: 'Remote', type: 'Contract' },
];

export default function Careers() {
  return (
    <div className="bg-noir-950">
      <PageHeader
        eyebrow="Company"
        title="Help us build Nexus"
        description="We are a small, remote-first team focused on shipping things that genuinely make work easier. Here is where we currently have openings."
      />

      <section className="py-20 bg-noir-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {openRoles.map((role, index) => (
              <Reveal key={role.title} variant="fade-up" delay={index * 100} duration={500}>
                <a
                  href="#"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-primary-500/10 bg-noir-900 hover:border-primary-500/30 hover:shadow-md hover:shadow-primary-500/10 transition-all"
                >
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{role.title}</h3>
                    <p className="text-sm text-noir-400">{role.team}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-noir-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {role.type}
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade-up" duration={500}>
            <p className="text-center text-noir-400 text-sm mt-10">
              Don't see a fit? Reach out through our contact page and tell us what you'd like to work on.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
