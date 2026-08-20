import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  BookOpen, 
  ArrowUp, 
  Menu, 
  X, 
  Music, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Settings, 
  Search, 
  User, 
  Palette, 
  Languages, 
  Bookmark, 
  BookmarkCheck, 
  ListOrdered, 
  ChevronDown, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Layers,
  CheckCircle2
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import ClayLogo from './ClayLogo';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { roadmapSections } from '../data/roadmapTerms';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';

interface BookmarkData {
  scrollY: number;
  sectionId: string;
  sectionTitle: string;
  timestamp: number;
}

const GUIDE_SECTIONS = [
  { id: 'hero', num: 1, titleEn: '1. Overview', titleHyd: '1. Taaruf', shortEn: 'Intro' },
  { id: 'what-is-ai', num: 2, titleEn: '2. What is AI?', titleHyd: '2. AI Kya Hai?', shortEn: 'Basics' },
  { id: 'family-tree', num: 3, titleEn: '3. AI Family Tree', titleHyd: '3. AI Shijra', shortEn: 'Family Tree' },
  { id: 'prompting-rag', num: 4, titleEn: '4. Prompting & RAG', titleHyd: '4. RAG Nizaam', shortEn: 'RAG' },
  { id: 'ai-tools-directory', num: 5, titleEn: '5. AI Tools Directory', titleHyd: '5. AI Tools', shortEn: 'Tools' },
  { id: 'deeper', num: 6, titleEn: '6. 12 Core Concepts', titleHyd: '6. 12 Sabaq', shortEn: '12 Concepts' },
  { id: 'flashcards', num: 7, titleEn: '7. AI Flashcards', titleHyd: '7. AI Flashcards', shortEn: 'Flashcards' },
  { id: 'classroom-hub', num: 8, titleEn: '8. Classroom Hub', titleHyd: '8. Classroom', shortEn: 'Classroom' },
  { id: 'ai-arena', num: 9, titleEn: '9. AI Arena & Quiz', titleHyd: '9. Arena Quiz', shortEn: 'Quiz' },
];

export default function FloatingNav() {
  const { lang, setLang, t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [readingTime, setReadingTime] = useState(6); // Default fallback
  const [wordCount, setWordCount] = useState(1200); // Default fallback
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // LocalStorage scroll position bookmark system
  const [savedBookmark, setSavedBookmark] = useState<BookmarkData | null>(null);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // Load bookmark on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('clay_scroll_bookmark');
      if (raw) {
        const parsed: BookmarkData = JSON.parse(raw);
        setSavedBookmark(parsed);
        // If bookmark is deeper down and user just opened the page
        if (parsed.scrollY > 300 && window.scrollY < 200) {
          setShowResumeBanner(true);
        }
      }
    } catch (e) {
      console.error('Error loading bookmark from localStorage', e);
    }
  }, []);

  // Close TOC when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) {
        setIsTocOpen(false);
      }
    };
    if (isTocOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTocOpen]);

  // Save current scroll position to localStorage
  const handleSaveBookmark = () => {
    const currentScrollY = window.scrollY;
    let sectionTitle = 'Overview & Hero';
    if (activeSection === 'what-is-ai') sectionTitle = '1. What is AI?';
    else if (activeSection === 'family-tree') sectionTitle = '2. The AI Family Tree';
    else if (activeSection === 'prompting-rag') sectionTitle = '3. Prompting & RAG';
    else if (activeSection === 'ai-tools-directory') sectionTitle = '4. AI Tools Directory';
    else if (activeSection === 'deeper') sectionTitle = '5. 12 Core Concepts';
    else if (activeSection === 'classroom-hub') sectionTitle = '6. Classroom Hub';
    else if (activeSection === 'ai-arena') sectionTitle = '7. AI Arena & Quiz';

    const newBookmark: BookmarkData = {
      scrollY: Math.round(currentScrollY),
      sectionId: activeSection,
      sectionTitle,
      timestamp: Date.now(),
    };

    localStorage.setItem('clay_scroll_bookmark', JSON.stringify(newBookmark));
    setSavedBookmark(newBookmark);
    setShowResumeBanner(false);
    
    // Show toast
    setBookmarkToast(lang === 'en' ? `Bookmark saved at ${sectionTitle}!` : `Bookmark save ho gaya: ${sectionTitle}!`);
    setTimeout(() => setBookmarkToast(null), 3000);
  };

  // Jump to saved bookmark
  const handleJumpToBookmark = () => {
    if (!savedBookmark) return;
    window.scrollTo({
      top: savedBookmark.scrollY,
      behavior: 'smooth'
    });
    setShowResumeBanner(false);
    setIsTocOpen(false);
    setBookmarkToast(lang === 'en' ? 'Resumed where you left off!' : 'Wapas wahi pahunch gaye!');
    setTimeout(() => setBookmarkToast(null), 2500);
  };

  // Clear bookmark
  const handleClearBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('clay_scroll_bookmark');
    setSavedBookmark(null);
    setShowResumeBanner(false);
    setBookmarkToast(lang === 'en' ? 'Bookmark cleared' : 'Bookmark hata diya gaya');
    setTimeout(() => setBookmarkToast(null), 2000);
  };

  useEffect(() => {
    const handleGlobalSearchKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    const handleOpenSearchEvent = () => {
      setIsSearchOpen(true);
    };
    window.addEventListener('keydown', handleGlobalSearchKey);
    window.addEventListener('clay_open_search', handleOpenSearchEvent);
    return () => {
      window.removeEventListener('keydown', handleGlobalSearchKey);
      window.removeEventListener('clay_open_search', handleOpenSearchEvent);
    };
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
      const mainSections = ['hero', 'what-is-ai', 'family-tree', 'prompting-rag', 'ai-tools-directory', 'deeper', 'flashcards', 'classroom-hub', 'ai-arena'];
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

  const currentSectionObj = GUIDE_SECTIONS.find(s => s.id === activeSection) || GUIDE_SECTIONS[0];
  const currentSectionNum = currentSectionObj.num;
  const totalSections = GUIDE_SECTIONS.length;
  const isGuideComplete = scrollProgress >= 96;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      {/* Visual Multi-Section Progress Indicator at the Top */}
      <div className="relative w-full h-[6px] bg-brand-sand/70 overflow-visible group/progress">
        {/* Animated Progress Fill */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-brand-amber to-amber-600 shadow-[0_2px_10px_rgba(217,119,6,0.6)] origin-left" 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress / 100 }}
          transition={{ 
            type: "spring", 
            stiffness: 140, 
            damping: 18, 
            mass: 0.5 
          }}
          style={{ width: '100%' }}
        />

        {/* Milestone Section Pins */}
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-1">
          {GUIDE_SECTIONS.map((sec, idx) => {
            const milestonePercent = (idx / (totalSections - 1)) * 100;
            const isPassed = scrollProgress >= milestonePercent - 2;
            const isCurrent = activeSection === sec.id;
            return (
              <div 
                key={sec.id}
                className="relative group/pin pointer-events-auto cursor-pointer flex flex-col items-center"
                onClick={() => scrollToSection(sec.id)}
              >
                {/* Milestone Node */}
                <div 
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 border ${
                    isCurrent
                      ? 'bg-white border-brand-amber ring-2 ring-brand-amber scale-125 shadow-md'
                      : isPassed
                      ? 'bg-brand-amber border-white/80'
                      : 'bg-brand-sand border-brand-slate/20 hover:scale-110'
                  }`}
                />

                {/* Popover on Hover */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-opacity duration-200 pointer-events-none bg-brand-charcoal text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-50">
                  <span>{lang === 'en' ? sec.titleEn : sec.titleHyd}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Name & Reading Progress Badge Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 cursor-pointer font-display text-base sm:text-lg font-extrabold text-brand-charcoal hover:text-brand-amber transition-colors shrink-0"
          >
            {/* Cute AI Bot Logo matching the user image */}
            <ClayLogo size={32} />
            <span className="tracking-tight">Simple <span className="text-brand-amber font-extrabold">AI</span></span>
          </button>

          {/* Visual Guide Completion & Section Progress Feedback Pill (Tablet & Desktop) */}
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none shadow-sm ${
              isGuideComplete
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-emerald-100'
                : 'bg-white/80 hover:bg-brand-sand text-brand-charcoal border-brand-amber/30'
            }`}
            title="Click to view all sections & progress"
          >
            {/* Circular Progress Ring */}
            <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
              {isGuideComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-brand-slate/15"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-brand-amber"
                    strokeDasharray={`${Math.round(scrollProgress)}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              )}
            </div>

            {/* Completion Percentage & Section Feedback */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`font-mono font-black ${isGuideComplete ? 'text-emerald-700' : 'text-brand-amber-dark'}`}>
                {Math.round(scrollProgress)}%
              </span>
              <span className="text-brand-slate/40">•</span>
              <span className="text-brand-slate font-semibold truncate max-w-[140px] md:max-w-[200px]">
                {isGuideComplete 
                  ? (lang === 'en' ? 'Completed 🎉' : 'Mukammal 🎉') 
                  : (lang === 'en' ? `Sec ${currentSectionNum}/${totalSections}: ${currentSectionObj.shortEn}` : `Hissa ${currentSectionNum}/${totalSections}: ${currentSectionObj.titleHyd}`)}
              </span>
            </div>
          </button>

          {/* Compact Mobile Progress Pill */}
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`sm:hidden flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer select-none ${
              isGuideComplete
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white/90 text-brand-charcoal border-brand-amber/30'
            }`}
            title="Click to view progress & contents"
          >
            <span className="font-mono font-black text-brand-amber-dark">{Math.round(scrollProgress)}%</span>
            <span className="text-[9px] text-brand-slate opacity-75">Sec {currentSectionNum}/8</span>
          </button>

          {/* Small Glassmorphic Reading Time Badge with interactive details */}
          <div 
            className="group relative glass-panel px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-brand-amber border border-brand-amber/30 hidden lg:flex items-center gap-1.5 shadow-sm shrink-0 cursor-help transition-all duration-300 hover:border-brand-amber/60 hover:bg-white/60"
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Table of Contents Dropdown Menu Trigger */}
          <div className="relative" ref={tocRef}>
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer select-none border shadow-sm active:scale-95 group ${
                isTocOpen 
                  ? 'bg-brand-amber text-white border-brand-amber shadow-md' 
                  : 'bg-white/80 hover:bg-brand-sand text-brand-charcoal border-brand-amber/20 hover:border-brand-amber/40'
              }`}
              title="Table of Contents (All Sections)"
            >
              <ListOrdered className="w-3.5 h-3.5 text-inherit" />
              <span className="hidden md:inline text-[11px] font-extrabold">
                {lang === 'en' ? 'Contents' : 'Fehrist'}
              </span>
              <ChevronDown className={`w-3 h-3 text-inherit transition-transform duration-200 ${isTocOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Persistent Table of Contents Dropdown Panel */}
            <AnimatePresence>
              {isTocOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-white/95 backdrop-blur-xl border border-brand-amber/25 rounded-2xl shadow-2xl p-3 z-50 overflow-hidden flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between px-2 pb-2 border-b border-brand-slate/10">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-amber" />
                      <span className="text-xs font-black text-brand-charcoal uppercase tracking-wider">
                        {lang === 'en' ? 'Table of Contents' : 'Sabaq Fehrist'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-brand-slate">
                      8 Sections
                    </span>
                  </div>

                  {/* Bookmark Quick Action in TOC Header */}
                  <div className="bg-brand-sand/40 p-2 rounded-xl border border-brand-slate/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-brand-amber" />
                      <span className="text-[10.5px] font-bold text-brand-charcoal truncate max-w-[130px]">
                        {savedBookmark ? savedBookmark.sectionTitle : (lang === 'en' ? 'No bookmark' : 'Koi bookmark nahi')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {savedBookmark && (
                        <button
                          onClick={handleJumpToBookmark}
                          className="px-2 py-0.5 bg-brand-amber text-white text-[10px] font-bold rounded-lg hover:bg-brand-amber-dark transition-colors cursor-pointer"
                        >
                          {lang === 'en' ? 'Resume' : 'Chalo'}
                        </button>
                      )}
                      <button
                        onClick={handleSaveBookmark}
                        className="px-2 py-0.5 bg-white text-brand-charcoal border border-brand-slate/15 text-[10px] font-bold rounded-lg hover:bg-brand-sand transition-colors cursor-pointer"
                      >
                        {lang === 'en' ? 'Save Here' : 'Save Karein'}
                      </button>
                    </div>
                  </div>

                  {/* Sections List */}
                  <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                    {[
                      { id: 'hero', titleEn: '1. Introduction & Overview', titleHyd: '1. Aghaz & Taaruf', read: '1 min' },
                      { id: 'what-is-ai', titleEn: '2. What is AI? (Foundations)', titleHyd: '2. AI Kya Hai? (Buniyaad)', read: '2 min' },
                      { id: 'family-tree', titleEn: '3. The AI Family Tree', titleHyd: '3. AI Shijra-e-Nasab', read: '3 min' },
                      { id: 'prompting-rag', titleEn: '4. Prompting & RAG Architecture', titleHyd: '4. Prompting & RAG Nizaam', read: '3 min' },
                      { id: 'ai-tools-directory', titleEn: '5. AI Tools Directory', titleHyd: '5. AI Tools Fehrist', read: '2 min' },
                      { id: 'deeper', titleEn: '6. 12 Core Concepts Deep Dive', titleHyd: '6. 12 Buniyaadi Sabaq', read: '6 min' },
                      { id: 'flashcards', titleEn: '7. AI Flashcard Deck (Recall)', titleHyd: '7. AI Flashcard Deck', read: '3 min' },
                      { id: 'classroom-hub', titleEn: '8. Classroom Hub & Notes', titleHyd: '8. Classroom Hub & Sabaq', read: '2 min' },
                      { id: 'ai-arena', titleEn: '9. AI Arena & Knowledge Quiz', titleHyd: '9. Quiz Arena & Imtehaan', read: '3 min' },
                    ].map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            scrollToSection(item.id);
                            setIsTocOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                            isActive
                              ? 'bg-brand-amber/15 text-brand-amber-dark font-black border border-brand-amber/30'
                              : 'text-brand-slate hover:bg-brand-sand/60 hover:text-brand-charcoal'
                          }`}
                        >
                          <span className="truncate pr-2">
                            {lang === 'en' ? item.titleEn : item.titleHyd}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] font-mono text-brand-muted opacity-70">
                              {item.read}
                            </span>
                            {isActive && <Check className="w-3 h-3 text-brand-amber stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bookmark Current Scroll Position Button */}
          <div className="relative">
            <button
              onClick={savedBookmark ? handleJumpToBookmark : handleSaveBookmark}
              onContextMenu={(e) => {
                e.preventDefault();
                handleSaveBookmark();
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer select-none border shadow-sm active:scale-95 group ${
                savedBookmark 
                  ? 'bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-amber border-brand-amber/30' 
                  : 'bg-white/80 hover:bg-brand-sand text-brand-charcoal border-brand-amber/20 hover:border-brand-amber/40'
              }`}
              title={savedBookmark 
                ? (lang === 'en' ? `Jump to saved bookmark (${savedBookmark.sectionTitle}). Right-click or TOC to update.` : `Saved bookmark par jayein (${savedBookmark.sectionTitle})`) 
                : (lang === 'en' ? 'Bookmark current scroll position' : 'Scroll position bookmark karein')}
            >
              {savedBookmark ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-brand-amber fill-brand-amber/20" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 text-brand-slate group-hover:text-brand-amber transition-colors" />
              )}
              <span className="hidden sm:inline text-[11px] font-extrabold">
                {savedBookmark 
                  ? (lang === 'en' ? 'Resume' : 'Wapas') 
                  : (lang === 'en' ? 'Bookmark' : 'Bookmark')}
              </span>
            </button>
          </div>

          {/* Ask Clay / Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white/80 hover:bg-brand-amber/15 text-brand-charcoal border border-brand-amber/20 hover:border-brand-amber/40 rounded-full text-xs font-black transition-all cursor-pointer select-none shadow-sm hover:shadow-md active:scale-95 group"
            title={lang === 'en' ? 'Ask Clay a Question (Cmd+K)' : 'Clay se Sawaal Poochho (Cmd+K)'}
          >
            <ClayLogo size={18} />
            <span className="hidden sm:inline text-[11px] font-extrabold text-brand-charcoal group-hover:text-brand-amber transition-colors">
              {lang === 'en' ? 'Ask Clay' : 'Clay se Poochho'}
            </span>
            <span className="hidden lg:inline text-[9px] font-mono opacity-40">⌘K</span>
          </button>

          {/* Gemini AI Studio Direct Trigger Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('clay_open_ai_studio'))}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-full text-xs font-black transition-all cursor-pointer select-none shadow-sm hover:shadow-md active:scale-95 group"
            title="Open Gemini AI Chat, Voice Transcribe, and Veo Studio"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-extrabold tracking-tight">
              {lang === 'te' ? 'AI స్టూడియో' : lang === 'hyd' ? 'AI Studio' : 'AI Studio'}
            </span>
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

          {/* Interactive Menu Trigger */}
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

      {/* Floating Bookmark Toast Notification */}
      <AnimatePresence>
        {bookmarkToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-brand-amber/30 pointer-events-none"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-brand-amber" />
            <span>{bookmarkToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return to Bookmark Banner (when returning to the page) */}
      <AnimatePresence>
        {showResumeBanner && savedBookmark && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-brand-amber text-white text-xs px-6 py-2 shadow-md flex items-center justify-between max-w-5xl mx-auto rounded-b-2xl"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="font-medium">
                {lang === 'en' 
                  ? `You have a saved reading bookmark at "${savedBookmark.sectionTitle}"` 
                  : `Aap ka bookmark "${savedBookmark.sectionTitle}" par mehfooz hai`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleJumpToBookmark}
                className="px-3 py-0.5 bg-white text-brand-amber-dark font-black rounded-full hover:bg-brand-sand transition-all text-[11px] cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>{lang === 'en' ? 'Resume Reading' : 'Wahan Jayein'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowResumeBanner(false)}
                className="p-1 hover:bg-white/20 rounded-full cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                
                {/* Premium Control Center & App Settings Card */}
                <div className="bg-[#FAF8F5]/90 border border-brand-charcoal/10 p-4 rounded-2xl shrink-0 flex flex-col gap-3.5 text-left shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-slate/10">
                    <span className="block text-[9px] font-mono font-bold text-brand-amber uppercase tracking-wider">
                      {lang === 'en' ? 'App Control Center' : 'App Control Center & Settings'}
                    </span>
                    <Settings className="w-4 h-4 text-brand-amber animate-spin-slow" />
                  </div>

                  {/* Active Scholar Profile Row */}
                  <div className="flex items-center justify-between gap-3 bg-white/60 p-2 border border-brand-slate/10 rounded-xl">
                    {user ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={user.avatar} 
                          alt={user.fullName} 
                          className="w-8 h-8 rounded-lg bg-white border border-brand-amber/30 p-0.5 shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="block text-[8px] font-mono font-bold text-brand-amber uppercase tracking-tight">Active Scholar</span>
                          <span className="block text-xs font-black text-brand-charcoal truncate leading-tight">{user.fullName}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-brand-sand/50 flex items-center justify-center shrink-0 border border-brand-slate/10">
                          <User className="w-4 h-4 text-brand-muted" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase tracking-tight">Unsaved Progress</span>
                          <span className="block text-xs font-black text-brand-charcoal truncate leading-tight">{lang === 'en' ? "Guest Scholar" : "Guest Scholar"}</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer shadow-sm uppercase tracking-tight shrink-0"
                    >
                      {user ? (lang === 'en' ? 'Account' : 'Profile') : (lang === 'en' ? 'Login' : 'Login')}
                    </button>
                  </div>

                  {/* Language Selection Row */}
                  <div className="bg-white/80 p-2.5 border border-brand-slate/10 rounded-xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-brand-amber uppercase tracking-tight flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        <span>{lang === 'te' ? 'భాషను ఎంచుకోండి' : lang === 'hyd' ? 'Zabaan Chuno' : 'Choose Language'}</span>
                      </span>
                      <span className="text-[8px] font-mono text-brand-muted">3 Options</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { code: 'en' as Language, label: 'EN', name: 'English' },
                        { code: 'hyd' as Language, label: 'HYD', name: 'హైదరాబాదీ' },
                        { code: 'te' as Language, label: 'TEL', name: 'తెలుగు' }
                      ].map((item) => (
                        <button
                          key={item.code}
                          onClick={() => setLang(item.code)}
                          className={`py-1.5 px-1 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                            lang === item.code
                              ? 'bg-brand-amber text-white shadow-xs'
                              : 'bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal'
                          }`}
                        >
                          <span className="block font-mono text-[9px]">{item.label}</span>
                          <span className="block text-[8px] opacity-85 truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Settings Category Links */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                        // Open AuthModal and let user configure visual theme
                      }}
                      className="flex flex-col items-start gap-1 p-2 bg-white hover:bg-brand-sand/50 border border-brand-slate/10 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <Palette className="w-4 h-4 text-brand-amber shrink-0" />
                      <div>
                        <span className="block text-[10.5px] font-bold text-brand-charcoal leading-tight">
                          {lang === 'en' ? 'Visual Themes' : 'Theme Badlo'}
                        </span>
                        <span className="block text-[8px] text-brand-muted leading-none mt-0.5">
                          {lang === 'en' ? 'Sand, Dark, Blue' : 'Website ka rang'}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                        // Open AuthModal and let user configure sounds
                      }}
                      className="flex flex-col items-start gap-1 p-2 bg-white hover:bg-brand-sand/50 border border-brand-slate/10 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <Volume2 className="w-4 h-4 text-brand-amber shrink-0" />
                      <div>
                        <span className="block text-[10.5px] font-bold text-brand-charcoal leading-tight">
                          {lang === 'en' ? 'Sound Settings' : 'Awaaz Settings'}
                        </span>
                        <span className="block text-[8px] text-brand-muted leading-none mt-0.5">
                          {lang === 'en' ? 'Volume, rates, lo-fi' : 'Volume & crackle'}
                        </span>
                      </div>
                    </button>
                  </div>
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
                    {lang === 'en' ? 'Core Journey' : lang === 'te' ? 'ప్రధాన ప్రయాణం' : 'Khaas Rasta'}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'hero', label: lang === 'en' ? 'Home Intro' : lang === 'te' ? 'హోమ్ పరిచయం' : 'Shuruat', num: '00' },
                      { id: 'what-is-ai', label: lang === 'en' ? '1. The Basics' : lang === 'te' ? '1. ప్రాథమిక విషయాలు' : '1. Shuruati Baatein', num: '01' },
                      { id: 'family-tree', label: lang === 'en' ? '2. The Family Tree' : lang === 'te' ? '2. ఫ్యామిలీ ట్రీ' : '2. Khandan ka Tree', num: '02' },
                      { id: 'prompting-rag', label: lang === 'en' ? '3. Prompting & RAG' : lang === 'te' ? '3. ప్రాంప్టింగ్ & RAG' : '3. Prompting aur RAG', num: '03' },
                      { id: 'ai-tools-directory', label: lang === 'en' ? '4. Curated Tools' : lang === 'te' ? '4. AI సాధనాలు' : '4. AI Tools', num: '04' },
                      { id: 'deeper', label: lang === 'en' ? '5. Glossary Hub' : lang === 'te' ? '5. పదకోశం' : '5. Glossary Hub', num: '05' },
                      { id: 'classroom-hub', label: lang === 'en' ? '6. Classroom Hub' : lang === 'te' ? '6. క్లాస్‌రూమ్ హబ్' : '6. Classroom Hub', num: '06' },
                      { id: 'ai-arena', label: lang === 'en' ? '7. AI Arena' : lang === 'te' ? '7. AI అరేనా' : '7. AI Arena', num: '07' },
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
            className="fixed bottom-22 right-6 z-40 p-3.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-slate/15 shadow-lg hover:shadow-xl text-brand-slate hover:text-white hover:bg-brand-amber hover:border-brand-amber transition-all cursor-pointer group flex items-center justify-center"
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
