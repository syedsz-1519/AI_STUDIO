import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { Languages, X, Sparkles } from 'lucide-react';

export default function FloatingLanguageBubble() {
  const { lang, setLang } = useLanguage();
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  // Auto hide the speech bubble after 8 seconds of inactivity, but show again briefly on language swap
  useEffect(() => {
    setShowSpeechBubble(true);
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-end gap-3 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-end gap-3">
        {/* Animated Speech Bubble */}
        <AnimatePresence>
          {showSpeechBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              className="bg-[#FDFBF7] border-2 border-brand-charcoal/10 rounded-2xl p-3.5 shadow-xl max-w-[220px] text-left relative pointer-events-auto border-brand-amber/20"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowSpeechBubble(false)}
                className="absolute top-1.5 right-1.5 p-0.5 text-brand-muted hover:text-brand-charcoal rounded-full bg-brand-sand/30 hover:bg-brand-sand/60 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex gap-2 items-start mt-1">
                <Sparkles className="w-4.5 h-4.5 text-brand-amber shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="block font-mono text-[9px] font-bold text-brand-amber uppercase tracking-wider">
                    {lang === 'en' ? "Clay says:" : "Clay bolra:"}
                  </span>
                  <p className="text-[11.5px] font-medium text-brand-charcoal leading-relaxed pr-2">
                    {lang === 'en' 
                      ? "Arey Miya, Hyderabadi mein parhna hai? Tap below!" 
                      : "Miya, English mein parhna hai? Tap karo!"}
                  </p>
                </div>
              </div>

              {/* Speech arrow */}
              <div className="absolute bottom-4 -left-1.5 w-3 h-3 bg-[#FDFBF7] border-l-2 border-b-2 border-brand-charcoal/10 rotate-[45deg]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Action Button */}
        <motion.button
          onClick={() => {
            setLang(lang === 'en' ? 'hyd' : 'en');
            setShowSpeechBubble(true);
          }}
          whileHover={{ scale: 1.1, rotate: 12 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: [0, -6, 0],
          }}
          transition={{ 
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
          className="w-12 h-12 bg-white hover:bg-brand-sand/30 border-2 border-[#E07A5F] text-[#E07A5F] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer relative group"
          title={lang === 'en' ? "Switch to Hyderabadi" : "English mein badlo"}
        >
          <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Quick Language Indicator Tag */}
          <span className="absolute -top-1.5 -right-1.5 bg-[#E07A5F] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-sm font-mono uppercase">
            {lang === 'en' ? 'EN' : 'HYD'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
