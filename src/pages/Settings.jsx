import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Palette, 
  Bell, 
  Lock, 
  Camera, 
  Check, 
  Plus, 
  Download, 
  Trash2, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { user, refreshProfile } = useAuth();
  const { theme, setTheme: globalSetTheme } = useTheme();
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    major: '',
    interface_mode: 'light',
    accent_color: 'brand-purple',
    notification_settings: {
      study_circle_alerts: true,
      resource_updates: true,
      system_announcements: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: user.email,
          major: data.major || '',
          avatar_url: data.avatar_url || '',
          interface_mode: data.interface_mode || 'light',
          accent_color: data.accent_color || 'brand-purple',
          notification_settings: data.notification_settings || {
            study_circle_alerts: true,
            resource_updates: true,
            system_announcements: false
          }
        });
        
        // Apply theme/accent immediately
        if (data.accent_color) {
           document.documentElement.style.setProperty('--color-brand-purple', getHexColor(data.accent_color));
        }
      }
    } catch (err) {
      console.error('Profile Retrieval Error:', err);
    }
  };

  const getHexColor = (colorName) => {
    const colors = {
      'brand-purple': '#6B4EFE',
      'pink': '#9a189e',
      'red': '#ba1a1a',
      'teal': '#006a6a'
    };
    return colors[colorName] || colors['brand-purple'];
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          major: profile.major,
          interface_mode: profile.interface_mode,
          accent_color: profile.accent_color,
          notification_settings: profile.notification_settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Neural Protocol Updated Successfully!");
    } catch (err) {
      console.error('Update Failure:', err);
      toast.error("Encryption failure. Protocol not saved.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Only image files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading neural asset...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('--- Avatar Materialization Started ---');
      console.log('File:', fileName, 'Path:', filePath);

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      console.log('✓ Storage Upload Successful');

      // 2. Get Public URL
      const { data: { publicUrl: rawUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Add cache buster
      const publicUrl = `${rawUrl}?t=${Date.now()}`;
      console.log('✓ Public URL Generated:', publicUrl);

      // 3. Update Profile Table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      console.log('✓ Database Profile Updated');

      // 4. Update Local State Immediately
      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      // 5. Refresh Context and Finalize
      toast.success("Avatar selection synchronized!", { id: toastId });
      
      console.log('--- Finalizing Global Sync ---');
      if (typeof refreshProfile === 'function') {
        await refreshProfile();
        console.log('✓ Global AuthContext Refreshed');
      }
      
    } catch (err) {
      console.error('Neural Asset Materialization Failed:', err);
      const errorMessage = err.message || "Encryption failure. Connection unstable.";
      toast.error(`Neural Link Failure: ${errorMessage}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-heading font-black italic tracking-tighter text-on-surface mb-2">Settings</h1>
          <p className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-xs opacity-60">Manage your workspace protocols and security layers</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Profile Management Card */}
          <section className="md:col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-ref-xl border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <User size={80} />
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-pastel-purple rounded-2xl flex items-center justify-center text-brand-purple shadow-sm border border-outline-variant/10">
                 <User size={24} />
              </div>
              <h2 className="text-2xl font-heading font-black italic uppercase tracking-tighter text-on-surface">Profile Management</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="relative group shrink-0">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className={`w-40 h-40 rounded-[2.5rem] bg-pastel-blue border-4 border-white shadow-ref-sm overflow-hidden relative ${uploading ? 'opacity-50' : ''}`}>
                  <img 
                    src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-black/20 backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 bg-brand-purple text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95 border-4 border-white disabled:opacity-50"
                >
                  <Camera size={18} />
                </button>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-2 opacity-40">Full Name</label>
                  <input 
                    className="w-full bg-surface-container border border-outline-variant/10 rounded-full px-8 py-5 focus:ring-2 focus:ring-brand-purple/40 text-on-surface font-black italic tracking-tighter text-lg outline-none transition-all" 
                    type="text" 
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-2 opacity-40">Email Address</label>
                  <input 
                    className="w-full bg-surface-container border border-outline-variant/10 rounded-full px-8 py-5 focus:ring-2 focus:ring-brand-purple/40 text-on-surface font-black italic tracking-tighter text-lg outline-none transition-all opacity-40" 
                    type="email" 
                    value={profile.email} 
                    disabled 
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-2 opacity-40">Major / Domain</label>
                  <input 
                    className="w-full bg-surface-container border border-outline-variant/10 rounded-full px-8 py-5 focus:ring-2 focus:ring-brand-purple/40 text-on-surface font-black italic tracking-tighter text-lg outline-none transition-all" 
                    type="text" 
                    value={profile.major}
                    onChange={(e) => setProfile({...profile, major: e.target.value})}
                  />
                </div>
              </div>  </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                onClick={saveProfile}
                disabled={loading}
                className="bg-brand-black text-white font-heading font-black py-4 px-12 rounded-full hover:shadow-xl shadow-brand-black/20 transition-all active:scale-95 italic tracking-tighter text-xl disabled:opacity-50"
              >
                {loading ? "Materializing..." : "Save Protocol Changes"}
              </button>
            </div>
          </section>

          {/* Appearance Card */}
          <section className="md:col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-ref-xl border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-pastel-yellow rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-outline-variant/10">
                  <Palette size={24} />
                </div>
                <h2 className="text-2xl font-heading font-black italic uppercase tracking-tighter">Appearance</h2>
              </div>

              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-on-surface-variant opacity-60">Interface Mode</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => globalSetTheme('light')}
                      className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-4 transition-all ${theme === 'light' ? 'bg-surface border-brand-purple shadow-ref-sm' : 'bg-surface-container-low border-transparent opacity-60'}`}
                    >
                      <Sun className={theme === 'light' ? 'text-brand-purple' : 'text-gray-400'} size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Atheneum</span>
                    </button>
                    <button 
                      onClick={() => globalSetTheme('dark')}
                      className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-4 transition-all ${theme === 'dark' ? 'bg-surface border-brand-purple shadow-ref-sm' : 'bg-surface-container-low border-transparent opacity-60'}`}
                    >
                      <Moon className={theme === 'dark' ? 'text-brand-purple' : 'text-gray-400'} size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Oblivion</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-on-surface-variant opacity-60">Accent Synergy</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { name: 'brand-purple', color: '#6B4EFE' },
                      { name: 'pink', color: '#9a189e' },
                      { name: 'red', color: '#ba1a1a' },
                      { name: 'teal', color: '#006a6a' }
                    ].map((accent) => (
                      <button 
                        key={accent.name}
                        onClick={() => {
                          setProfile({...profile, accent_color: accent.name});
                          document.documentElement.style.setProperty('--color-brand-purple', accent.color);
                        }}
                        style={{ backgroundColor: accent.color }}
                        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${profile.accent_color === accent.name ? 'ring-4 ring-brand-purple/20 ring-offset-4 scale-110' : 'hover:scale-110'}`}
                      >
                        {profile.accent_color === accent.name && <Check className="text-white" size={18} />}
                      </button>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center cursor-not-allowed opacity-40">
                      <Plus className="text-gray-300" size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Status */}
            <div className="bg-brand-black text-white p-10 rounded-[2.5rem] shadow-ref-xl border border-brand-black flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-brand-purple rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-purple/20">
                  <ShieldCheck size={32} />
               </div>
               <h4 className="font-heading font-black italic text-xl uppercase tracking-tighter mb-2">Protocol Shield Active</h4>
               <p className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Encryption: Neural 256-Bit</p>
            </div>
          </section>

          {/* Notifications Card */}
          <section className="md:col-span-12 lg:col-span-6 bg-white p-10 rounded-[2.5rem] shadow-ref-xl border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-pastel-blue rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-outline-variant/10">
                <Bell size={24} />
              </div>
              <h2 className="text-2xl font-heading font-black italic uppercase tracking-tighter">Transmissions</h2>
            </div>

            <div className="space-y-8">
              {Object.entries(profile.notification_settings).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2">
                  <div>
                    <p className="font-heading font-black text-lg italic tracking-tighter uppercase">{key.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Status: {val ? 'Active Signal' : 'Signal Muted'}</p>
                  </div>
                  <div 
                    onClick={() => setProfile({
                      ...profile, 
                      notification_settings: {
                        ...profile.notification_settings,
                        [key]: !val
                      }
                    })}
                    className={`w-16 h-9 rounded-full border border-outline-variant/10 cursor-pointer transition-all p-1.5 relative flex items-center ${val ? 'bg-pastel-green' : 'bg-gray-100'}`}
                  >
                    <motion.div 
                      animate={{ x: val ? 28 : 0 }}
                      className="w-6 h-6 bg-white rounded-full shadow-md" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Card */}
          <section className="md:col-span-12 lg:col-span-6 bg-white p-10 rounded-[2.5rem] shadow-ref-xl border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-pastel-pink rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-outline-variant/10">
                 <Lock size={24} />
              </div>
              <h2 className="text-2xl font-heading font-black italic uppercase tracking-tighter">Security Layers</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 hover:bg-white border border-transparent hover:border-outline-variant/10 transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-outline-variant/10 shadow-sm">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-heading font-black italic text-lg tracking-tighter uppercase">Change Password</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Last sync: 3 months ago</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 border border-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-outline-variant/10 shadow-sm">
                     <ShieldCheck size={18} className="text-brand-purple" />
                  </div>
                  <div>
                    <p className="font-heading font-black italic text-lg tracking-tighter uppercase">Two-Factor Encryption</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-purple font-medium">Recommended Layer</p>
                  </div>
                </div>
                <button className="bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full active:scale-95 transition-all hover:shadow-lg shadow-brand-purple/20">Enable</button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="md:col-span-12 bg-red-50 p-10 rounded-[2.5rem] border border-red-100 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-red-600">
               <AlertTriangle size={100} />
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-200">
                 <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-heading font-black italic uppercase tracking-tighter text-red-600">Danger Zone</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 p-8 bg-surface-container/60 backdrop-blur-sm rounded-[2rem] border border-red-200 group">
                <h3 className="font-heading font-black italic text-xl uppercase tracking-tighter mb-2">Export Data Stream</h3>
                <p className="text-xs font-bold text-gray-400 mb-6 leading-relaxed italic">Download a neural archive of all your study groups, vaults, and transmissions.</p>
                <button className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-widest text-[10px] hover:translate-x-1 transition-transform">
                  <Download size={16} /> Request Archive
                </button>
              </div>
              <div className="flex-1 p-8 bg-surface-container/60 backdrop-blur-sm rounded-[2rem] border border-red-200">
                <h3 className="font-heading font-black italic text-xl uppercase tracking-tighter text-red-600 mb-2">Delete Protocol</h3>
                <p className="text-xs font-bold text-gray-400 mb-6 leading-relaxed italic">Permanently terminate your session and erase all associated artifacts. Irreversible.</p>
                <button className="bg-red-600 text-white font-heading font-black uppercase italic tracking-tighter px-10 py-4 rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20">Purge Forever</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
