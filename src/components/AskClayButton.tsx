import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';

export default function AskClayButton() {
  const { lang } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  // Briefly show tooltip at start to draw attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    const autoHide = setTimeout(() => {
      setShowTooltip(false);
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoHide);
    };
  }, []);

  const handleClick = () => {
    // Open global Search / Question Modal
    window.dispatchEvent(new CustomEvent('clay_open_search'));
  };

  return (
    <div className="fixed bottom-6 right-52 sm:right-56 z-40 flex items-center gap-2 select-none">
      <div className="relative flex items-center justify-end">
        
        {/* Claymorphic Interactive Speech Bubble */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 15 }}
              className="absolute right-14 bg-white border-2 border-brand-amber/30 rounded-2xl p-2.5 shadow-xl max-w-[180px] text-right pointer-events-auto cursor-pointer"
              onClick={handleClick}
            >
              <div className="flex gap-1.5 items-center justify-end">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0 animate-pulse" />
                <span className="block font-mono text-[8px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Clay is online:" : "Clay bolra:"}
                </span>
              </div>
              <p className="text-[11px] font-bold text-brand-charcoal leading-tight text-right mt-0.5">
                {lang === 'en' ? "Ask me anything!" : "Poochho yaaron!"}
              </p>
              {/* Arrow */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-2.5 bg-white border-r-2 border-t-2 border-brand-amber/30 rotate-[45deg]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          className="w-13 h-13 bg-[#FDFBF7] hover:bg-[#F6F2EA] border-2 border-brand-amber text-brand-charcoal rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer relative group pointer-events-auto"
          title={lang === 'en' ? "Ask Clay a Question" : "Clay se Sawaal Poochho"}
        >
          {/* Main Logo */}
          <div className="group-hover:scale-110 transition-transform duration-300">
            <ClayLogo size={36} />
          </div>

          {/* Sparkly Help Indicator badge */}
          <span className="absolute -top-1 -right-1 bg-brand-amber text-white p-0.5 rounded-full border border-white shadow-sm">
            <HelpCircle className="w-3 h-3 stroke-[2.5]" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
