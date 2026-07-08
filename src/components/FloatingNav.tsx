import { useState, useEffect } from 'react';
import { Compass, BookOpen, ArrowUp, Menu, X, Music, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';

export default function FloatingNav() {
  const { lang, t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [readingTime, setReadingTime] = useState(6); // Default fallback
  const [wordCount, setWordCount] = useState(1200); // Default fallback
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }

      // Simple active section detection
      const sections = ['hero', 'what-is-ai', 'family-tree', 'prompting-rag', 'ai-tools-directory', 'deeper'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
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
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      {/* Dynamic Progress Bar */}
      <div className="absolute top-0 left-0 h-[4px] bg-brand-amber progress-fill" style={{ width: `${scrollProgress}%` }} />

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

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-3.5 text-sm font-medium">
          <button 
            onClick={() => scrollToSection('what-is-ai')} 
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
              activeSection === 'what-is-ai' 
                ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/20 shadow-sm' 
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50 border-transparent'
            }`}
          >
            <span className="opacity-50 text-[10px] font-mono">01.</span>
            {t('nav.intro')}
          </button>
          <button 
            onClick={() => scrollToSection('family-tree')} 
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
              activeSection === 'family-tree' 
                ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/20 shadow-sm' 
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50 border-transparent'
            }`}
          >
            <span className="opacity-50 text-[10px] font-mono">02.</span>
            {t('nav.family')}
          </button>
          <button 
            onClick={() => scrollToSection('prompting-rag')} 
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
              activeSection === 'prompting-rag' 
                ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/20 shadow-sm' 
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50 border-transparent'
            }`}
          >
            <span className="opacity-50 text-[10px] font-mono">03.</span>
            {t('nav.how')}
          </button>
          <button 
            onClick={() => scrollToSection('ai-tools-directory')} 
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
              activeSection === 'ai-tools-directory' 
                ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/20 shadow-sm font-extrabold' 
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50 border-transparent'
            }`}
          >
            <span className="opacity-50 text-[10px] font-mono">04.</span>
            {t('nav.toolbox')}
          </button>
          <button 
            onClick={() => scrollToSection('deeper')} 
            className={`cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
              activeSection === 'deeper' 
                ? 'bg-brand-amber text-white border-brand-amber shadow-md shadow-brand-amber/10' 
                : 'bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-amber border border-brand-amber/25'
            }`}
          >
            <span className="opacity-70 text-[10px] font-mono">05.</span>
            {t('nav.close')}
          </button>
        </div>

        {/* Progress Display */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="font-mono text-xs text-brand-muted font-medium">
            {Math.round(scrollProgress)}% {lang === 'en' ? 'read' : 'mukammal'}
          </span>
          {scrollProgress > 90 && (
            <button
              onClick={() => scrollToSection('hero')}
              className="p-1.5 bg-brand-sand hover:bg-brand-amber hover:text-white text-brand-slate rounded-full transition-all duration-300"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subtle Ambient Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none ${isAmbientOn ? 'bg-brand-amber/15 text-brand-amber border-brand-amber/30 shadow-[0_0_12px_rgba(217,119,6,0.15)]' : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-slate border-brand-slate/10'}`}
            title="Warm lo-fi study beats (procedurally synthesized)"
          >
            {isAmbientOn ? <Volume2 className="w-3.5 h-3.5 text-brand-amber animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-brand-slate" />}
            <span className="hidden lg:inline">{lang === 'en' ? 'Ambient lo-fi' : 'Pyaari dhun'}: {isAmbientOn ? 'ON' : 'OFF'}</span>
            <span className="lg:hidden">{isAmbientOn ? (lang === 'en' ? 'Lo-Fi' : 'On') : (lang === 'en' ? 'Mute' : 'Mute')}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-1 text-brand-slate hover:text-brand-charcoal transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphic) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 glass-panel py-4 px-6 flex flex-col gap-4 border-t border-brand-amber/10 animate-fade-in shadow-xl">
          <button 
            onClick={() => scrollToSection('what-is-ai')} 
            className="text-left py-2 font-medium text-brand-slate hover:text-brand-amber transition-colors cursor-pointer"
          >
            1. {t('nav.intro')}
          </button>
          <button 
            onClick={() => scrollToSection('family-tree')} 
            className="text-left py-2 font-medium text-brand-slate hover:text-brand-amber transition-colors cursor-pointer"
          >
            2. {t('nav.family')}
          </button>
          <button 
            onClick={() => scrollToSection('prompting-rag')} 
            className="text-left py-2 font-medium text-brand-slate hover:text-brand-amber transition-colors cursor-pointer"
          >
            3. {t('nav.how')}
          </button>
          <button 
            onClick={() => scrollToSection('ai-tools-directory')} 
            className="text-left py-2 font-medium text-brand-slate hover:text-brand-amber transition-colors cursor-pointer"
          >
            4. {t('nav.toolbox')}
          </button>
          <button 
            onClick={() => scrollToSection('deeper')} 
            className="text-left py-2 font-medium text-brand-amber hover:text-brand-amber-dark transition-colors cursor-pointer"
          >
            5. {t('nav.deeper')}
          </button>
          <div className="h-[1px] bg-brand-slate/10 my-1" />
          <div className="flex justify-between items-center text-xs text-brand-muted">
            <span>{lang === 'en' ? 'Reading Progress' : 'Kitna Padhe'}</span>
            <span className="font-mono">{Math.round(scrollProgress)}%</span>
          </div>
        </div>
      )}
    </nav>
  );
}
