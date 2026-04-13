import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, signOut } = useAuth();
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-8 bg-transparent max-w-7xl mx-auto w-full z-50">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-ref-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-primary font-headline tracking-tighter leading-none">StudyBuddy</h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <Link to="/" className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity">Home</Link>
        <Link to="/how-it-works" className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity">How it works</Link>
        <Link to="/leaderboard" className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity">Leaderboard</Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <button 
              onClick={signOut}
              className="bg-brand-black text-brand-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hidden sm:block text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity border-r border-black/10 pr-4 mr-2">Log in</Link>
            <Link to="/signup" className="bg-brand-black text-brand-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/10">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
