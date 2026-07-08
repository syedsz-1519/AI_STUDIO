import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, Theme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { Palette, Sun, Moon, Flame, Droplets, Sparkles, Check } from 'lucide-react';

export default function FloatingThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themesInfo: { id: Theme; nameEn: string; nameHyd: string; descEn: string; descHyd: string; icon: any; colorClass: string; accentColor: string }[] = [
    {
      id: 'sand',
      nameEn: 'Desert Sand',
      nameHyd: 'Chicha Sand',
      descEn: 'Warm sand and solar amber vibes',
      descHyd: 'Pyaara garam sun-burnt theme',
      icon: Sun,
      colorClass: 'bg-[#F5F2ED] border-[#EBE7E0]',
      accentColor: '#d97706'
    },
    {
      id: 'deep-blue',
      nameEn: 'Deep Blue',
      nameHyd: 'Royal Blue',
      descEn: 'Calm oceanic blue and slate',
      descHyd: 'Ekdam thanda neela paani theme',
      icon: Droplets,
      colorClass: 'bg-[#1E293B] border-[#0F172A]',
      accentColor: '#3B82F6'
    },
    {
      id: 'deep-night',
      nameEn: 'Deep Night',
      nameHyd: 'Kaali Raat',
      descEn: 'Obsidian dark mode for night read',
      descHyd: 'Aankh pe thandak, zero brightness',
      icon: Moon,
      colorClass: 'bg-[#18181B] border-[#09090B]',
      accentColor: '#F59E0B'
    },
    {
      id: 'red-light',
      nameEn: 'Red Light',
      nameHyd: 'Lal Tamatar',
      descEn: 'Warm glowing neon red aesthetic',
      descHyd: 'Garam laal tamatar neon roshni',
      icon: Flame,
      colorClass: 'bg-[#FFE4E6] border-[#FFF5F5]',
      accentColor: '#E11D48'
    }
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // Play a procedurally synthesized tone if AudioContext is allowed
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      // Vary frequency based on theme for organic feel
      const freqs = { sand: 523.25, 'deep-blue': 587.33, 'deep-night': 440.00, 'red-light': 659.25 };
      osc.frequency.setValueAtTime(freqs[newTheme] || 440, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be blocked or unsupported; ignore silently
    }
  };

  const activeThemeObj = themesInfo.find(t => t.id === theme) || themesInfo[0];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="mb-1 w-72 p-4 bg-brand-cream/95 backdrop-blur-xl border-2 border-brand-charcoal/10 rounded-2xl shadow-2xl relative flex flex-col gap-3.5 z-50 overflow-hidden"
          >
            {/* Skeuomorphic Glass header card */}
            <div className="flex items-center gap-2 border-b border-brand-charcoal/5 pb-2.5">
              <Palette className="w-4.5 h-4.5 text-brand-amber shrink-0 animate-spin-slow" />
              <div>
                <span className="block font-mono text-[9px] font-bold text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? 'STYLE & SCHEME' : 'THEME BADLO'}
                </span>
                <span className="text-[11.5px] font-bold text-brand-charcoal leading-tight block">
                  {lang === 'en' ? 'Choose Visual Palette' : 'Khaas Palette Chuno'}
                </span>
              </div>
            </div>

            {/* List of custom themes */}
            <div className="flex flex-col gap-2">
              {themesInfo.map((tInfo) => {
                const IsActive = tInfo.id === theme;
                const IconComp = tInfo.icon;
                return (
                  <button
                    key={tInfo.id}
                    onClick={() => handleThemeChange(tInfo.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer relative overflow-hidden group ${
                      IsActive 
                        ? 'bg-brand-amber/10 border-brand-amber/40 shadow-sm' 
                        : 'bg-white/40 hover:bg-white/95 border-brand-charcoal/5 hover:border-brand-charcoal/10'
                    }`}
                  >
                    {/* Circle preview container */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-inner shrink-0 ${tInfo.colorClass}`}>
                      <IconComp className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color: tInfo.accentColor }} />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-charcoal">
                          {lang === 'en' ? tInfo.nameEn : tInfo.nameHyd}
                        </span>
                        {IsActive && (
                          <Check className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-brand-muted block font-medium leading-normal mt-0.5">
                        {lang === 'en' ? tInfo.descEn : tInfo.descHyd}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Speech arrow */}
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-brand-cream border-r-2 border-b-2 border-brand-charcoal/10 rotate-[45deg]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: -8 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-white hover:bg-brand-sand/30 border-2 border-brand-amber text-brand-amber rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer relative group"
        title={lang === 'en' ? 'Toggle Theme / Palette' : 'Theme badlo yaaron'}
      >
        <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Dynamic Badge indicating selected Theme */}
        <span className="absolute -top-1.5 -right-1.5 bg-brand-amber text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-sm font-mono uppercase">
          {theme === 'sand' ? 'SAND' : theme === 'deep-blue' ? 'BLUE' : theme === 'deep-night' ? 'DARK' : 'RED'}
        </span>
      </motion.button>
    </div>
  );
}
