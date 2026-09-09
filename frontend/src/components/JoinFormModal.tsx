import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, UserRound, X } from 'lucide-react';
import { submitContactForm } from '@/lib/api';

type JoinForm = {
  name: string;
  email: string;
  program: 'CUBE' | 'COHORT';
  classMode: 'In-person classes' | 'Online classes';
};

export default function JoinFormModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<JoinForm>({
    name: '',
    email: '',
    program: 'CUBE',
    classMode: 'In-person classes',
  });
  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof JoinForm>(key: K, value: JoinForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      await submitContactForm(
        form.name.trim(),
        form.email.trim(),
        `Program of interest: ${form.program}\nPreferred class format: ${form.classMode}\n\nAdmissions request from the Join Us form.`,
        'admissions'
      );
      setSubmitted(true);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'We could not submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="join-form-title">
      <div className="relative my-8 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-up">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Close join form">
          <X className="h-5 w-5" />
        </button>

        <div className="bg-red-600 px-6 py-7 text-white sm:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-100">Admissions</p>
          <h2 id="join-form-title" className="mt-2 text-3xl font-black">Join Devigners</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-red-50">Tell us a little about yourself and how you would like to learn. Our admissions team will guide you from there.</p>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center sm:px-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600"><CheckCircle2 className="h-7 w-7" /></div>
            <h3 className="mt-5 text-2xl font-black text-slate-950">Request received!</h3>
            <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">Thanks, {form.name}. We have received your admissions request for {form.program} ({form.classMode.toLowerCase()}). Our team will contact you soon.</p>
            <button type="button" onClick={onClose} className="mt-7 rounded-xl bg-red-600 px-6 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-700">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-7 sm:px-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="label">Full name</span>
                <div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required maxLength={100} value={form.name} onChange={(e) => update('name', e.target.value)} className="field pl-10" placeholder="Your name" /></div>
              </label>
              <label>
                <span className="label">Email address</span>
                <div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required type="email" maxLength={254} value={form.email} onChange={(e) => update('email', e.target.value)} className="field pl-10" placeholder="you@example.com" /></div>
              </label>
            </div>

            <label className="mt-5 block">
              <span className="label">Which program interests you?</span>
              <select value={form.program} onChange={(e) => update('program', e.target.value as JoinForm['program'])} className="field">
                <option value="CUBE">CUBE — Computer Fundamentals</option>
                <option value="COHORT">COHORT — Full-Stack Development</option>
              </select>
            </label>

            <fieldset className="mt-5">
              <legend className="label">How would you like to attend?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['In-person classes', 'Online classes'] as const).map((mode) => (
                  <label key={mode} className={`cursor-pointer rounded-2xl border-2 p-4 transition ${form.classMode === mode ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-red-200'}`}>
                    <input type="radio" name="classMode" value={mode} checked={form.classMode === mode} onChange={() => update('classMode', mode)} className="sr-only" />
                    <span className="block text-sm font-extrabold text-slate-900">{mode}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{mode === 'In-person classes' ? 'Learn at the Devigners institute.' : 'Learn remotely with online classes.'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {status && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{status}</div>}
            <button disabled={loading} className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Submitting request…' : 'Submit admissions request'}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">We’ll use these details only to respond to your admissions request.</p>
          </form>
        )}
      </div>
    </div>
  );
}
