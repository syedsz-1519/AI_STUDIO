import { useState, useEffect } from 'react';
import { Compass, BookOpen, ArrowUp, Menu, X, Music, Volume2, VolumeX, Sparkles, Settings, Search } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { roadmapSections } from '../data/roadmapTerms';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';

export default function FloatingNav() {
  const { lang, t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [readingTime, setReadingTime] = useState(6); // Default fallback
  const [wordCount, setWordCount] = useState(1200); // Default fallback
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleGlobalSearchKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalSearchKey);
    return () => window.removeEventListener('keydown', handleGlobalSearchKey);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('clay_user_profile');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('clay_auth_state_changed', checkUser);
    return () => window.removeEventListener('clay_auth_state_changed', checkUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }

      // Track both main sections and the 12 glossary sub-sections
      const mainSections = ['hero', 'what-is-ai', 'family-tree', 'prompting-rag', 'ai-tools-directory', 'deeper'];
      const glossarySections = ['section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6', 'section-7', 'section-8', 'section-9', 'section-10', 'section-11', 'section-12'];

      let detectedActiveSection = 'hero';
      let detectedHash = '';

      // Check main sections first
      for (const sectionId of mainSections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            detectedActiveSection = sectionId;
            detectedHash = sectionId === 'hero' ? '' : sectionId;
            break;
          }
        }
      }

      // If active section is deeper, check if we are scrolling through any of the 12 glossary sections
      if (detectedActiveSection === 'deeper') {
        for (const secId of glossarySections) {
          const el = document.getElementById(secId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 250 && rect.bottom >= 250) {
              detectedHash = secId;
              break;
            }
          }
        }
      }

      setActiveSection(detectedActiveSection);

      // Silently sync URL hash with the current viewport location (without jump-triggering)
      const currentHash = window.location.hash;
      const expectedHash = detectedHash ? `#${detectedHash}` : '';
      if (currentHash !== expectedHash) {
        window.history.replaceState(null, '', expectedHash || window.location.pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAmbient = () => {
    if (isAmbientOn) {
      audioEngine.stopAmbientLooper();
      setIsAmbientOn(false);
    } else {
      audioEngine.startAmbientLooper();
      setIsAmbientOn(true);
    }
  };

  useEffect(() => {
    const calculateWordCount = () => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        const text = mainEl.innerText || mainEl.textContent || '';
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        if (words > 100) {
          setWordCount(words);
          // Assume average reading speed of 200 words per minute
          setReadingTime(Math.ceil(words / 200));
        }
      }
    };

    // Calculate word count immediately on mount
    calculateWordCount();

    // Re-run after a 500ms delay to capture complete component rendering
    const timer = setTimeout(calculateWordCount, 500);

    // Watch for dynamic DOM changes inside <main> to keep word count perfectly precise
    const mainEl = document.querySelector('main');
    let observer: MutationObserver | null = null;
    if (mainEl) {
      observer = new MutationObserver(() => {
        calculateWordCount();
      });
      observer.observe(mainEl, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Update hash in URL
      const newHash = id === 'hero' ? '' : `#${id}`;
      window.history.pushState(null, '', newHash || window.location.pathname);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      {/* Dynamic Progress Bar */}
      <motion.div 
        className="absolute top-0 left-0 h-[4px] bg-brand-amber origin-left shadow-[0_2px_8px_rgba(217,119,6,0.6)]" 
        initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
        animate={{ 
          scaleX: scrollProgress / 100,
          scaleY: scrollProgress > 0 ? 1 : 0,
          opacity: scrollProgress > 0 ? 1 : 0
        }}
        transition={{ 
          scaleX: { 
            type: "spring", 
            stiffness: 140, 
            damping: 18, 
            mass: 0.5 
          },
          scaleY: { 
            type: "spring", 
            stiffness: 240, 
            damping: 12, 
            mass: 0.4
          },
          opacity: { 
            type: "spring", 
            stiffness: 120, 
            damping: 15 
          }
        }}
        style={{ width: '100%' }}
      />

      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Name & Reading Badge Container */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 cursor-pointer font-display text-base sm:text-lg font-extrabold text-brand-charcoal hover:text-brand-amber transition-colors shrink-0"
          >
            {/* Cute AI Bot Logo matching the user image */}
            <ClayLogo size={32} />
            <span className="tracking-tight">Simple <span className="text-brand-amber font-extrabold">AI</span></span>
          </button>

          {/* Small Glassmorphic Reading Time Badge with interactive details */}
          <div 
            className="group relative glass-panel px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-brand-amber border border-brand-amber/30 hidden min-[400px]:flex items-center gap-1.5 shadow-sm shrink-0 cursor-help transition-all duration-300 hover:border-brand-amber/60 hover:bg-white/60"
            title={`${wordCount.toLocaleString()} words on page`}
          >
            <BookOpen className="w-3 h-3 text-brand-amber shrink-0 group-hover:scale-110 transition-transform" />
            <span className="tracking-tight">{readingTime} min read</span>
            
            {/* Elegant glassmorphic tooltip on hover to display actual word count */}
            <span className="absolute top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#FDFBF7]/95 border border-brand-amber/20 text-brand-charcoal text-[9px] sm:text-[10px] px-2.5 py-1 rounded-lg shadow-md pointer-events-none transition-all duration-200 origin-top whitespace-nowrap z-50">
              <span className="font-mono text-brand-amber font-extrabold">{wordCount.toLocaleString()}</span> words
            </span>
          </div>
        </div>



        {/* Subtle Ambient Sound Toggle & Settings & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          {/* Glassmorphic Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/70 hover:bg-brand-amber/10 hover:text-brand-amber text-brand-slate border border-brand-slate/10 hover:border-brand-amber/20 rounded-full text-xs font-bold transition-all cursor-pointer select-none shadow-sm hover:shadow-md active:scale-95 group"
            title={lang === 'en' ? 'Search 12 Sections & Glossary (Cmd+K)' : 'Sabaq aur Glossary dhoondo (Cmd+K)'}
          >
            <Search className="w-3.5 h-3.5 text-brand-slate group-hover:text-brand-amber transition-colors" />
            <span className="hidden sm:inline text-[11px] font-bold">{lang === 'en' ? 'Search' : 'Dhoondo'}</span>
            <span className="hidden lg:inline text-[9px] font-mono opacity-40">⌘K</span>
          </button>

          {/* Ambient Sound Button */}
          <button
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none ${isAmbientOn ? 'bg-brand-amber/15 text-brand-amber border-brand-amber/30 shadow-[0_0_12px_rgba(217,119,6,0.15)]' : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-slate border-brand-slate/10'}`}
            title="Warm lo-fi study beats (procedurally synthesized)"
          >
            {isAmbientOn ? <Volume2 className="w-3.5 h-3.5 text-brand-amber animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-brand-slate" />}
            <span className="hidden lg:inline">{lang === 'en' ? 'Ambient lo-fi' : 'Pyaari dhun'}: {isAmbientOn ? 'ON' : 'OFF'}</span>
            <span className="lg:hidden">{isAmbientOn ? (lang === 'en' ? 'Lo-Fi' : 'On') : (lang === 'en' ? 'Mute' : 'Mute')}</span>
          </button>

          {/* Elegant Settings / Login Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none ${
              user 
                ? 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20' 
                : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-slate border-brand-slate/10 hover:border-brand-slate/25'
            }`}
            title={lang === 'en' ? 'Account Settings & Learning Achievements' : 'Account aur Settings'}
          >
            {user ? (
              <>
                <img 
                  src={user.avatar} 
                  alt={user.fullName} 
                  className="w-4 h-4 rounded-full bg-brand-sand p-0.5 border border-green-500/30" 
                />
                <span className="max-w-[70px] truncate hidden sm:inline text-[11px]">
                  {user.fullName}
                </span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5 text-brand-slate animate-spin-slow" />
                <span className="hidden sm:inline text-[11px]">{lang === 'en' ? 'Settings' : 'Settings'}</span>
              </>
            )}
          </button>

          {/* Interactive Menu Trigger - Responsive on both PC and mobile, Polished and Easy to Learn */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="flex items-center gap-1.5 px-3 py-1 bg-brand-amber/10 hover:bg-brand-amber/20 border border-brand-amber/20 rounded-full cursor-pointer transition-all active:scale-95 shadow-sm select-none"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="w-4 h-4 text-brand-amber" />
            ) : (
              <Menu className="w-4 h-4 text-brand-amber animate-pulse" />
            )}
            <span className="text-[10px] font-extrabold text-brand-amber font-mono uppercase tracking-wider">
              {lang === 'en' ? 'Learn' : 'Sabaq'}
            </span>
          </button>
        </div>
      </div>

      {/* Slide-out Hamburger Menu Sidebar for PC & Mobile (AnimatePresence) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/45 backdrop-blur-md z-40"
            />

            {/* Slide-out Sidebar Panel - Glassmorphic design */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[310px] max-w-[85vw] bg-[#FDFBF7]/90 backdrop-blur-xl border-l-2 border-brand-charcoal/10 shadow-2xl z-50 flex flex-col p-6 overflow-hidden text-left"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-slate/10 mb-5 shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white to-[#F4EFE6] border border-brand-charcoal/10 flex items-center justify-center">
                    <ClayLogo size={18} />
                  </div>
                  <div>
                    <span className="block font-display text-sm font-black text-brand-charcoal tracking-tight">
                      Simple <span className="text-[#E07A5F] font-extrabold">AI</span>
                    </span>
                    <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase">
                      {lang === 'en' ? 'Learning Companion' : 'Sabaq ka Sathi'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 text-brand-slate hover:text-brand-charcoal rounded-lg bg-brand-sand/50 hover:bg-brand-sand transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Contents inside Sidebar */}
              <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-6 scrollbar-thin">
                
                {/* Mobile Quick Profile Settings Card */}
                <div className="bg-brand-sand/40 border border-brand-slate/10 p-3.5 rounded-2xl shrink-0 flex items-center justify-between gap-3 text-left">
                  {user ? (
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={user.avatar} 
                        alt={user.fullName} 
                        className="w-9 h-9 rounded-xl bg-white border border-brand-amber/30 p-0.5 shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="block text-[8px] font-mono font-bold text-brand-amber uppercase tracking-tight">Active Scholar</span>
                        <span className="block text-xs font-black text-brand-charcoal truncate">{user.fullName}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 min-w-0">
                      <Settings className="w-5 h-5 text-brand-muted animate-spin-slow shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase tracking-tight">Unsaved Progress</span>
                        <span className="block text-xs font-black text-brand-charcoal truncate">{lang === 'en' ? "Guest Scholar" : "Guest Scholar"}</span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-sm uppercase tracking-tight shrink-0"
                  >
                    {user ? (lang === 'en' ? 'Manage' : 'Manage') : (lang === 'en' ? 'Login' : 'Login')}
                  </button>
                </div>

                {/* Mobile Quick Search Bar */}
                <div 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="bg-white hover:bg-brand-sand border border-brand-slate/15 p-3 rounded-2xl shrink-0 flex items-center gap-3 text-left cursor-pointer transition-all shadow-sm group active:scale-98"
                >
                  <Search className="w-4 h-4 text-brand-slate group-hover:text-brand-amber transition-colors" />
                  <div className="flex-grow">
                    <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase tracking-tight">Quick Search</span>
                    <span className="block text-xs font-semibold text-brand-slate">{lang === 'en' ? "Search sections & terms..." : "Hisse aur alfaaz dhoondo..."}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-brand-sand rounded border border-brand-slate/10 text-brand-slate">
                    Go
                  </span>
                </div>

                {/* Core Journey Paths */}
                <div className="text-left">
                  <span className="block text-[9px] font-mono uppercase font-black text-brand-amber tracking-wider mb-2.5">
                    {lang === 'en' ? 'Core Journey' : 'Khaas Rasta'}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'hero', label: lang === 'en' ? 'Home Intro' : 'Shuruat', num: '00' },
                      { id: 'what-is-ai', label: lang === 'en' ? '1. The Basics' : '1. Shuruati Baatein', num: '01' },
                      { id: 'family-tree', label: lang === 'en' ? '2. The Family Tree' : '2. Khandan ka Tree', num: '02' },
                      { id: 'prompting-rag', label: lang === 'en' ? '3. Prompting & RAG' : '3. Prompting aur RAG', num: '03' },
                      { id: 'ai-tools-directory', label: lang === 'en' ? '4. Curated Tools' : '4. AI Tools', num: '04' },
                      { id: 'deeper', label: lang === 'en' ? '5. Glossary Hub' : '5. Glossary Hub', num: '05' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeSection === item.id 
                            ? 'bg-brand-amber text-white shadow-sm' 
                            : 'text-brand-slate hover:bg-brand-sand'
                        }`}
                      >
                        <span className="font-mono text-[9px] opacity-75">{item.num}</span>
                        <span className="flex-grow truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 12 Progressive Lessons list */}
                <div className="text-left">
                  <span className="block text-[9px] font-mono uppercase font-black text-brand-amber tracking-wider mb-2.5">
                    {lang === 'en' ? '12 Lessons Glossary' : '12 Progressive Sabaq'}
                  </span>
                  <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto border border-brand-charcoal/5 rounded-2xl bg-[#F7F4EF]/60 p-2 text-left">
                    {roadmapSections.map((sec) => {
                      const isActiveSub = window.location.hash === `#${sec.id}`;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isActiveSub 
                              ? 'bg-[#E07A5F] text-white' 
                              : 'text-brand-slate hover:bg-brand-sand'
                          }`}
                        >
                          <span className="truncate pr-1">
                            <span className="font-mono text-[9px] font-bold text-brand-amber mr-1.5">{sec.number}</span>
                            {sec.title}
                          </span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0 ${isActiveSub ? 'bg-white/20 text-white' : 'bg-brand-sand text-brand-muted'}`}>
                            {sec.terms.length} {lang === 'en' ? 'terms' : 'alfaaz'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reading completion tracker */}
                <div className="bg-[#FAF8F5] border border-brand-slate/10 p-4 rounded-2xl shrink-0 text-left mt-auto">
                  <span className="block text-[9px] font-mono font-bold text-brand-muted uppercase mb-1">
                    {lang === 'en' ? "Reading Progress" : "Kitna Padhe"}
                  </span>
                  <div className="flex justify-between items-center mb-1 text-xs font-black text-brand-charcoal">
                    <span>{Math.round(scrollProgress)}%</span>
                    <span className="text-[9px] text-[#E07A5F] font-mono font-bold">
                      {scrollProgress > 95 ? (lang === 'en' ? "COMPLETED" : "POORA") : (lang === 'en' ? "READING" : "PADH RAHE")}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                    <div className="h-full bg-brand-amber rounded-full" style={{ width: `${scrollProgress}%` }} />
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Glassmorphic Back to Top Button */}
      <AnimatePresence>
        {activeSection !== 'hero' && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => scrollToSection('hero')}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-slate/15 shadow-lg hover:shadow-xl text-brand-slate hover:text-white hover:bg-brand-amber hover:border-brand-amber transition-all cursor-pointer group flex items-center justify-center"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Auth Modal for Achievements & Settings */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Glassmorphic Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </nav>
  );
}
