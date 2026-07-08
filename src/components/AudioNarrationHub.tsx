import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Headphones, 
  Search, 
  Sparkles, 
  BookOpen, 
  Layers, 
  X, 
  ChevronRight,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import { roadmapSections, Section, Term } from '../data/roadmapTerms';
import ClayLogo from './ClayLogo';

interface SectionContent {
  id: string;
  titleEn: string;
  titleHyd: string;
  textEn: string;
  textHyd: string;
  sectionId?: string; // mapped to actual HTML id if applicable
}

type SearchResultItem = 
  | { type: 'section'; section: Section; id: string; title: string; subtitle: string }
  | { type: 'term'; section: Section; term: Term; id: string; title: string; definition: string };

export default function AudioNarrationHub() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'search'>('audio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSectionId, setPlayingSectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  // Sync state with global speech synthesis status
  useEffect(() => {
    const checkState = setInterval(() => {
      const activeSpeaking = audioEngine.isCurrentlySpeaking();
      setIsPlaying(activeSpeaking);
      if (!activeSpeaking) {
        setPlayingSectionId(null);
      }
    }, 500);

    audioEngine.setSpeakStateListener((speaking) => {
      setIsPlaying(speaking);
      if (!speaking) {
        setPlayingSectionId(null);
      }
    });

    return () => clearInterval(checkState);
  }, []);

  // Show "Ask me anything" speech bubble for a short period on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const sections: SectionContent[] = [
    {
      id: 'all',
      titleEn: 'Full Website Audio Guide',
      titleHyd: 'Poori Website ka Audio Guide',
      textEn: "Welcome! I'm Clay, your tactile explainer. Let me guide you through everything on this website. Artificial Intelligence is the broad concept of teaching machines to learn from examples. Inside it, we find Machine Learning, which uses mathematical algorithms to recognize patterns. Nested even deeper is Deep Learning, utilizing layered neural networks inspired by human brains. At the very center lies Generative AI, creating brand new content, powered by Large Language Models like Gemini. We can use these tools via clever prompts and Retrieval-Augmented Generation to get precise, factual answers.",
      textHyd: "Arey salaam yaaron! Main hoon Clay, tumhara apna tactile explainer. Main tumhein is website ki poori sair karaata hoon. Artificial Intelligence bole to computer'aa ko dimaag dena — aisi machines jo patterns se seekhte hain. Iske andar Machine Learning rehta jo mathematics ke zariye data mein patterns dhoondta. Aur uske bhi andar Deep Learning rehta jo insani dimaag ke jaisa layers wale neural networks use karta hai. Aur is khandaan ke bilkul dil mein Generative AI baithta hai, jo naye photo'aan, videos aur text bana sakta hai Gemini jaise bade language models ke zariye! Hum isko sahi prompts aur RAG ke zariye bilkul sacha jawaab dene ke kabil banate hain."
    },
    {
      id: 'basics',
      titleEn: '1. What is AI?',
      titleHyd: '1. AI kya hai?',
      textEn: "Artificial Intelligence means designing computers that can learn and solve problems by recognizing patterns, rather than just executing manual rules written by programmers. In the traditional programming era, developers had to write step-by-step logic. Now, with AI, we feed the system thousands of examples, allowing it to calculate its own pathways to predict, classify, and create.",
      textHyd: "Arey yaaron, Artificial Intelligence ka matlab computer ko rules likh ke dene ke bajaye use hazaaro examples dekar khud seekhne dena hai. Pehle hum ek ek line code ki likhte the. Ab hum hazaaro photos ya data de dete, computer apna rasta aur logic khud banaata hai taaki pehchan sake ya naya content bana sake!",
      sectionId: 'section-basics'
    },
    {
      id: 'family-tree',
      titleEn: '2. The AI Family Tree',
      titleHyd: '2. AI ka Khandaan',
      textEn: "To understand AI, we can picture nested Russian dolls. The outermost doll is Artificial Intelligence, the overall field. Inside is Machine Learning, which trains on data to make decisions. Nesting further is Deep Learning, which models multi-layered neural networks. Finally, at the core is Generative AI, which specializes in synthesizing new text, images, and creative media from instructions.",
      textHyd: "AI ke khandaan ko samajhne ke waaste nested Russian dolls ke jaisa dabba-in-dabba samjho. Sabse bada dabba AI hai. Uske andar Machine Learning baithta hai jo data se seekhta hai. Uske bhi andar Deep Learning hai jo deep neural networks chalata hai. Aur sabse chota par sabse dhasu dabba Generative AI hai jo naya text aur photos banata hai!",
      sectionId: 'section-family-tree'
    },
    {
      id: 'gen-ai',
      titleEn: '3. Generative AI & LLMs',
      titleHyd: '3. Generative AI aur LLMs',
      textEn: "Generative AI can create original content. It is powered by Large Language Models which are trained on vast oceans of text. These models break language into small tokens, calculating which word or phrase is most likely to come next. It's a continuous, mathematical prediction loop of incredible scale.",
      textHyd: "Generative AI bole to naye photos, texts aur code paida karne wala AI. Iske peeche bade models rehte jise Large Language Models kehte hain. Ye poori duniya ke likhe so kitaabon ko padh ke, agla word kya hona chahiye uski probability check karte rehte!",
      sectionId: 'section-generative-ai'
    },
    {
      id: 'prompting',
      titleEn: '4. Prompting & RAG',
      titleHyd: '4. Prompting aur RAG',
      textEn: "We interact with LLMs using prompts. Prompting is a craft: giving context, roles, and instructions. To make answers highly accurate and prevent hallucinations, we use Retrieval-Augmented Generation, or RAG. It fetches fresh, reliable documents from a secure database and appends them to your prompt, so the AI reads the correct reference before drafting its reply.",
      textHyd: "Hum AI se baat karne ke waaste prompts use karte hain. Sahi sawaal puchna ek fun hai yaaron. Lekin AI kabhi kabhi fekte rehta hai (hallucination). Uske waaste hum RAG use karte. RAG pehle safe database se pakka sach dhoond ke lata, aur AI ko bolta ki isi ke mutabiq sach-sach bolo!",
      sectionId: 'section-prompting-rag'
    },
    {
      id: 'glossary',
      titleEn: '5. Technical Glossary',
      titleHyd: '5. Glossary (Mushkil Alfaaz)',
      textEn: "Our interactive glossary breaks down core terms simply. Neural networks are layers of nodes that filter signals to recognize features. Hallucinations are confident but incorrect predictions made by models due to pattern gaps. Tokens are word fragments representing numerical semantic values.",
      textHyd: "Humari glossary mein saare mushkil words ekdam asaan zabaan mein milenge yaaron. Neural networks bole to dimaag ke cells ke jaise layers, hallucinations bole to AI ki phekne wali aadat, aur tokens bole to words ke chote chote tukde!"
    }
  ];

  // Search filter logic for the Ask Clay search tab
  const filteredSearchResults = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return [];

    const results: SearchResultItem[] = [];

    roadmapSections.forEach(section => {
      // Check section title and subtitle
      if (section.title.toLowerCase().includes(cleanQuery) || section.subtitle.toLowerCase().includes(cleanQuery) || section.number.includes(cleanQuery)) {
        results.push({
          type: 'section',
          section,
          id: section.id,
          title: section.title,
          subtitle: section.subtitle
        });
      }

      // Check glossary terms
      section.terms.forEach(term => {
        if (term.title.toLowerCase().includes(cleanQuery) || term.definition.toLowerCase().includes(cleanQuery)) {
          results.push({
            type: 'term',
            section,
            term,
            id: `term-${term.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            title: term.title,
            definition: term.definition
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const toggleSectionPlay = (section: SectionContent) => {
    if (playingSectionId === section.id && isPlaying) {
      audioEngine.stopSpeaking();
      setIsPlaying(false);
      setPlayingSectionId(null);
    } else {
      audioEngine.stopSpeaking();
      const textToSpeak = lang === 'en' ? section.textEn : section.textHyd;
      audioEngine.speak(textToSpeak, lang, () => {
        setIsPlaying(false);
        setPlayingSectionId(null);
      });
      setIsPlaying(true);
      setPlayingSectionId(section.id);
    }
  };

  const handleStopAll = () => {
    audioEngine.stopSpeaking();
    setIsPlaying(false);
    setPlayingSectionId(null);
  };

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setIsOpen(false);
    window.location.hash = item.id;
    setTimeout(() => {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const panelRef = useRef<HTMLDivElement>(null);

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;

    // Get all focusable elements inside the panel that are currently visible/interactable
    const focusables = (Array.from(
      panelRef.current.querySelectorAll(
        'button, input[type="text"], [tabindex="0"]'
      )
    ) as HTMLElement[]).filter(el => {
      return !el.hasAttribute('disabled') && el.offsetParent !== null;
    });

    const activeEl = document.activeElement as HTMLElement;
    const activeIdx = focusables.indexOf(activeEl);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = activeIdx + 1 < focusables.length ? activeIdx + 1 : 0;
      focusables[nextIdx]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = activeIdx - 1 >= 0 ? activeIdx - 1 : focusables.length - 1;
      focusables[prevIdx]?.focus();
    } else if (e.key === 'ArrowRight') {
      if (activeEl && activeEl.getAttribute('data-tab') === 'audio') {
        e.preventDefault();
        setActiveTab('search');
        setTimeout(() => {
          const searchTab = panelRef.current?.querySelector('[data-tab="search"]') as HTMLElement;
          searchTab?.focus();
        }, 30);
      }
    } else if (e.key === 'ArrowLeft') {
      if (activeEl && activeEl.getAttribute('data-tab') === 'search') {
        e.preventDefault();
        setActiveTab('audio');
        setTimeout(() => {
          const audioTab = panelRef.current?.querySelector('[data-tab="audio"]') as HTMLElement;
          audioTab?.focus();
        }, 30);
      }
    }
  };

  // Open the search via custom global event trigger
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true);
      setActiveTab('search');
    };
    window.addEventListener('clay_open_search', handleOpenSearch);
    return () => window.removeEventListener('clay_open_search', handleOpenSearch);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Consolidated Clay Helper Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            onKeyDown={handlePanelKeyDown}
            tabIndex={0}
            aria-label={lang === 'en' ? "Clay's Assistant Hub, use arrow keys to navigate options" : "کِلے اسسٹنٹ ہب، اختیارات نیویگیٹ کرنے کے لیے تیر کے نشان والے بٹنوں کا استعمال کریں"}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel w-85 sm:w-96 rounded-3xl p-5 border-brand-amber/25 shadow-2xl mb-4.5 flex flex-col gap-4.5 relative overflow-hidden border-2 bg-white/95 backdrop-blur-xl focus:ring-2 focus:ring-brand-amber/40 focus:outline-none"
          >
            {/* Ambient clay texture overlay */}
            <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            {/* Header with Close and Identity */}
            <div className="flex items-center justify-between border-b border-brand-slate/5 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <ClayLogo size={32} />
                <div>
                  <h3 className="font-display text-sm font-black text-brand-charcoal flex items-center gap-1.5 uppercase tracking-wide">
                    {lang === 'en' ? "Clay's Assistant Hub" : "Clay ka Hub"}
                    {isPlaying && <span className="inline-block w-2 h-2 rounded-full bg-brand-amber animate-ping" />}
                  </h3>
                  <p className="text-[10px] text-brand-slate">
                    {lang === 'en' ? "Your regional guide to AI" : "AI seekhne ka asaan zariya"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modern Tab Control */}
            <div className="flex bg-brand-sand/50 p-1 rounded-2xl border border-brand-slate/5 shrink-0">
              <button
                data-tab="audio"
                onClick={() => setActiveTab('audio')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-amber/50 ${
                  activeTab === 'audio'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-brand-slate hover:text-brand-charcoal'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-brand-amber" />
                <span>{lang === 'en' ? "Voice Guide" : "Awaaz Guide"}</span>
              </button>
              <button
                data-tab="search"
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-amber/50 ${
                  activeTab === 'search'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-brand-slate hover:text-brand-charcoal'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-brand-amber" />
                <span>{lang === 'en' ? "Ask Clay" : "Clay se Poochho"}</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. AUDIO GUIDE SECTION LIST */}
            {activeTab === 'audio' && (
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                
                {/* Clay Speaking Status Banner */}
                <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                  isPlaying 
                    ? "bg-brand-amber/5 border-brand-amber/20 shadow-inner" 
                    : "bg-brand-sand/20 border-brand-slate/5"
                }`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-brand-slate/5 shadow-sm relative overflow-hidden">
                    <ClayLogo size={28} className={isPlaying ? "animate-bounce" : ""} />
                    {isPlaying && (
                      <div className="absolute bottom-0.5 flex gap-0.5 items-end justify-center w-full">
                        <span className="w-0.5 h-2 bg-brand-amber rounded-full animate-pulse" />
                        <span className="w-0.5 h-3.5 bg-brand-amber rounded-full animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-brand-amber rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-extrabold text-brand-charcoal block truncate">
                      {isPlaying 
                        ? (lang === 'en' ? "Currently playing narration" : "Narration chalra hai yaaron") 
                        : (lang === 'en' ? "Choose a section to play" : "Neeche se ek hissa chunein")
                      }
                    </span>
                    <span className="text-[9.5px] text-brand-slate block truncate leading-tight mt-0.5">
                      {isPlaying 
                        ? (lang === 'en' ? "Voice optimized for young learners." : "Asaan zabaan mein parha ja raha hai.") 
                        : (lang === 'en' ? "Tap any section row to start/pause Clay." : "Kahin bhi dabao aur asani se suno.")
                      }
                    </span>
                  </div>
                  {isPlaying && (
                    <button
                      onClick={handleStopAll}
                      className="p-1.5 bg-brand-sand/60 hover:bg-brand-amber-light text-brand-charcoal hover:text-white rounded-lg border border-brand-slate/10 transition-all cursor-pointer"
                      title="Stop Speech"
                    >
                      <Square className="w-3 h-3 fill-current" />
                    </button>
                  )}
                </div>

                {/* Vertical Interactive Section List */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono font-bold text-brand-muted uppercase tracking-wider block mb-1">
                    {lang === 'en' ? "Available Sections" : "Sabak ki Fihrist"}
                  </span>
                  
                  {sections.map((section) => {
                    const isCurrentPlaying = playingSectionId === section.id && isPlaying;
                    return (
                      <button
                        key={section.id}
                        onClick={() => toggleSectionPlay(section)}
                        className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-amber/50 ${
                          isCurrentPlaying
                            ? "bg-brand-amber/10 border-brand-amber/35 shadow-sm"
                            : "bg-white hover:bg-brand-sand/30 border-brand-slate/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                            isCurrentPlaying
                              ? "bg-brand-amber text-white border-brand-amber/15"
                              : "bg-brand-sand/40 text-brand-slate border-brand-slate/5 group-hover:bg-brand-amber/10 group-hover:text-brand-amber group-hover:border-brand-amber/20"
                          }`}>
                            <Headphones className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-brand-charcoal truncate">
                              {lang === 'en' ? section.titleEn : section.titleHyd}
                            </h4>
                            <p className="text-[10px] text-brand-slate truncate leading-snug mt-0.5">
                              {lang === 'en' ? section.textEn : section.textHyd}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 ml-1">
                          {isCurrentPlaying ? (
                            <div className="p-1.5 rounded-full bg-brand-amber text-white shadow-md">
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            </div>
                          ) : (
                            <div className="p-1.5 rounded-full bg-brand-sand/80 hover:bg-brand-amber/20 hover:text-brand-amber text-brand-slate group-hover:scale-105 transition-transform">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. ASK CLAY SEARCH BOX */}
            {activeTab === 'search' && (
              <div className="flex flex-col gap-3.5">
                
                {/* Search Input bar */}
                <div className="relative flex items-center bg-brand-sand/30 border border-brand-slate/10 rounded-2xl p-2.5">
                  <Search className="w-4 h-4 text-brand-slate shrink-0 ml-1" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? "Search AI lessons & glossary..."
                        : "Sabaq aur glossary dhoondo..."
                    }
                    className="w-full bg-transparent text-xs font-bold text-brand-charcoal outline-none placeholder:text-brand-slate/40 border-0 p-0 ml-2 focus:ring-0"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full hover:bg-brand-sand transition-colors text-brand-slate/60 hover:text-brand-charcoal cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filtered Search Results list */}
                <div className="max-h-[250px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
                  {searchQuery.trim() === '' ? (
                    <div className="py-8 text-center text-brand-muted flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-brand-slate/30 animate-pulse" />
                      <p className="text-xs font-bold">
                        {lang === 'en' ? "Type to search 12 interactive lessons!" : "Lafz likh kar 12 sabak mein dhoondo!"}
                      </p>
                      <span className="text-[10px] opacity-70">
                        {lang === 'en' ? "Try: RAG, Transformer, or Neural" : "Jaise ke: RAG, Neural network"}
                      </span>
                    </div>
                  ) : filteredSearchResults.length === 0 ? (
                    <div className="py-8 text-center text-brand-muted">
                      <p className="text-xs font-bold">
                        {lang === 'en' ? "No matching concepts found." : "Kuch nahi mila yaaron!"}
                      </p>
                    </div>
                  ) : (
                    filteredSearchResults.map((item, idx) => (
                      <button
                        key={item.id + '-' + idx}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full p-3 rounded-2xl border border-brand-slate/5 bg-white hover:bg-brand-sand/35 text-left transition-all flex gap-3 items-start cursor-pointer group focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
                      >
                        <div className="w-7 h-7 rounded-lg bg-brand-amber/10 border border-brand-amber/15 text-brand-amber flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                          {item.type === 'section' ? <Layers className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[8px] font-mono font-black text-brand-amber uppercase tracking-wider block">
                            {item.type === 'section' ? (lang === 'en' ? "Lesson Content" : "Sabak") : (lang === 'en' ? "Glossary Term" : "Mushkil Lafz")}
                          </span>
                          <h4 className="text-xs font-black text-brand-charcoal truncate mt-0.5">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-brand-slate line-clamp-2 mt-1 leading-relaxed">
                            {item.type === 'section' ? item.subtitle : item.definition}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-slate shrink-0 self-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Footer with Claymorphic Tip */}
            <div className="p-3 bg-brand-sand/40 border border-brand-slate/5 rounded-2xl text-[10px] text-brand-muted shrink-0 flex items-center gap-2">
              <span className="text-sm">💡</span>
              <p className="leading-snug">
                {lang === 'en' 
                  ? "RAG helps models talk with 100% accuracy by reading reliable reference files!" 
                  : "Miya RAG use karne se model bina feke bilkul pakka sacha jawaab deta hai!"}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Trigger Button */}
      <div className="relative flex items-center justify-end">
        
        {/* Resting Speech Bubble Hint */}
        <AnimatePresence>
          {showSpeechBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 15 }}
              onClick={() => setIsOpen(true)}
              className="absolute right-15 bg-white border-2 border-brand-amber/30 rounded-2xl p-2.5 shadow-xl max-w-[190px] text-right pointer-events-auto cursor-pointer select-none"
            >
              <div className="flex gap-1.5 items-center justify-end">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0 animate-pulse" />
                <span className="block font-mono text-[8px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Clay is online:" : "Clay bolra:"}
                </span>
              </div>
              <p className="text-[11px] font-bold text-brand-charcoal leading-tight text-right mt-0.5">
                {lang === 'en' ? "Ask questions & play audio guides!" : "Poochho aur poore guides suno!"}
              </p>
              {/* Speech bubble arrow */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-2.5 bg-white border-r-2 border-t-2 border-brand-amber/30 rotate-[45deg]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Claymorphic Trigger Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08, rotate: isOpen ? -90 : -4 }}
          whileTap={{ scale: 0.95 }}
          className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative group pointer-events-auto border-2 ${
            isOpen || isPlaying
              ? "bg-[#FDFBF7] border-brand-amber text-brand-amber shadow-brand-amber/25"
              : "bg-[#FDFBF7] hover:bg-[#F6F2EA] border-brand-amber/30 text-brand-charcoal"
          }`}
          title={lang === 'en' ? "Clay's Assistant Hub" : "Clay se Poochho aur Suno"}
        >
          {/* Main Logo */}
          <div className="group-hover:scale-110 transition-transform duration-300">
            <ClayLogo size={36} />
          </div>

          {/* Sparkly Status indicator badge */}
          <span className={`absolute -top-1 -right-1 p-0.5 rounded-full border border-white shadow-sm text-white ${
            isPlaying ? "bg-brand-amber animate-pulse" : "bg-brand-amber"
          }`}>
            <HelpCircle className="w-3 h-3 stroke-[2.5]" />
          </span>

          {/* Glowing pulse indicator when reading */}
          {isPlaying && (
            <span className="absolute -inset-1.5 rounded-full border-2 border-brand-amber opacity-40 animate-ping pointer-events-none" />
          )}
        </motion.button>
      </div>

    </div>
  );
}
