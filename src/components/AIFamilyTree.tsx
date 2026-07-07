import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, HelpCircle, Layers, Fingerprint, Cpu } from 'lucide-react';
import { MLType } from '../types';
import TechTooltip from './TechTooltip';
import { useLanguage } from '../hooks/useLanguage';

export default function AIFamilyTree() {
  const { lang, t } = useLanguage();
  const [activeNestingLevel, setActiveNestingLevel] = useState<number>(0);

  const mlTypes: MLType[] = [
    {
      title: lang === 'en' ? 'Supervised Learning' : 'Supervised Learning (Ustad ke Sath)',
      analogy: lang === 'en' ? 'Learning with a guide' : 'Ustad ki help se seekhna',
      description: lang === 'en'
        ? 'You feed the machine labeled pictures (like "dog" or "cat") until it learns which visual clues match which label.'
        : 'Tum machine ko pehle se naam likhe so photo’aa dete (jaise "billi" ya "kutti"), jab tak ke wo sahi visual clues na pakad le.'
    },
    {
      title: lang === 'en' ? 'Unsupervised Learning' : 'Unsupervised Learning (Apne Aap)',
      analogy: lang === 'en' ? 'Sorting a wild pile' : 'Bina ustad ke dher jama karna',
      description: lang === 'en'
        ? 'The machine groups unlabeled data by itself, spotting hidden structures or similarities you might have missed.'
        : 'Machine bina naam diye so data ko khud ba khud groups mein daal deti hai patterns pakad ke.'
    },
    {
      title: lang === 'en' ? 'Reinforcement Learning' : 'Reinforcement Learning (Inaam waala)',
      analogy: lang === 'en' ? 'Trial, error, and treats' : 'Inaam aur sazaa ka khel',
      description: lang === 'en'
        ? 'The machine operates in a trial-and-error loop, earning points for correct moves (like teaching a dog with treats).'
        : 'Machine galti kar kar ke seekhti hai. Sahi kaam pe points milte (jaise kutte ko treat de ke seekhana).'
    }
  ];

  const nestingLevels = [
    {
      id: 0,
      title: lang === 'en' ? 'Artificial Intelligence (AI)' : 'Artificial Intelligence (AI)',
      description: lang === 'en'
        ? 'The broadest umbrella. Any technology that lets machines simulate human-like reasoning, matching, or puzzle-solving.'
        : 'Sabse bada umbrella. Koi bhi technology jo computer ko insaan ke jaisa dimaag lagane aur puzzle solve karne mein madad kare.',
      color: 'bg-brand-cream border-brand-charcoal/20 text-brand-charcoal'
    },
    {
      id: 1,
      title: lang === 'en' ? 'Machine Learning (ML)' : 'Machine Learning (ML)',
      description: lang === 'en'
        ? 'A subset of AI where computer systems learn rules directly from historical examples, bypassing hand-written code rules.'
        : 'AI ka wo hissa jahan computers hazaaro examples dekh ke rules khud ba khud likh lete hain.',
      color: 'bg-white border-brand-slate/20 text-brand-charcoal shadow-sm'
    },
    {
      id: 2,
      title: lang === 'en' ? 'Deep Learning (DL)' : 'Deep Learning (DL)',
      description: lang === 'en'
        ? 'A deeper layer of ML using stacked artificial "neural networks" to automatically master complex structures like human voices or faces.'
        : 'ML ka bohot gehra hissa jahan multi-layered networks (jaise insaani dimaag ke neurons) bade mushkil kaam jaise awaaz ya chehra pehchanna seekhte hain.',
      color: 'bg-brand-sand/60 border-brand-amber/15 text-brand-charcoal shadow-sm'
    },
    {
      id: 3,
      title: lang === 'en' ? 'Generative AI (GenAI)' : 'Generative AI (GenAI)',
      description: lang === 'en'
        ? 'The newest inner-core. AI systems trained on massive content maps to create entirely fresh images, writings, or audio tracks.'
        : 'Aaj kal ka naya inner core. Ye systems naye photos, gaane aur asaan articles khud se likh ke generate kar sakte hain.',
      color: 'bg-brand-amber/10 border-brand-amber/40 text-brand-amber shadow-sm'
    }
  ];

  return (
    <div id="family-tree" className="scroll-mt-16 bg-brand-sand/10 border-b border-brand-slate/5 py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">
            {lang === 'en' ? "Layer 02: Core Concepts" : "Layer 02: Khaas Concepts"}
          </span>
          <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mt-1 mb-3">
            {lang === 'en' ? "The AI Family Tree" : "AI ka Khandan (Family Tree)"}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
            {lang === 'en'
              ? "Many terms get thrown around like they mean the same thing. In reality, they are nested inside each other like Russian nesting dolls."
              : "Bohot saare log samjhte hain sab ka matlab ek hi hai. Par asal mein ye Russian nesting dolls ke jaise ek dusre ke andar nested hain."
            }
          </p>
        </div>

        {/* Nesting Interactive Diagram & Explanations (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          
          {/* Bento Card 1: Nested Diagram (Col Span 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised relative min-h-[440px]">
            <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="flex-grow flex items-center justify-center py-4">
              <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center select-none">
                {/* Animated nested structures */}
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* 1. Broadest AI Doll */}
                  <motion.div 
                    className="w-full h-full rounded-full skeuo-raised flex items-center justify-center p-6 bg-[#F5F2ED] relative cursor-pointer border border-brand-slate/10"
                    onClick={() => setActiveNestingLevel(0)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <span className="absolute top-2.5 font-bold text-[9px] tracking-wider text-brand-muted uppercase">Artificial Intelligence</span>
                    
                    {/* 2. Machine Learning Doll */}
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="w-full h-full rounded-full skeuo-pressed flex items-center justify-center p-5 cursor-pointer relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNestingLevel(1);
                      }}
                    >
                      <span className="absolute top-3 font-bold text-[8px] tracking-wider text-brand-muted uppercase">Machine Learning</span>

                      {/* 3. Deep Learning Doll */}
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full h-full rounded-full skeuo-raised flex items-center justify-center p-5 cursor-pointer border border-brand-amber/20 relative bg-white/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveNestingLevel(2);
                        }}
                      >
                        <span className="absolute top-3.5 font-bold text-[8px] tracking-wider text-brand-amber uppercase">Deep Learning</span>

                        {/* 4. Generative AI Doll */}
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-amber flex flex-col items-center justify-center p-1 cursor-pointer shadow-lg shadow-brand-amber/30 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNestingLevel(3);
                          }}
                        >
                          <span className="font-display text-[8px] sm:text-[9px] font-black text-white uppercase tracking-wider text-center leading-tight">Gen<br/>AI</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Float helper labels */}
                <div className="absolute -top-3 -left-3 text-[9px] font-bold text-brand-muted uppercase font-mono tracking-wider">
                  {lang === 'en' ? "Broad System" : "Bada System"}
                </div>
                <div className="absolute -bottom-3 -right-3 text-[9px] font-bold text-brand-amber uppercase font-mono tracking-wider">
                  {lang === 'en' ? "Inner Core" : "Main Core"}
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 justify-center mt-4">
              {nestingLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setActiveNestingLevel(level.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${activeNestingLevel === level.id ? 'bg-brand-amber text-white shadow-sm' : 'bg-[#F5F2ED] hover:bg-brand-sand text-brand-slate border border-brand-slate/15'}`}
                >
                  {level.id === 0 ? 'AI' : level.id === 1 ? 'ML' : level.id === 2 ? 'DL' : 'GenAI'}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Card 2: Interactive Display Details (Col Span 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNestingLevel}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-panel p-8 rounded-3xl border border-brand-slate/10 h-full flex flex-col justify-between relative overflow-hidden bg-white"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  {/* 3D-style Tactile Icon Tile */}
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                    {activeNestingLevel === 0 ? <Network className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" /> :
                     activeNestingLevel === 1 ? <Fingerprint className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" /> :
                     activeNestingLevel === 2 ? <Layers className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" /> :
                     <Cpu className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-xs font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full">Doll 0{activeNestingLevel + 1}</span>
                    <h3 className="font-display text-xl font-extrabold text-brand-charcoal">
                      {nestingLevels[activeNestingLevel].title}
                    </h3>
                  </div>
                  <p className="font-sans text-[14px] text-brand-charcoal leading-relaxed">
                    {nestingLevels[activeNestingLevel].description}
                  </p>
                </div>

                <div className="flex gap-4 text-[10px] font-mono text-brand-muted pt-4 border-t border-brand-slate/5 mt-6">
                  <span>{lang === 'en' ? "Interactive Map" : "Interactive Map"}</span>
                  <span>•</span>
                  <span>{lang === 'en' ? "Tap on circles or doll list to switch" : "Circles ya button dabaake change karo"}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* What is Machine Learning? Deep-dive (Bento Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          
          {/* Bento Card 3: ML Definition (Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised flex flex-col justify-between"
          >
            <div>
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <Network className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono block mb-2">
                {lang === 'en' ? "Lesson 04" : "Sabak 04"}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mb-4">
                {lang === 'en' ? "What is Machine Learning (ML)?" : "Machine Learning (ML) Kya hai?"}
              </h3>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] mb-6">
                {lang === 'en' ? (
                  <>
                    <TechTooltip term="Machine Learning">Machine Learning</TechTooltip> — <span className="text-brand-slate italic">a subset of AI where computers analyze thousands of examples to find patterns instead of following rigid programmed rules</span> — allows software to improve on its own. Rather than hand-coding a rule like "if a pixel is green, it's a leaf," we feed the system 100,000 photos of forests and let the algorithm write its own equations.
                  </>
                ) : (
                  <>
                    <strong className="text-brand-amber">Machine Learning</strong> — <span className="text-brand-slate italic">AI ka wo subset hai jahan computer rules seekhne ke liye bohot saare examples dekhta hai</span> — iski wajah se computer software khud behtar hota rehta hai. Pehle ke jaisa hand code nahi karna padta "agar green color hai toh patti bolo". Ab hum machine ko hazaaro jangal ki photos dedete hain aur wo khud apna dimaag lagake patti pehchanna seekh leta hai.
                  </>
                )}
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-l-4 border-brand-slate relative bg-brand-sand/20">
              <HelpCircle className="w-4 h-4 text-brand-slate absolute top-4 right-4 opacity-30" />
              <span className="font-mono text-[10px] font-bold text-brand-slate uppercase block mb-1">
                {lang === 'en' ? "How it feels" : "Ek aur Misaal"}
              </span>
              <p className="text-brand-charcoal text-xs leading-relaxed italic">
                {lang === 'en' ? (
                  `"Instead of cooking a dish by writing down a rigid list of steps, machine learning is like tasting a soup 500 times, adding a pinch of salt each time, until it matches the taste pattern of your memory."`
                ) : (
                  `"Shorba banane ke step-by-step rules likhne ke bajaye, machine learning 500 baar shorba chakhne ke jaisa hai. Har baar thoda namak dalke check karte, jab tak wo tumhare purane yaad so taste se dhang se match nahi ho jata!"`
                )}
              </p>
            </div>
          </motion.div>

          {/* Bento Card 4: Types of ML Cards (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {mlTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="skeuo-raised p-5 bg-white border border-brand-slate/10 rounded-2xl flex items-start gap-4 flex-grow justify-center"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-sand flex items-center justify-center shrink-0 border border-brand-slate/5 shadow-inner">
                  <span className="font-mono text-xs font-bold text-brand-amber">0{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-display text-xs sm:text-sm font-bold text-brand-charcoal flex items-center gap-1.5 flex-wrap">
                    {type.title}
                    <span className="text-[9px] font-sans font-medium text-[#E07A5F] px-2 py-0.5 bg-brand-sand/60 rounded-full border border-brand-slate/5">
                      {type.analogy}
                    </span>
                  </h4>
                  <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Deep Learning Definition (Bento Card 5, Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="skeuo-raised p-8 md:p-10 bg-white border border-brand-slate/10 rounded-3xl relative overflow-hidden"
        >
          {/* Abstract layered card visual depth */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-amber/5 blur-2xl pointer-events-none" />
          
          <div className="max-w-3xl">
            {/* 3D-style Tactile Icon Tile */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
              <Layers className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
            </div>

            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">
                {lang === 'en' ? "Lesson 05" : "Sabak 05"}
              </span>
            </div>
            
            <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mb-4">
              {lang === 'en' ? "What is Deep Learning (DL)?" : "Deep Learning (DL) Kya Hai?"}
            </h3>
            <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] md:text-[15px]">
              {lang === 'en' ? (
                <>
                  <TechTooltip term="Deep Learning">Deep Learning</TechTooltip> — <span className="text-brand-slate italic">a specialized kind of Machine Learning that uses layered mathematical structures called <TechTooltip term="Neural Networks">neural networks</TechTooltip> to capture highly complex relationships in images or sounds</span> — mimics how human brains process raw sights and noises. 
                </>
              ) : (
                <>
                  <strong className="text-brand-amber">Deep Learning</strong> — <span className="text-brand-slate italic">Machine Learning ka wo hissa hai jo mathematical layer patterns jise artificial neural networks bolte, usse awaaz aur photo’aa samajhta hai</span> — ye bilkul insaan ke dimaag ki tarah dher saari files process kar sakta hai.
                </>
              )}
            </p>
            <p className="font-sans text-brand-muted leading-relaxed text-xs sm:text-sm mt-3">
              {lang === 'en' ? (
                "By stacking these virtual neurons on top of each other, the program starts finding tiny patterns (like lines or shades) in the first layers, then combines them into shapes (like circles or ears) in the middle layers, and finally recognizes complete, high-level objects (like a faces, speech accents, or musical melodies) at the end."
              ) : (
                "Bohot saare virtual neurons ko layers mein set karke, computer pehli layer mein halki shading ya lakeerein pehchanta, phir beech ki layer mein shapes (jaise gole ya kaan) pehchanta, aur aakhir mein poora ka poora chehra, awaaz, ya dhang ka music pakad leta hai."
              )}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
