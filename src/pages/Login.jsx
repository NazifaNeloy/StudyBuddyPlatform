import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, User } from 'lucide-react';

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bento-white flex items-center justify-center p-4 selection:bg-brand-purple selection:text-white">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Left Side: Hero Graphic & Value Prop */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center h-full bg-pastel-yellow border-[3px] border-brand-black shadow-brutal squircle p-12 overflow-hidden relative"
        >
          {/* Fun Abstract Shapes */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-brand-purple rounded-full border-2 border-brand-black shadow-brutal animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-10 left-10 w-12 h-12 bg-pastel-pink border-2 border-brand-black transform rotate-12 shadow-brutal animate-pulse" />
          
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
              className="w-full bg-brand-black text-white border-2 border-brand-black rounded-full py-4 px-6 font-heading font-bold text-lg flex items-center justify-center shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#6B4EFE] transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-black/10 flex-1"></div>
            <span className="font-body text-sm font-medium text-brand-black/40">or</span>
            <div className="h-px bg-black/10 flex-1"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button className="w-full bg-bento-white border-2 border-brand-black/10 hover:border-brand-black rounded-full py-3.5 px-6 font-heading font-bold text-base flex items-center justify-center gap-3 transition-all hover:bg-pastel-yellow group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button className="w-full bg-pastel-green border-2 border-brand-black rounded-full py-3.5 px-6 font-heading font-bold text-base flex items-center justify-center gap-3 shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.75 2.1.13 3.58 1.19 4.34 2.54-3.21 1.94-2.68 6.42.54 7.66-.75 1.76-1.63 3.38-3.55 2.72M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/>
              </svg>
              Continue with Apple
            </button>

            <button 
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-bento-white border-2 border-brand-black/10 hover:border-brand-black rounded-full py-3.5 px-6 font-heading font-bold text-base flex items-center justify-center gap-3 transition-all hover:bg-black/5 group"
            >
              <User className="w-5 h-5 text-brand-black group-hover:scale-110 transition-transform" />
              Continue As Guest
            </button>
          </div>

          <div className="mt-8 text-center font-body text-sm text-brand-black/70 font-medium">
            Need an account? {' '}
            <Link to="/signup" className="text-brand-black font-bold hover:text-brand-purple transition-colors">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

