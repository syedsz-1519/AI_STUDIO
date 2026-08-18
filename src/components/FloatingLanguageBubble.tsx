import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { Languages, X, Check } from 'lucide-react';

export default function FloatingLanguageBubble() {
  const { lang, setLang } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);

  const languagesList: { code: Language; name: string; nativeName: string; tag: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English (Original)', tag: 'EN' },
    { code: 'hyd', name: 'Hyderabadi', nativeName: 'హైదరాబాదీ (Urdu)', tag: 'HYD' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)', tag: 'TEL' },
  ];

  const handleLanguageSelect = (code: Language) => {
    setLang(code);
    setShowMenu(false);
  };

  const cycleNextLanguage = () => {
    if (lang === 'en') setLang('hyd');
    else if (lang === 'hyd') setLang('te');
    else setLang('en');
  };

  return (
    <div className="fixed bottom-[88px] right-[26px] z-40 flex items-center gap-3 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-center gap-3 relative">
        {/* Language Selection Menu Dropdown */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              className="absolute right-14 bottom-0 bg-[#FDFBF7] border-2 border-brand-amber/30 rounded-2xl p-2 shadow-2xl w-56 pointer-events-auto backdrop-blur-md"
            >
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-brand-charcoal/5 mb-1.5">
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-brand-amber flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'భాషను ఎంచుకోండి' : lang === 'hyd' ? 'Zabaan Chuno' : 'Choose Language'}</span>
                </span>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-1 rounded-full text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/50 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {languagesList.map((item) => {
                  const isCurrent = lang === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageSelect(item.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-brand-amber text-white shadow-sm font-bold'
                          : 'hover:bg-brand-sand/60 text-brand-charcoal font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isCurrent ? 'bg-white/25 text-white' : 'bg-brand-sand text-brand-slate'
                        }`}>
                          {item.tag}
                        </span>
                        <span className="text-xs">{item.nativeName}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Action Button */}
        <motion.button
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          onDoubleClick={cycleNextLanguage}
          whileHover={{ scale: 1.1, rotate: 6 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: [0, -4, 0],
          }}
          transition={{ 
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
          className="w-12 h-12 bg-white hover:bg-brand-sand/30 border-2 border-[#E07A5F] text-[#E07A5F] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer relative group"
          title={lang === 'en' ? "Language: English (Click to change)" : lang === 'te' ? "భాష: తెలుగు (మార్చడానికి క్లిక్ చేయండి)" : "Zabaan: Hyderabadi (Badalne ke liye dabbao)"}
        >
          <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Quick Language Indicator Tag */}
          <span className="absolute -top-1.5 -right-1.5 bg-[#E07A5F] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-sm font-mono uppercase">
            {lang === 'en' ? 'EN' : lang === 'te' ? 'TEL' : 'HYD'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

