import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Headphones } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';

interface ClayVoiceToggleProps {
  isPlaying?: boolean;
  onLanguageChange?: (lang: 'en' | 'hyd') => void;
}

export default function ClayVoiceToggle({ isPlaying = false, onLanguageChange }: ClayVoiceToggleProps) {
  const { lang, setLang } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [showVoiceLabel, setShowVoiceLabel] = useState(false);

  // Test voice by speaking a greeting
  const handleVoiceChange = () => {
    const newLang = lang === 'en' ? 'hyd' : 'en';
    setLang(newLang);
    
    // Provide audio feedback
    const greetingText = newLang === 'en' 
      ? "Hello! Clay's voice is now in English."
      : "Sallam! Clay ki awaaz ab Hyderabadi mein hai.";
    
    if (!isMuted) {
      audioEngine.speak(greetingText, undefined, newLang);
    }
    
    onLanguageChange?.(newLang);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    audioEngine.stopSpeaking();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 sm:bottom-8 sm:right-8"
    >
      {/* Clay's Voice Guide Bubble */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <button
          onClick={handleVoiceChange}
          className="group relative px-4 py-2.5 bg-white border-2 border-brand-amber rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
          title={lang === 'en' ? "Switch to Hyderabadi Voice" : "Switch to English Voice"}
        >
          <Headphones className="w-4 h-4 text-brand-amber group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-brand-charcoal whitespace-nowrap">
            Clay{lang === 'en' ? ' 🇬🇧' : ' 🇮🇳'}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber uppercase tracking-wider font-mono">
            {lang === 'en' ? 'EN' : 'HYD'}
          </span>
        </button>

        {/* Hover Label */}
        <AnimatePresence>
          {showVoiceLabel && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-brand-charcoal text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg"
            >
              {lang === 'en' ? 'Switch to Hyderabadi' : 'Switch to English'}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-brand-charcoal" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mute Button */}
      <motion.button
        onClick={handleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 bg-white border-2 border-brand-slate/20 rounded-full shadow-lg hover:shadow-xl hover:border-brand-amber/30 transition-all duration-300 flex items-center justify-center group"
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-brand-slate group-hover:text-brand-amber transition-colors" />
        ) : (
          <Volume2 className="w-5 h-5 text-brand-amber group-hover:scale-110 transition-transform" />
        )}
      </motion.button>

      {/* Status Indicator */}
      {isPlaying && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-1 px-3 py-1 bg-white border border-brand-amber/30 rounded-full shadow-sm"
        >
          <div className="w-2 h-2 bg-brand-amber rounded-full animate-pulse" />
          <span className="text-[10px] font-semibold text-brand-amber">Playing</span>
        </motion.div>
      )}
    </motion.div>
  );
}
