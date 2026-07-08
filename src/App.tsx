import FloatingNav from './components/FloatingNav';
import Hero from './components/Hero';
import WhatIsAI from './components/WhatIsAI';
import ClayExplainer from './components/ClayExplainer';
import AIFamilyTree from './components/AIFamilyTree';
import GenerativeAI from './components/GenerativeAI';
import PromptingAndRAG from './components/PromptingAndRAG';
import AIToolsList from './components/AIToolsList';
import ClosingAndDeeper from './components/ClosingAndDeeper';
import AudioNarrationHub from './components/AudioNarrationHub';
import FloatingLanguageBubble from './components/FloatingLanguageBubble';
import { Compass, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import ClayLogo from './components/ClayLogo';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { lang } = useLanguage();
  const sectionAnimation = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      } 
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal selection:bg-brand-amber/10 selection:text-brand-amber font-sans antialiased overflow-x-hidden">
      {/* Translucent Navigation Layer */}
      <FloatingNav />

      {/* Floating Audio Guide for Clay */}
      <AudioNarrationHub />

      {/* Floating Language Change Bubble (Bottom Left) */}
      <FloatingLanguageBubble />

      {/* Main Narrative Scroll Flow */}
      <main className="relative z-10 flex flex-col gap-4">
        
        {/* Layer 1: Hero Intro */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <Hero />
        </motion.div>

        {/* Layer 1: The Basics (What is AI, pocket grid, stage horizons) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <WhatIsAI />
        </motion.div>

        {/* Interactive Host: Clay, the AI Explainer Bot */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <ClayExplainer />
        </motion.div>

        {/* Layer 2: Core Concepts (Circle Nest Map, ML definition + sub-types, Deep Learning) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <AIFamilyTree />
        </motion.div>

        {/* Layer 2: Generative AI & Large Language Models */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <GenerativeAI />
        </motion.div>

        {/* Layer 3: Practical Use (Prompting styles & Retrieval-Augmented Generation flow) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <PromptingAndRAG />
        </motion.div>

        {/* Curated AI Tools Directory */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <AIToolsList />
        </motion.div>

        {/* Layer 3 & 4: Closing, Future Outlook, and collapsible glossary terms */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <ClosingAndDeeper />
        </motion.div>

      </main>

      {/* Editorial Journal Styled Footer */}
      <footer className="bg-brand-sand/50 border-t border-brand-slate/10 py-16 relative z-10 text-left">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-brand-charcoal justify-start">
              <ClayLogo size={28} />
              <span>Simple <span className="text-brand-amber font-extrabold">AI</span></span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm text-left">
              {lang === 'en' 
                ? "An interactive, beginner-safe editorial journal dedicated to demystifying modern artificial intelligence, machine learning structures, and generative algorithms through clean visual logic."
                : "Miya, ye ek interactive aur boht aasan editorial journal hai jo modern AI, machine learning, aur generative systems ko boht saaf aur asaan zubaan mein samjhati hai."
              }
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
            <div>
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                {lang === 'en' ? "Narrative Path" : "Sabaq ka Rasta"}
              </h5>
              <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted text-left">
                <li><a href="#what-is-ai" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "1. The Basics" : "1. Shuruati Baatein"}</a></li>
                <li><a href="#family-tree" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "2. The Family Tree" : "2. Khandan ka Tree"}</a></li>
                <li><a href="#prompting-rag" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "3. Prompting & RAG" : "3. Prompting aur RAG"}</a></li>
                <li><a href="#deeper" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "4. Deep Dive Glossary" : "4. Gehra Glossary"}</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                {lang === 'en' ? "Topic Guides" : "Khaas Topics"}
              </h5>
              <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted text-left">
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Machine Learning</span></li>
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Deep Networks</span></li>
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Generative Logic</span></li>
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Prompt Engineering</span></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1 text-left">
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                {lang === 'en' ? "Journal Ethos" : "Khaas Baatein"}
              </h5>
              <div className="flex flex-col gap-2 text-xs text-brand-muted text-left">
                <span className="flex items-center gap-1 justify-start">
                  <Sparkles className="w-3 h-3 text-brand-amber shrink-0" />
                  <span>Tactile HUD v1.0</span>
                </span>
                <span className="flex items-center gap-1 justify-start">
                  <BookOpen className="w-3 h-3 text-brand-slate shrink-0" />
                  <span>{lang === 'en' ? "100% Beginner-Safe" : "Naye Seekhne Walo ke liye"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-brand-slate/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-brand-muted">
          <span>© 2026 Simple AI. By Syed Shahnawaz.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-amber transition-colors cursor-pointer">{lang === 'en' ? "Editorial Policies" : "Khaas Policies"}</span>
            <span className="hover:text-brand-amber transition-colors cursor-pointer">{lang === 'en' ? "Privacy Principles" : "Privacy ke Rules"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
