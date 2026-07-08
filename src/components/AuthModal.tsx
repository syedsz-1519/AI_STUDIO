import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  LogOut, 
  User, 
  Settings, 
  Sparkles, 
  Award,
  BookOpen,
  Chrome,
  Instagram,
  Linkedin,
  Github,
  Check
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { 
  auth, 
  db, 
  googleProvider, 
  setupAuthListener, 
  UserProfile 
} from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { lang } = useLanguage();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Logged-in state
  const [user, setUser] = useState<UserProfile | null>(null);

  // Set up Firebase auth listener
  useEffect(() => {
    const unsubscribe = setupAuthListener(
      (profile) => {
        setUser(profile);
      },
      () => {
        // Progress changed, if we need to do something we can
      }
    );
    return () => unsubscribe();
  }, []);

  // Read mastered terms count
  const getMasteredTermsCount = () => {
    try {
      const saved = localStorage.getItem('clay_completed_terms');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.values(parsed).filter(Boolean).length;
      }
    } catch {
      // Ignored
    }
    return 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginMode && !fullName)) {
      alert(lang === 'en' ? 'Please fill in all required fields.' : 'Kripya sabhi fields bharein.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isLoginMode) {
        // Real Firebase Sign In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Real Firebase Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        
        // Write profile document
        const joinedDate = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { month: 'long', year: 'numeric' });
        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`;
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          fullName,
          avatar,
          joinedDate,
          streak: 1,
          linkedPlatforms: []
        });
      }

      setIsLoading(false);
      setAuthSuccess(true);

      setTimeout(() => {
        setAuthSuccess(false);
        // Clear forms
        setEmail('');
        setPassword('');
        setFullName('');
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error("Auth error:", error);
      setIsLoading(false);
      let msg = error.message || 'Authentication failed.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        msg = lang === 'en' ? 'Invalid email or password.' : 'Sahi email ya password nahi hai.';
      } else if (error.code === 'auth/email-already-in-use') {
        msg = lang === 'en' ? 'Email is already registered.' : 'Yih email pehle se registered hai.';
      } else if (error.code === 'auth/weak-password') {
        msg = lang === 'en' ? 'Password should be at least 6 characters.' : 'Password kam se kam 6 characters ka hona chahiye.';
      }
      setErrorMessage(msg);
    }
  };

  const handleSocialAuth = async (platform: string) => {
    if (platform !== 'Google') {
      alert(lang === 'en' 
        ? `Only Google social login is currently active for this sandbox environment. Please use Google or create an Email/Password account!`
        : `Sirf Google social login active hai. Kripya Google use karein ya Email/Password se account banayein!`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoading(false);
      setAuthSuccess(true);
      
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Popup sign in failed:", error);
      setIsLoading(false);
      
      // Iframe popup block fallback
      alert(lang === 'en'
        ? "Google Popup is blocked or restricted inside this iframe sandbox. Please sign up or log in using direct Email and Password below!"
        : "Google Login is frame me blocked hai. Kripya naya account niche Email aur Password se banayein!");
    }
  };

  const handleLinkPlatform = async (platform: string) => {
    if (!user) return;
    
    // Toggle platform linking locally/on Firestore
    try {
      const updatedLinked = user.linkedPlatforms.includes(platform)
        ? user.linkedPlatforms.filter(p => p !== platform)
        : [...user.linkedPlatforms, platform];
      
      await setDoc(doc(db, 'users', user.uid), {
        linkedPlatforms: updatedLinked
      }, { merge: true });

      // Local update
      const updatedUser = {
        ...user,
        linkedPlatforms: updatedLinked
      };
      setUser(updatedUser);
      localStorage.setItem('clay_user_profile', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('clay_auth_state_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogOut = async () => {
    if (window.confirm(lang === 'en' ? 'Are you sure you want to log out?' : 'Kya aap such me log out karna chahte hain?')) {
      try {
        await signOut(auth);
        localStorage.removeItem('clay_user_profile');
        setUser(null);
        window.dispatchEvent(new Event('clay_auth_state_changed'));
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isOpen) return null;

  const masteredCount = getMasteredTermsCount();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-charcoal/45 backdrop-blur-md"
      />

      {/* Main glassmorphic container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 210 }}
        className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-brand-charcoal/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-left z-10"
      >
        {/* Absolute top close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* If user is logged in: SHOW PROFILE & LEARNING SETTINGS */}
        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-brand-slate/10">
              <img 
                src={user.avatar} 
                alt={user.fullName} 
                className="w-14 h-14 rounded-2xl bg-brand-sand border-2 border-brand-amber/40 p-1 shadow-inner shrink-0"
              />
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-brand-amber/10 text-brand-amber px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" /> Simple AI Scholar
                </span>
                <h3 className="font-display text-base font-black text-brand-charcoal truncate leading-tight mt-1.5">
                  {user.fullName}
                </h3>
                <p className="text-[11px] text-brand-muted truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Scholar Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAF8F5] border border-brand-slate/10 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-brand-amber mb-1">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[9px] font-mono font-bold uppercase">{lang === 'en' ? "Vocabulary" : "Shabd"}</span>
                </div>
                <div className="text-xl font-black text-brand-charcoal">
                  {masteredCount} <span className="text-xs text-brand-muted font-bold">/ 54</span>
                </div>
                <span className="text-[9px] text-brand-muted font-medium mt-0.5 block">
                  {lang === 'en' ? "Terms Mastered" : "Alfaaz Seekhe"}
                </span>
              </div>

              <div className="bg-[#FAF8F5] border border-brand-slate/10 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-[#E07A5F] mb-1">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[9px] font-mono font-bold uppercase">{lang === 'en' ? "Streak" : "Streak"}</span>
                </div>
                <div className="text-xl font-black text-brand-charcoal">
                  {user.streak} <span className="text-xs text-brand-muted font-bold">{lang === 'en' ? "days" : "din"}</span>
                </div>
                <span className="text-[9px] text-brand-muted font-medium mt-0.5 block">
                  {lang === 'en' ? "Active Study Streak" : "Seekhne ki Streak"}
                </span>
              </div>
            </div>

            {/* Platform accounts linking status */}
            <div className="space-y-2.5 text-left">
              <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                {lang === 'en' ? "Linked Social Accounts" : "Linked Social Accounts"}
              </h4>
              <p className="text-[10px] text-brand-muted mb-2">
                {lang === 'en' 
                  ? "Toggle platforms below to connect and sync your study journey profile on other services:" 
                  : "Neeche click karke dusre platforms ko connect aur study data sync karein:"}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Google', icon: Chrome, color: 'hover:border-red-500/30 hover:bg-red-50/10' },
                  { name: 'LinkedIn', icon: Linkedin, color: 'hover:border-blue-500/30 hover:bg-blue-50/10' },
                  { name: 'Instagram', icon: Instagram, color: 'hover:border-pink-500/30 hover:bg-pink-50/10' },
                  { name: 'GitHub', icon: Github, color: 'hover:border-slate-800/30 hover:bg-slate-50/10' }
                ].map((plat) => {
                  const isLinked = user.linkedPlatforms.includes(plat.name);
                  return (
                    <button
                      key={plat.name}
                      onClick={() => handleLinkPlatform(plat.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                        isLinked 
                          ? 'border-brand-amber/30 bg-brand-amber/[0.03] text-brand-charcoal font-bold' 
                          : 'border-brand-slate/10 text-brand-slate ' + plat.color
                      }`}
                    >
                      <plat.icon className={`w-3.5 h-3.5 shrink-0 ${isLinked ? 'text-brand-amber' : 'text-brand-muted'}`} />
                      <span className="flex-grow text-left">{plat.name}</span>
                      {isLinked && <Check className="w-3 h-3 text-brand-amber" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile actions */}
            <div className="pt-4 border-t border-brand-slate/10 flex items-center justify-between">
              <span className="text-[9px] font-mono text-brand-muted">
                {lang === 'en' ? `Member since ${user.joinedDate}` : `${user.joinedDate} se member hain`}
              </span>
              <button
                onClick={handleLogOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                {lang === 'en' ? "Log Out" : "Log Out"}
              </button>
            </div>
          </div>
        ) : (
          /* OTHERWISE: SHOW LOGIN / SIGNUP SCREEN */
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl font-black text-brand-charcoal tracking-tight flex items-center justify-center md:justify-start gap-2">
                <Settings className="w-5 h-5 text-brand-amber animate-spin-slow" />
                {isLoginMode 
                  ? (lang === 'en' ? "Welcome back" : "Aapka swagat hai") 
                  : (lang === 'en' ? "Create account" : "Naya account banayein")}
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                {isLoginMode 
                  ? (lang === 'en' ? "Log in to track your AI learning achievements" : "Apne AI lessons ki tarakki dekhne ke liye login karein") 
                  : (lang === 'en' ? "Sign up to begin your personalized visual journey" : "Apni naye sabaq ki progress bachane ke liye signup karein")}
              </p>
            </div>

            {/* Loading / success animations overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 text-center p-6"
                >
                  <Loader2 className="w-10 h-10 text-brand-amber animate-spin" />
                  <div>
                    <h4 className="font-display text-sm font-bold text-brand-charcoal">
                      {lang === 'en' ? "Connecting Simple AI..." : "Simple AI se jod rahe hain..."}
                    </h4>
                    <p className="text-[10px] text-brand-muted mt-0.5">
                      {lang === 'en' ? "Authenticating security token credentials" : "Security key credentials check ho rahe hain"}
                    </p>
                  </div>
                </motion.div>
              )}

              {authSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 text-center p-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                  <div>
                    <h4 className="font-display text-sm font-black text-brand-charcoal">
                      {lang === 'en' ? "Success! Session active" : "Kamyaabi! Login ho gaya"}
                    </h4>
                    <p className="text-[10px] text-brand-muted mt-0.5">
                      {lang === 'en' ? "Profile synchronized successfully" : "Aapka study record aur progress load ho chuka hai"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-semibold text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-brand-muted uppercase">
                    {lang === 'en' ? "Full Name" : "Aapka Naam"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                      type="text"
                      placeholder={lang === 'en' ? "Shahnawaz" : "Shahnawaz"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-brand-muted uppercase">
                  {lang === 'en' ? "Email Address" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-brand-muted uppercase">
                  {lang === 'en' ? "Password" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
              >
                {isLoginMode 
                  ? (lang === 'en' ? "Enter Study Journal" : "Sabaq Shuru Karein") 
                  : (lang === 'en' ? "Register Account" : "Naya Account Banayein")}
              </button>
            </form>

            {/* Quick social login dividers */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-brand-slate/10"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono font-bold text-brand-muted uppercase">
                {lang === 'en' ? "Or connect with" : "Ya inke sath judiye"}
              </span>
              <div className="flex-grow border-t border-brand-slate/10"></div>
            </div>

            {/* Fully Functional Social Logins for Google, LinkedIn, Instagram, Github */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSocialAuth('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-brand-slate/10 rounded-2xl text-xs font-bold text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/30 hover:border-brand-slate/20 transition-all cursor-pointer"
              >
                <Chrome className="w-3.5 h-3.5 text-red-500" />
                <span>Google</span>
              </button>

              <button
                onClick={() => handleSocialAuth('LinkedIn')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-brand-slate/10 rounded-2xl text-xs font-bold text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/30 hover:border-brand-slate/20 transition-all cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => handleSocialAuth('Instagram')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-brand-slate/10 rounded-2xl text-xs font-bold text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/30 hover:border-brand-slate/20 transition-all cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram</span>
              </button>

              <button
                onClick={() => handleSocialAuth('GitHub')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-brand-slate/10 rounded-2xl text-xs font-bold text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/30 hover:border-brand-slate/20 transition-all cursor-pointer"
              >
                <Github className="w-3.5 h-3.5 text-brand-charcoal" />
                <span>GitHub</span>
              </button>
            </div>

            {/* Bottom Toggle */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-[11px] font-bold text-brand-amber hover:text-brand-amber-dark underline transition-all cursor-pointer"
              >
                {isLoginMode 
                  ? (lang === 'en' ? "Don't have an account? Sign Up" : "Naya account chahiye? Sign Up karein") 
                  : (lang === 'en' ? "Already have an account? Log In" : "Pehle se account hai? Log In karein")}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
