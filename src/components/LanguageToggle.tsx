import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-brand-slate/10 shadow-sm relative z-50">
      <div className="p-1 text-brand-amber shrink-0 pl-1.5 pr-0.5">
        <Languages className="w-3.5 h-3.5" />
      </div>

      <div className="flex items-center relative">
        <button
          onClick={() => setLang('en')}
          className={`relative px-3 py-1.5 text-[10px] sm:text-[11px] font-display font-extrabold rounded-full transition-all cursor-pointer select-none z-10 active:scale-95 ${
            lang === 'en' ? 'text-white' : 'text-brand-muted hover:text-brand-charcoal'
          }`}
        >
          {lang === 'en' ? 'English' : 'English'}
          {lang === 'en' && (
            <motion.div
              layoutId="active_language_indicator"
              className="absolute inset-0 bg-[#E07A5F] rounded-full -z-10 shadow-sm"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        <button
          onClick={() => setLang('hyd')}
          className={`relative px-3 py-1.5 text-[10px] sm:text-[11px] font-display font-extrabold rounded-full transition-all cursor-pointer select-none z-10 active:scale-95 ${
            lang === 'hyd' ? 'text-white' : 'text-brand-muted hover:text-brand-charcoal'
          }`}
        >
          {lang === 'en' ? 'Hyderabadi (Roman Urdu)' : 'Hyderabadi (Roman Urdu)'}
          {lang === 'hyd' && (
            <motion.div
              layoutId="active_language_indicator"
              className="absolute inset-0 bg-[#E07A5F] rounded-full -z-10 shadow-sm"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
