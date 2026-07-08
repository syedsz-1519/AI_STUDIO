import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Square, Headphones, ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import { sanitizeAudioText, validateLanguage, isAudioTextSafe } from '../lib/sanitize';
import ClayLogo from './ClayLogo';

interface SectionContent {
  id: string;
  title: string;
  text: string;
}

export default function AudioNarrationHub() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('all');
  const [isBlinking, setIsBlinking] = useState(false);

  // Sync state with global speech synthesis status
  useEffect(() => {
    const checkState = setInterval(() => {
      setIsPlaying(audioEngine.isCurrentlySpeaking());
    }, 500);

    audioEngine.setSpeakStateListener((speaking) => {
      setIsPlaying(speaking);
    });

    return () => clearInterval(checkState);
  }, []);

  // Handle eyes blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  const sections: SectionContent[] = [
    {
      id: 'all',
      title: lang === 'en' ? 'Full Website Audio Guide' : 'Puri Website Ki Audio Guide',
      text: lang === 'en' 
        ? "Welcome! I'm Clay, your tactile explainer. Let me guide you through everything on this website. Artificial Intelligence is the broad concept of teaching machines to learn from examples. Inside it, we find Machine Learning, which uses mathematical algorithms to recognize patterns. Nested even deeper is Deep Learning, utilizing layered neural networks inspired by human brains. At the very center lies Generative AI, creating brand new content, powered by Large Language Models like Gemini. We can use these tools via clever prompts and Retrieval-Augmented Generation to get precise, factual answers."
        : "Assalamu Alaikum! Main hoon Clay, tumhara tactile explainer. Mujhe dekho puri website ko samjhate hain. Artificial Intelligence matlab machine ko seekhana ki wo examples se patterns dhoondun. Usme Machine Learning hai jo ganit se patterns pehchhanta hai. Aur deeper jao to Deep Learning hai jo neural networks use karta hai. Bilkul center mein Generative AI hai jo nayi content banata hai, Large Language Models ki help se. Humm isko prompts aur RAG se use karke bilkul sahi jawab paa sakte hain."
    },
    {
      id: 'basics',
      title: lang === 'en' ? '1. What is AI?' : '1. AI Kya Hai?',
      text: lang === 'en'
        ? "Artificial Intelligence means designing computers that can learn and solve problems by recognizing patterns, rather than just executing manual rules written by programmers. In the traditional programming era, developers had to write step-by-step logic. Now, with AI, we feed the system thousands of examples, allowing it to calculate its own pathways to predict, classify, and create."
        : "Artificial Intelligence yaani computer ko seekhana ta wo examples se patterns dhoondun aur khud se decisions le saken. Pehle programmer ko hath se har rule likhna padta tha. Ab to humm hazaaron examples dete hain aur machine khud seekh jaata hai predict karne, sort karne, aur naye cheezen banane ke liye."
    },
    {
      id: 'family-tree',
      title: lang === 'en' ? '2. The AI Family Tree' : '2. AI Ka Parivaar',
      text: lang === 'en'
        ? "To understand AI, we can picture nested Russian dolls. The outermost doll is Artificial Intelligence, the overall field. Inside is Machine Learning, which trains on data to make decisions. Nesting further is Deep Learning, which models multi-layered neural networks. Finally, at the core is Generative AI, which specializes in synthesizing new text, images, and creative media from instructions."
        : "AI ko samjhne ke liye Russian dolls socho, ek ke andar ek. Sabse bahar Artificial Intelligence hai, poora domain. Usme Machine Learning hai jo data se seekhta hai. Aur deeper Machine Learning ke andar Deep Learning hai jo neural networks use karta hai. Bilkul center mein Generative AI hai jo new content banata hai - likhi so baatain, tasveerein, sab kuch."
    },
    {
      id: 'gen-ai',
      title: lang === 'en' ? '3. Generative AI & LLMs' : '3. Generative AI aur Language Models',
      text: lang === 'en'
        ? "Generative AI can create original content. It is powered by Large Language Models which are trained on vast oceans of text. These models break language into small tokens, calculating which word or phrase is most likely to come next. It's a continuous, mathematical prediction loop of incredible scale."
        : "Generative AI original content bana sakta hai - likhe so baatain, images, sab. Ye Large Language Models se chalte hain jo hazaaron kitaab aur websites par trained hain. Ye har word ko token banate hain aur calculate karte hain ki agle word kaun sa hona chahiye. Ye sab ganit aur probability ka khel hai."
    },
    {
      id: 'prompting',
      title: lang === 'en' ? '4. Prompting & RAG' : '4. Prompts aur RAG',
      text: lang === 'en'
        ? "We interact with LLMs using prompts. Prompting is a craft: giving context, roles, and instructions. To make answers highly accurate and prevent hallucinations, we use Retrieval-Augmented Generation, or RAG. It fetches fresh, reliable documents from a secure database and appends them to your prompt, so the AI reads the correct reference before drafting its reply."
        : "LLM ke saath hum prompts se baat karte hain. Prompt likha to context likhi, role likhi, instructions likhi. Sahi jawab pane ke liye hum RAG use karte hain - ye secure database se sahi documents nikalta hai aur AI ko dikhata hai, phir AI sahi jawab deta hai. Hallucinationz nahi aate iss tarah."
    },
    {
      id: 'glossary',
      title: lang === 'en' ? '5. Collapsible Glossary' : '5. Technical Shabdkosh',
      text: lang === 'en'
        ? "Our interactive glossary breaks down core terms simply. Neural networks are layers of nodes that filter signals to recognize features. Hallucinations are confident but incorrect predictions made by models due to pattern gaps. Tokens are word fragments representing numerical semantic values."
        : "Humhara glossary technical words ko asaan karta hai. Neural networks matlab layers of nodes jo signals ko filter karte hain. Hallucinations yaani jab AI confident hote hue galat jawab de. Tokens yaani word ke pieces jo numbers represent karte hain."
    }
  ];

  const handlePlay = () => {
    if (isPlaying) {
      audioEngine.stopSpeaking();
      setIsPlaying(false);
    } else {
      const selected = sections.find(s => s.id === activeSectionId) || sections[0];
      
      // Security: Validate and sanitize text before audio narration
      if (!selected || !selected.text) {
        console.error('[AudioNarrationHub] No text content available');
        return;
      }

      if (!isAudioTextSafe(selected.text)) {
        console.error('[AudioNarrationHub] Text content failed security check');
        return;
      }

      const sanitizedText = sanitizeAudioText(selected.text);
      const validatedLang = validateLanguage(lang);

      audioEngine.speak(sanitizedText, () => {
        setIsPlaying(false);
      }, validatedLang);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    audioEngine.stopSpeaking();
    setIsPlaying(false);
  };

  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel w-80 sm:w-96 rounded-3xl p-6 border-brand-amber/20 shadow-2xl mb-3 flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Ambient clay texture overlay */}
            <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-slate/5 pb-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-brand-amber" />
                <span className="font-display text-sm font-extrabold text-brand-charcoal">Clay's Audio Guide Hub</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber uppercase tracking-wider font-mono">
                  {lang === 'en' ? 'EN' : 'HYD'}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-brand-slate hover:text-brand-charcoal cursor-pointer"
              >
                Minimize
              </button>
            </div>

            {/* Clay's Character Status Panel */}
            <div className={`flex gap-4 items-center p-3.5 rounded-2xl border transition-all duration-500 ${
              isPlaying 
                ? "bg-brand-amber/5 border-brand-amber/25 shadow-[inset_0_2px_4px_rgba(217,119,6,0.05)]" 
                : "bg-brand-sand/30 border-brand-slate/5"
            }`}>
              {/* Cute mini-Clay avatar with animated speech indicators */}
              <div className="w-16 h-16 rounded-2xl bg-[#EBE7E0]/50 relative flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                <motion.div 
                  animate={{ 
                    y: isPlaying ? [0, -3, 0] : 0,
                    scale: isPlaying ? [1, 1.03, 0.97, 1] : 1
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  className="z-10"
                >
                  <ClayLogo size={44} />
                </motion.div>
                
                {/* Simulated headphones band */}
                <div className="absolute top-1.5 w-11 h-6 border-t-2 border-brand-slate rounded-t-full pointer-events-none opacity-40 z-20" />

                {/* Animated speech waves if playing */}
                {isPlaying && (
                  <div className="absolute bottom-1 flex gap-0.5 items-end justify-center w-full z-20">
                    <span className="w-1 h-2.5 bg-brand-amber rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-brand-amber rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-brand-amber rounded-full animate-pulse delay-150" />
                  </div>
                )}
              </div>

              <div>
                <span className="font-display text-xs font-bold block text-brand-charcoal flex items-center gap-1.5">
                  {isPlaying ? "Clay is Speaking..." : "Clay is Idle"}
                  {isPlaying && <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-amber animate-ping" />}
                </span>
                <span className="text-[10px] text-brand-muted block mt-0.5 leading-snug">
                  {isPlaying ? "Reading active section aloud. Voice rate calibrated." : "Select a section below and tap play to listen."}
                </span>
              </div>
            </div>

            {/* Dropdown Select Section */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted font-mono">
                Select Narrative Section
              </label>
              <select
                value={activeSectionId}
                onChange={(e) => {
                  setActiveSectionId(e.target.value);
                  if (isPlaying) {
                    audioEngine.stopSpeaking();
                    setIsPlaying(false);
                  }
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-brand-slate/10 bg-white text-brand-charcoal outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-colors cursor-pointer"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Controller Buttons */}
            <div className="flex gap-2.5 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlay}
                className={`flex-grow flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer ${
                  isPlaying 
                    ? "bg-brand-amber text-white shadow-brand-amber/30 ring-2 ring-brand-amber-light ring-offset-1" 
                    : "bg-brand-amber hover:bg-brand-amber-dark text-white shadow-brand-amber/15"
                }`}
              >
                {isPlaying ? (
                  <div className="flex gap-0.75 items-end h-3.5 w-3.5 mr-1">
                    <motion.span animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-0.5 bg-white rounded-full" />
                    <motion.span animate={{ height: [10, 4, 10] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }} className="w-0.5 bg-white rounded-full" />
                    <motion.span animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }} className="w-0.5 bg-white rounded-full" />
                    <motion.span animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.45 }} className="w-0.5 bg-white rounded-full" />
                  </div>
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>{isPlaying ? "Pause Clay's Voice" : "Read Active Section"}</span>
              </motion.button>
              
              {isPlaying && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStop}
                  className="flex items-center justify-center p-3 bg-brand-sand/60 hover:bg-brand-amber-light text-brand-charcoal hover:text-brand-amber rounded-xl border border-brand-slate/10 hover:border-brand-amber/30 cursor-pointer transition-all duration-300"
                  title="Stop"
                >
                  <Square className="w-4 h-4 fill-current" />
                </motion.button>
              )}
            </div>

            {/* Text Preview box */}
            <div className="bg-white/50 p-3 rounded-xl border border-brand-slate/5 text-[11px] text-brand-muted max-h-24 overflow-y-auto leading-relaxed font-sans scrollbar-thin">
              <span className="font-bold text-brand-charcoal block mb-0.5">Reading Content:</span>
              {currentSection.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`backdrop-blur-md px-6 py-3.5 rounded-full flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer border select-none transition-all duration-300 ${
          isPlaying 
            ? "bg-brand-amber/10 border-brand-amber text-brand-amber shadow-[0_10px_25px_-5px_rgba(217,119,6,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)]" 
            : "bg-[#FDFBF7]/90 hover:bg-[#F6F2EA]/95 border-brand-amber/20 text-brand-charcoal shadow-[0_10px_25px_-5px_rgba(211,98,64,0.06),0_8px_16px_-6px_rgba(211,98,64,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-brand-amber/40"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Headphones className={`w-4.5 h-4.5 ${isPlaying ? 'text-brand-amber' : 'text-brand-amber'} animate-bounce`} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-amber"></span>
            </span>
          )}
        </div>
        <span className="font-display text-xs font-bold text-brand-charcoal pr-0.5 tracking-tight flex items-center gap-1.5">
          {isOpen ? "Close Audio Helper" : "Clay's Voice Guide"}
          {isPlaying && (
            <span className="text-[9px] bg-brand-amber/20 text-brand-amber px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono font-extrabold animate-pulse">
              Live
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
