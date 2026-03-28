import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Timer, 
  Library, 
  ScanLine, 
  LogOut, 
  User as UserIcon,
  CircleStop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Orb', path: '/' },
    { icon: Users, label: 'Circles', path: '/circles' },
    { icon: Timer, label: 'Focus', path: '/focus' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: ScanLine, label: 'Scanner', path: '/scanner' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen bg-[#0c0c0e] border-r border-white/10 p-6 sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2 lg:px-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 animate-pulse shadow-lg shadow-purple-500/20" />
          <h1 className="text-xl font-bold tracking-tight italic">StudyBuddy</h1>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <button 
          onClick={() => signOut()}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Disconnect</span>
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 glass px-6 flex items-center justify-between z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`
            }
          >
            <item.icon className={`w-6 h-6 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`} />
            <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
