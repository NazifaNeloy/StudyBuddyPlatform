import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const { signOut, user } = useAuth();
  const { theme, setTheme } = useTheme();
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
      <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-surface-container py-8 pr-4 z-50 overflow-y-auto border-r border-outline-variant/10">
        <div className="px-6 mb-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-ref-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-primary font-headline tracking-tighter leading-none">StudyBuddy</h1>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface opacity-30 px-1">Alert Matrix</div>
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
                    ? 'bg-background text-primary font-black rounded-r-full shadow-sm border-y border-r border-outline-variant/10' 
                    : 'text-on-surface opacity-60 hover:opacity-100 hover:translate-x-1'
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
          <div className="bg-surface-container-high rounded-2xl p-4 flex items-center justify-between border border-outline-variant/10">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Mode</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface leading-none mt-1">
                {theme === 'dark' ? 'Oblivion' : theme === 'light' ? 'Atheneum' : 'Neural Auto'}
              </span>
            </div>
            <div className="flex gap-1">
              {[
                { id: 'light', icon: 'light_mode' },
                { id: 'dark', icon: 'dark_mode' },
                { id: 'auto', icon: 'brightness_6' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    theme === t.id ? 'bg-primary text-white shadow-sm' : 'text-on-surface opacity-30 hover:opacity-100 hover:bg-surface-container-highest'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{t.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigate('/focus')}
            className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm shadow-sticker-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-brand-black"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            Start Protocol
          </button>

          <div className="space-y-1">
            <NavLink 
              to="/settings"
              className="flex items-center gap-4 py-2 px-6 text-on-surface opacity-60 hover:opacity-100 transition-all group"
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
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/10 px-6 flex items-center justify-between z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-primary scale-110' : 'text-on-surface opacity-40'
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
