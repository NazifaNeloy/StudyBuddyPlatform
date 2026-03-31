import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './dashboard/NotificationCenter';

const Navigation = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'forum', label: 'Neural Chat', path: '/chat' },
    { icon: 'calendar_month', label: 'Calendar', path: '/calendar' },
    { icon: 'group', label: 'Study Circles', path: '/circles' },
    { icon: 'library_books', label: 'Resource Library', path: '/library' },
    { icon: 'document_scanner', label: 'Smart Scanner', path: '/scanner' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* SideNavBar (Desktop Only) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-[#f5eeff] py-8 pr-4 z-50 overflow-y-auto border-r border-black/5">
        <div className="px-6 mb-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-primary font-headline tracking-tighter leading-none">StudyBuddy</h1>
              <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mt-1">The Animated Atheneum</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/30 px-1">Alert Matrix</div>
            <NotificationCenter />
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 py-3 px-6 transition-all group ${
                  isActive 
                    ? 'bg-white text-primary font-black rounded-r-full shadow-sm' 
                    : 'text-[#32294f] opacity-60 hover:opacity-100 hover:translate-x-1'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-headline text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Start Study Session Button */}
        <div className="mt-auto px-4 space-y-6">
          <button 
            onClick={() => navigate('/focus')}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            Start Protocol
          </button>

          <div className="space-y-1">
            <NavLink 
              to="/settings"
              className="flex items-center gap-4 py-2 px-6 text-[#32294f] opacity-60 hover:opacity-100 transition-all group"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Help Center</span>
            </NavLink>
            <button 
              onClick={() => signOut()}
              className="flex w-full items-center gap-4 py-2 px-6 text-error opacity-60 hover:opacity-100 transition-all"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar (SYNERGY) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-lg border-t border-black/5 px-6 flex items-center justify-between z-50 shadow-[0_-8px_20px_rgba(50,41,79,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-primary scale-110' : 'text-gray-400'
              }`
            }
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
