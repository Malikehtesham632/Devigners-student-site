import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import Home from '@/pages/Home';
import Cube from '@/pages/Cube';
import Cohort from '@/pages/Cohort';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

export default function App() {
  return <BrowserRouter><div className="min-h-screen bg-white text-slate-900"><Navbar /><main><Routes><Route path="/" element={<Home />} /><Route path="/cube" element={<Cube />} /><Route path="/cohort" element={<Cohort />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><ChatWidget /></div></BrowserRouter>;
}
