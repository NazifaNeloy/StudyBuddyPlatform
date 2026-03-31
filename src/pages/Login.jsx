import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, User } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

import { authActions } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await authActions.signIn(email, password);

      if (signInError) throw signInError;
      
      if (data?.session) {
        navigate('/dashboard');
      } else {
        // If no session but no error, it might be an email confirmation pending or a hang
        throw new Error('Synchronization incomplete. Please verify your credentials or check your email.');
      }
    } catch (err) {
      console.error('Login Authorization Failure:', err.message);
      setError(err.message || 'Authentication error. Please check your link.');
    } finally {
      if (loading) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bento-white flex flex-col selection:bg-brand-purple selection:text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side: Hero Graphic & Value Prop */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center h-full bg-pastel-yellow border border-black/5 shadow-ref-xl rounded-[2.5rem] p-12 overflow-hidden relative"
        >
          {/* Fun Abstract Shapes */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-brand-purple rounded-full border border-white/40 shadow-xl animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-10 left-10 w-12 h-12 bg-pastel-pink border border-white/40 transform rotate-12 shadow-xl animate-pulse" />
          
          <motion.img 
            initial={{ y: 20 }}
            animate={{ y: -20 }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
            src="/login-illustration.png" 
            alt="Study Buddy Illustration" 
            className="w-full max-w-sm drop-shadow-2xl z-10"
          />
          <div className="text-center z-10 mt-8 space-y-3">
            <h2 className="text-4xl font-heading font-black text-brand-black tracking-tight">Focus Like Never Before</h2>
            <p className="font-body text-lg font-medium text-brand-black/80 max-w-sm mx-auto">
              Jump back into your interactive study circles and boost your productivity.
            </p>
            {/* Progress/Decorative Dashes mimicking the left image */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="h-1.5 w-12 bg-brand-purple rounded-full"></div>
              <div className="h-1.5 w-12 bg-pastel-green rounded-full"></div>
              <div className="h-1.5 w-12 bg-black/10 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-black text-brand-black tracking-tight">Login</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all placeholder:text-brand-black/40"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <span className="text-sm font-body font-semibold text-brand-black/60 hover:text-brand-purple cursor-pointer transition-colors underline underline-offset-4 decoration-2">
                Forgot Password?
              </span>
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
              className="w-full bg-brand-black text-white border border-brand-black rounded-full py-4 px-6 font-heading font-black text-xl italic tracking-tighter flex items-center justify-center shadow-lg hover:shadow-brand-purple/20 hover:scale-[1.02] transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Login Protocol'
              )}
            </button>
          </form>



          <div className="mt-8 text-center font-body text-sm text-brand-black/70 font-medium">
            Need an account? {' '}
            <Link to="/signup" className="text-brand-black font-bold hover:text-brand-purple transition-colors">
              Sign up
            </Link>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;

