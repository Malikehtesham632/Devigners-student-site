import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return <footer className="bg-slate-950 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div className="lg:col-span-2"><div className="flex items-center gap-3"><img src="/devigners-logo.gif" alt="Devigners" className="h-12 w-12 rounded-xl object-cover" /><div><div className="text-xl font-extrabold">DEVIGNERS</div><div className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-400">Learning Institute</div></div></div><p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">A practical technology learning institute helping students move from computer fundamentals to full-stack development.</p></div>
      <div><h3 className="font-extrabold">Programs</h3><div className="mt-4 flex flex-col gap-3 text-sm text-slate-400"><Link className="hover:text-white" to="/cube">CUBE — Fundamentals</Link><Link className="hover:text-white" to="/cohort">COHORT — Full-Stack</Link><Link className="hover:text-white" to="/about">About Devigners</Link></div></div>
      <div><h3 className="font-extrabold">Connect</h3><div className="mt-4 space-y-3 text-sm text-slate-400"><p className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-red-400" /> hello@devigners.net</p><p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-red-400" /> Pakistan</p><Link className="inline-flex items-center gap-1 font-bold text-white hover:text-red-400" to="/contact">Contact admissions <ArrowUpRight className="h-4 w-4" /></Link></div></div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© {new Date().getFullYear()} Devigners Learning Institute. All rights reserved.</span><span>Learn with purpose. Build with confidence.</span></div></div>
  </footer>;
}
