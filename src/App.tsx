import { useState, useEffect } from 'react';
import FloatingNav from './components/FloatingNav';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
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
// Floating Theme Toggle is now bundled inside Settings Control Center
import CheckYourKnowledge from './components/CheckYourKnowledge';
import AIArena from './components/AIArena';
import GoogleClassroomHub from './components/GoogleClassroomHub';
import InteractiveFlashcards from './components/InteractiveFlashcards';
import QuickTakeaway from './components/QuickTakeaway';
import AIMockInterviewer from './components/AIMockInterviewer';
import StudentDashboard from './components/StudentDashboard';
import AuthModal from './components/AuthModal';
import DidYouKnowNotification from './components/DidYouKnowNotification';
import { Compass, Sparkles, BookOpen, Video, TrendingUp, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClayLogo from './components/ClayLogo';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { lang } = useLanguage();
  const [currentView, setCurrentView] = useState<'guide' | 'interview' | 'dashboard'>('guide');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Listen to custom navigation events from FloatingNav or subcomponents
    const handleNavigateView = (e: CustomEvent<'guide' | 'interview' | 'dashboard'>) => {
      if (e.detail) {
        setCurrentView(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('clay_navigate_view' as any, handleNavigateView);

    // Smoothly scroll to elements when the hash in the address bar changes dynamically
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setCurrentView('guide');
        const targetId = hash.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('clay_navigate_view' as any, handleNavigateView);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
      {/* Persistent Scroll Progress Indicator at the Top of Screen */}
      <ScrollProgressIndicator />

      {/* Translucent Navigation Layer */}
      <FloatingNav />

      {/* Global Auth / Profile Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Floating Audio Guide for Clay (Only shown in guide view) */}
      {currentView === 'guide' && <AudioNarrationHub />}

      {/* Floating Language Change Bubble (Bottom Right) */}
      <FloatingLanguageBubble />

      {/* Contextual 'Did You Know' Floating AI Trivia Notification (Bottom Left) */}
      <DidYouKnowNotification currentView={currentView} />

      {/* Main Content Area: Switch between Guide, Mock Interviewer, and Student Dashboard */}
      {currentView === 'interview' && (
        <div className="pt-16 min-h-screen">
          <AIMockInterviewer
            onBackToGuide={() => {
              setCurrentView('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="pt-16 min-h-screen">
          <StudentDashboard
            onStartInterview={() => {
              setCurrentView('interview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigateSection={(secId) => {
              setCurrentView('guide');
              setTimeout(() => {
                const el = document.getElementById(secId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
          />
        </div>
      )}

      {currentView === 'guide' && (
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
          <QuickTakeaway sectionId="what-is-ai" />
          <CheckYourKnowledge sectionId="basics" />
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
          <QuickTakeaway sectionId="family-tree" />
          <CheckYourKnowledge sectionId="family-tree" />
        </motion.div>

        {/* Layer 2: Generative AI & Large Language Models */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <GenerativeAI />
          <QuickTakeaway sectionId="generative-ai" />
        </motion.div>

        {/* Layer 3: Practical Use (Prompting styles & Retrieval-Augmented Generation flow) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <PromptingAndRAG />
          <QuickTakeaway sectionId="prompting-rag" />
          <CheckYourKnowledge sectionId="prompting-rag" />
        </motion.div>

        {/* Curated AI Tools Directory */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <AIToolsList />
          <QuickTakeaway sectionId="tools" />
        </motion.div>

        {/* Layer 3 & 4: Closing, Future Outlook, and collapsible glossary terms */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <ClosingAndDeeper />
          <QuickTakeaway sectionId="deeper" />
          <CheckYourKnowledge sectionId="deeper" />
        </motion.div>

        {/* Interactive Flashcards Module - Reinforce Memory Retention */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <InteractiveFlashcards />
        </motion.div>

        {/* Google Classroom Hub - Synchronize learning tasks with real-world streams */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <GoogleClassroomHub />
        </motion.div>

        {/* AI Arena - Gamified Battleground Section (Moved to the last section) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <AIArena />
        </motion.div>

      </main>
      )}

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
                : lang === 'te'
                ? "కృత్రిమ మేధస్సు (AI), మెషిన్ లెర్నింగ్, మరియు జనరేటివ్ అల్గారిథమ్‌లను గణితం మరియు కష్టమైన పదాలు లేకుండా దృశ్య రూపంలో సులభంగా వివరించే సరళమైన ఇంటరాక్టివ్ గైడ్."
                : "Miya, ye ek interactive aur boht aasan editorial journal hai jo modern AI, machine learning, aur generative systems ko boht saaf aur asaan zubaan mein samjhati hai."
              }
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
            <div>
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                {lang === 'en' ? "Narrative Path" : lang === 'te' ? "పాఠ్య ప్రయాణం" : "Sabaq ka Rasta"}
              </h5>
              <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted text-left">
                <li><a href="#what-is-ai" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "1. The Basics" : lang === 'te' ? "1. ప్రాథమిక విషయాలు" : "1. Shuruati Baatein"}</a></li>
                <li><a href="#family-tree" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "2. The Family Tree" : lang === 'te' ? "2. ఫ్యామిలీ ట్రీ" : "2. Khandan ka Tree"}</a></li>
                <li><a href="#prompting-rag" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "3. Prompting & RAG" : lang === 'te' ? "3. ప్రాంప్టింగ్ & RAG" : "3. Prompting aur RAG"}</a></li>
                <li><a href="#deeper" className="hover:text-brand-amber transition-colors">{lang === 'en' ? "4. Deep Dive Glossary" : lang === 'te' ? "4. పదకోశం" : "4. Gehra Glossary"}</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                {lang === 'en' ? "Topic Guides" : lang === 'te' ? "ముఖ్య అంశాలు" : "Khaas Topics"}
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
                {lang === 'en' ? "Journal Ethos" : lang === 'te' ? "విశేషాలు" : "Khaas Baatein"}
              </h5>
              <div className="flex flex-col gap-2 text-xs text-brand-muted text-left">
                <span className="flex items-center gap-1 justify-start">
                  <Sparkles className="w-3 h-3 text-brand-amber shrink-0" />
                  <span>Tactile HUD v1.0</span>
                </span>
                <span className="flex items-center gap-1 justify-start">
                  <BookOpen className="w-3 h-3 text-brand-slate shrink-0" />
                  <span>{lang === 'en' ? "100% Beginner-Safe" : lang === 'te' ? "ప్రారంభకులకు 100% అనుకూలం" : "Naye Seekhne Walo ke liye"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-brand-slate/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-brand-muted">
          <span>© 2026 Clayverse AI. By Syed Shahnawaz.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-amber transition-colors cursor-pointer">{lang === 'en' ? "Editorial Policies" : lang === 'te' ? "విధానాలు" : "Khaas Policies"}</span>
            <span className="hover:text-brand-amber transition-colors cursor-pointer">{lang === 'en' ? "Privacy Principles" : lang === 'te' ? "గోప్యతా సూత్రాలు" : "Privacy ke Rules"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
