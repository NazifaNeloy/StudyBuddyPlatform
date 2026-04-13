import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, UserPlus, Loader2, User, ChevronRight, ChevronLeft, Target, Cpu, Hash, BrainCircuit, X, Plus } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import { authActions } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { user, isAuthReady } = useAuth();
  const [step, setStep] = useState(1);
  const SUGGESTED_SKILLS = [
    'Python', 'React', 'Java', 'C++', 'SQL', 'UI/UX Design', 'Figma', 
    'Writing', 'Public Speaking', 'Time Management', 'Note-taking'
  ];

  const SUGGESTED_INTERESTS = [
    'Artificial Intelligence', 'Machine Learning', 'Physics', 'Calculus', 
    'Statistics', 'Psychology', 'Sociology', 'Economics', 'Marketing', 
    'Biology', 'Chemistry'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    skills: [], 
    batch: '',
    interests: [], 
  });
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (isAuthReady && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isAuthReady, navigate]);

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError('Required identifiers missing from baseline protocol.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const prevStep = () => {
    setError(null);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Arrays are already handled in the state
    const skillsArray = formData.skills;
    const interestsArray = formData.interests;

    try {
      const { error: signUpError } = await authActions.signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
          gender: formData.gender,
          skills: skillsArray,
          batch: formData.batch,
          interests: interestsArray
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

  const stepVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col selection:bg-brand-purple selection:text-white">
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
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand-purple selection:text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="w-full max-w-md mx-auto order-2 lg:order-1"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-black text-brand-black tracking-tight">Access Protocol</h1>
              <div className="flex justify-center gap-2 mt-4">
                <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 1 ? 'bg-brand-purple' : 'bg-brand-purple/20'}`} />
                <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 2 ? 'bg-brand-purple' : 'bg-brand-purple/20'}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait" custom={step}>
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    custom={step}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full Name"
                        className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email Address"
                        className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/50 w-5 h-5 transition-colors group-focus-within:text-brand-purple" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-12 pr-4 font-body text-base font-medium text-brand-black focus:ring-0 focus:border-brand-purple focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all"
                        required
                      />
                    </div>

                    <button 
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-brand-black text-white rounded-full py-5 px-8 font-heading font-black text-xl italic tracking-tighter flex items-center justify-center shadow-lg hover:scale-[1.02] transition-all mt-4"
                    >
                      Next Step <ChevronRight size={24} className="ml-2" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    custom={step}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="bg-white border-2 border-black/10 rounded-2xl py-3.5 px-4 font-body text-sm font-bold text-brand-black focus:border-brand-purple outline-none"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Non-Binary</option>
                        <option value="Hidden">Private</option>
                      </select>

                      <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30 w-4 h-4" />
                        <input 
                          type="text" 
                          value={formData.batch}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          placeholder="Batch (e.g. 2025)"
                          className="w-full bg-white border-2 border-black/10 rounded-2xl py-3.5 pl-10 pr-4 font-body text-sm font-bold text-brand-black focus:border-brand-purple outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Skills Selector */}
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 mb-3 px-1">
                          <Cpu size={14} /> Cognitive Arsenal (Skills)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.skills.map(skill => (
                            <motion.span 
                              key={skill}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-brand-purple text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm border border-brand-purple/20"
                            >
                              {skill}
                              <X 
                                size={14} 
                                className="cursor-pointer hover:text-red-200 transition-colors" 
                                onClick={() => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })}
                              />
                            </motion.span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/50 border-2 border-dashed border-black/5">
                          {SUGGESTED_SKILLS.filter(s => !formData.skills.includes(s)).map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => setFormData({ ...formData, skills: [...formData.skills, skill] })}
                              className="px-3 py-1.5 rounded-xl border border-black/5 bg-white text-[10px] font-bold text-brand-black/60 hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5 transition-all flex items-center gap-1"
                            >
                              <Plus size={10} /> {skill}
                            </button>
                          ))}
                          <div className="relative flex-1 min-w-[120px]">
                            <input 
                              type="text"
                              value={customSkill}
                              onChange={(e) => setCustomSkill(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && customSkill.trim()) {
                                  e.preventDefault();
                                  if (!formData.skills.includes(customSkill.trim())) {
                                    setFormData({ ...formData, skills: [...formData.skills, customSkill.trim()] });
                                  }
                                  setCustomSkill('');
                                }
                              }}
                              placeholder="Custom Skill + Enter"
                              className="w-full bg-transparent border-none placeholder:text-[10px] text-[10px] font-bold p-1.5 outline-none focus:ring-0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interests Selector */}
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 mb-3 px-1">
                          <BrainCircuit size={14} /> Academic Focus (Interests)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.interests.map(interest => (
                            <motion.span 
                              key={interest}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-pastel-pink text-brand-black px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm border border-black/5"
                            >
                              {interest}
                              <X 
                                size={14} 
                                className="cursor-pointer hover:text-brand-purple transition-colors" 
                                onClick={() => setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) })}
                              />
                            </motion.span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/50 border-2 border-dashed border-black/5">
                          {SUGGESTED_INTERESTS.filter(i => !formData.interests.includes(i)).map(interest => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => setFormData({ ...formData, interests: [...formData.interests, interest] })}
                              className="px-3 py-1.5 rounded-xl border border-black/5 bg-white text-[10px] font-bold text-brand-black/60 hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5 transition-all flex items-center gap-1"
                            >
                              <Plus size={10} /> {interest}
                            </button>
                          ))}
                          <div className="relative flex-1 min-w-[140px]">
                            <input 
                              type="text"
                              value={customInterest}
                              onChange={(e) => setCustomInterest(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && customInterest.trim()) {
                                  e.preventDefault();
                                  if (!formData.interests.includes(customInterest.trim())) {
                                    setFormData({ ...formData, interests: [...formData.interests, customInterest.trim()] });
                                  }
                                  setCustomInterest('');
                                }
                              }}
                              placeholder="Custom Interest + Enter"
                              className="w-full bg-transparent border-none placeholder:text-[10px] text-[10px] font-bold p-1.5 outline-none focus:ring-0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-white border-2 border-black/10 text-brand-black rounded-full py-5 px-8 font-heading font-black text-xl italic tracking-tighter flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
                      >
                        <ChevronLeft size={24} className="mr-2" /> Back
                      </button>
                      
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-[2] bg-brand-purple text-white border border-brand-purple rounded-full py-5 px-8 font-heading font-black text-xl italic tracking-tighter flex items-center justify-center shadow-lg hover:shadow-brand-purple/40 hover:scale-[1.02] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-6 h-6 mr-3" /> Initialize
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
            </form>

            <div className="mt-8 text-center font-body text-sm text-brand-black/70 font-medium">
              Already have an account? {' '}
              <Link to="/login" className="text-brand-black font-bold hover:text-brand-purple transition-colors">
                Log in
              </Link>
            </div>
          </motion.div>

          {/* Right Side Overlay Logic */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-center h-full bg-pastel-green border border-black/5 shadow-ref-xl rounded-[2.5rem] p-12 overflow-hidden relative order-1 lg:order-2"
          >
            <div className="absolute top-12 left-12 w-16 h-16 bg-pastel-pink rounded-full border border-white/40 shadow-xl animate-bounce" style={{ animationDuration: '3.5s' }} />
            <div className="absolute bottom-16 right-16 w-14 h-14 bg-brand-purple border border-white/40 transform -rotate-12 shadow-xl animate-pulse" />
            
            <div className="text-center z-10 w-full mb-8">
              <h2 className="text-4xl font-heading font-black text-brand-black tracking-tight uppercase italic">{step === 1 ? 'Join Community' : 'Neural Profile'}</h2>
              <p className="font-body text-lg font-medium text-brand-black/80 max-w-sm mx-auto mt-3 italic uppercase opacity-60 text-[12px] tracking-widest">
                {step === 1 ? 'Connect, collaborate, and conquer your courses together.' : 'Customizing your cognitive node parameters for better matches.'}
              </p>
            </div>

            <div className="relative w-full max-w-xs h-64 mt-4">
              <motion.div 
                animate={{ y: [0, -10, 0], scale: step === 1 ? 1 : 1.1 }}
                className="absolute top-0 right-4 w-48 h-32 bg-white border border-black/5 rounded-[1.5rem] shadow-ref-xl p-6 transform rotate-6 z-10"
              >
                <div className={`w-10 h-10 ${step === 1 ? 'bg-brand-purple' : 'bg-pastel-pink'} rounded-xl mb-3 shadow-sm transition-colors`}></div>
                <div className="h-2 w-24 bg-black/5 rounded-full mb-2"></div>
                <div className="h-2 w-16 bg-black/5 rounded-full"></div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0], scale: step === 2 ? 1.05 : 1 }}
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
                 {step === 2 && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="mt-2 text-[8px] font-black uppercase tracking-widest text-primary"
                   >
                     Protocol Optimized
                   </motion.div>
                 )}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
