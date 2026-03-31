import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, UserPlus, Loader2, User } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import { authActions } from '../lib/supabase';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await authActions.signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
        }
      );

      if (signUpError) throw signUpError;

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Signup Transmission Error:', err.message);
      setError(err.message || 'Synchronization failed. Please check your data link.');
    } finally {
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="min-h-screen bg-bento-white flex flex-col selection:bg-brand-purple selection:text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-pastel-green border border-black/5 p-12 rounded-[2.5rem] shadow-ref-xl text-center"
          >
            <div className="bg-white border border-black/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-md">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-3xl font-heading font-black mb-4">Welcome Aboard!</h2>
            <p className="font-body text-brand-black/80 font-medium mb-8 leading-relaxed">
              Your study journey starts now. Please check your email to verify your account.
            </p>
            <div className="h-2 w-full bg-white/40 border border-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="h-full bg-brand-purple"
              />
            </div>
            <p className="text-sm font-bold mt-4">Redirecting you to login...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bento-white flex flex-col selection:bg-brand-purple selection:text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side: Signup Form */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="w-full max-w-md mx-auto order-2 lg:order-1"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-black text-brand-black tracking-tight">Create Account</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all placeholder:text-brand-black/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all placeholder:text-brand-black/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all placeholder:text-brand-black/40"
                    required
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border-2 border-red-500 rounded-2xl p-3 text-red-600 font-bold text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-purple text-white border border-brand-purple rounded-full py-5 px-8 font-heading font-black text-xl italic tracking-tighter flex items-center justify-center shadow-lg hover:shadow-brand-purple/40 hover:scale-[1.02] transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-6 h-6 mr-3" /> Initialize Protocol
                  </>
                )}
              </button>
            </form>



            <div className="mt-8 text-center font-body text-sm text-brand-black/70 font-medium">
              Already have an account? {' '}
              <Link to="/login" className="text-brand-black font-bold hover:text-brand-purple transition-colors">
                Log in
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Graphic/Value Prop */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-center h-full bg-pastel-green border border-black/5 shadow-ref-xl rounded-[2.5rem] p-12 overflow-hidden relative order-1 lg:order-2"
          >
            {/* Fun Abstract Shapes */}
            <div className="absolute top-12 left-12 w-16 h-16 bg-pastel-pink rounded-full border border-white/40 shadow-xl animate-bounce" style={{ animationDuration: '3.5s' }} />
            <div className="absolute bottom-16 right-16 w-14 h-14 bg-brand-purple border border-white/40 transform -rotate-12 shadow-xl animate-pulse" />
            
            <div className="text-center z-10 w-full mb-8">
              <h2 className="text-4xl font-heading font-black text-brand-black tracking-tight">Join The Community</h2>
              <p className="font-body text-lg font-medium text-brand-black/80 max-w-sm mx-auto mt-3">
                Connect, collaborate, and conquer your courses together.
              </p>
            </div>

            {/* Simulated profile stacked cards to look impressive */}
            <div className="relative w-full max-w-xs h-64 mt-4">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-0 right-4 w-48 h-32 bg-white border border-black/5 rounded-[1.5rem] shadow-ref-xl p-6 transform rotate-6 z-10"
              >
                <div className="w-10 h-10 bg-brand-purple rounded-xl mb-3 shadow-sm"></div>
                <div className="h-2 w-24 bg-black/5 rounded-full mb-2"></div>
                <div className="h-2 w-16 bg-black/5 rounded-full"></div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 left-0 w-52 h-40 bg-pastel-yellow border border-black/5 rounded-[1.5rem] shadow-ref-xl p-6 transform -rotate-3 z-20"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-pastel-pink border border-white/40 rounded-full flex items-center justify-center font-black shadow-sm">JD</div>
                    <div>
                      <div className="h-2 w-20 bg-brand-black rounded-full mb-1.5 opacity-20"></div>
                      <div className="h-2 w-12 bg-black/10 rounded-full"></div>
                    </div>
                 </div>
                 <div className="h-6 w-full bg-white/40 rounded-lg border border-black/5 shadow-sm"></div>
              </motion.div>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
