import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, signOut } = useAuth();
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 bg-transparent border-b border-gray-100 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110">
          <img src="/src/assets/logo..jpeg" alt="StudyBuddy Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl md:text-2xl font-black font-heading tracking-tight italic">StudyBuddy</span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        {['How it works', 'About', 'Features', 'Leaderboard', 'Groups'].map((item) => {
          let targetPath = '';
          if (item === 'How it works') targetPath = '/how-it-works';
          else if (item === 'Leaderboard') targetPath = '/leaderboard';
          else targetPath = `${isHome ? '' : '/'}#${item.toLowerCase()}`;
          
          return (
            <a key={item} href={targetPath} className="text-sm font-bold hover:text-brand-purple transition-colors">
              {item}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              className="hidden sm:flex items-center gap-2 text-sm font-bold hover:text-brand-purple transition-colors"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <button 
              onClick={signOut}
              className="bg-brand-black text-white px-6 py-2 rounded-full font-black text-sm hover:shadow-brutal transition-all active:scale-95 flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hidden sm:block text-sm font-bold hover:opacity-70">Log in</Link>
            <Link to="/signup" className="bg-brand-purple text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-black text-sm md:text-base hover:shadow-lg hover:shadow-brand-purple/20 transition-all active:scale-95 shadow-brutal inline-block text-center">
              Join for Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
