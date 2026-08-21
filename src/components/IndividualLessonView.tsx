import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  Compass, 
  Home, 
  Share2,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ListOrdered,
  Layers,
  Flame,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { LESSON_MODULES, type LessonModule } from './HomeCurriculumGrid';

// Import Section Subcomponents
import WhatIsAI from './WhatIsAI';
import ClayExplainer from './ClayExplainer';
import AIFamilyTree from './AIFamilyTree';
import GenerativeAI from './GenerativeAI';
import PromptingAndRAG from './PromptingAndRAG';
import AIToolsList from './AIToolsList';
import ClosingAndDeeper from './ClosingAndDeeper';
import InteractiveFlashcards from './InteractiveFlashcards';
import GoogleClassroomHub from './GoogleClassroomHub';
import AIArena from './AIArena';
import QuickTakeaway from './QuickTakeaway';
import CheckYourKnowledge from './CheckYourKnowledge';
import SocialShareSection from './SocialShareSection';

export interface SubTopic {
  id: string;
  titleEn: string;
  titleHyd: string;
  readMins: string;
}

export const LESSON_SUBTOPICS: Record<string, SubTopic[]> = {
  'what-is-ai': [
    { id: 'sub-foundations', titleEn: 'Pattern Logic vs Code', titleHyd: 'Pattern Logic vs Coding', readMins: '1 min' },
    { id: 'sub-analogizer', titleEn: 'Pocket AI Analogies', titleHyd: 'Rozmarra Misaalein', readMins: '1 min' },
    { id: 'sub-clay-host', titleEn: 'Meet Clay (AI Bot)', titleHyd: 'Clay se Milein', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'family-tree': [
    { id: 'sub-tree-overview', titleEn: 'AI & ML Family Tree', titleHyd: 'AI aur ML ka Shijra', readMins: '1 min' },
    { id: 'sub-paradigms', titleEn: 'Supervised vs Unsupervised', titleHyd: 'Supervised vs Unsupervised', readMins: '1 min' },
    { id: 'sub-synapses', titleEn: 'Deep Neural Synapses', titleHyd: 'Neural Network Synapse', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'generative-ai': [
    { id: 'sub-gen-intro', titleEn: 'Generative AI Foundation', titleHyd: 'Generative AI Buniyaad', readMins: '1 min' },
    { id: 'sub-next-token', titleEn: 'Next-Token Predictor', titleHyd: 'Next-Token Predictor', readMins: '1 min' },
    { id: 'sub-attention', titleEn: 'Transformer Attention', titleHyd: 'Transformers aur Attention', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
  ],
  'prompting-rag': [
    { id: 'sub-prompt-basics', titleEn: 'Prompting Fundamentals', titleHyd: 'Prompting ke Usool', readMins: '1 min' },
    { id: 'sub-few-shot', titleEn: 'Zero, Few-Shot & CoT', titleHyd: 'Few-Shot aur Chain-of-Thought', readMins: '1 min' },
    { id: 'sub-rag-arch', titleEn: 'RAG & Vector Retrieval', titleHyd: 'RAG aur Vector Database', readMins: '1.5 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'tools': [
    { id: 'sub-tools-dir', titleEn: 'Curated Software Directory', titleHyd: 'AI Tools Directory', readMins: '1.5 min' },
    { id: 'sub-categories', titleEn: 'Writing, Image, Code & Audio', titleHyd: 'Writing, Coding aur Audio', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
  ],
  'deeper': [
    { id: 'sub-12-concepts', titleEn: '12 Core Concepts', titleHyd: '12 Buniyadi Concepts', readMins: '2 min' },
    { id: 'sub-glossary', titleEn: 'Searchable Glossary (85+)', titleHyd: 'AI Glossary & Dictionary', readMins: '2 min' },
    { id: 'sub-ethics', titleEn: 'Ethics, Bias & Alignment', titleHyd: 'Ethics aur Safety', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'flashcards': [
    { id: 'sub-flash-deck', titleEn: 'Spaced Repetition Deck', titleHyd: 'Memory Flip Cards', readMins: '1.5 min' },
    { id: 'sub-flash-categories', titleEn: 'Category Filters', titleHyd: 'Category Filter', readMins: '1 min' },
    { id: 'sub-flash-stats', titleEn: 'Mastery Tracker', titleHyd: 'Mastery Score', readMins: '1 min' },
  ],
  'classroom-hub': [
    { id: 'sub-class-overview', titleEn: 'Classroom Coursework Hub', titleHyd: 'Coursework & Streams', readMins: '1 min' },
    { id: 'sub-badges', titleEn: 'Milestone Badges', titleHyd: 'Certified Badges', readMins: '1 min' },
    { id: 'sub-sync', titleEn: 'Sync & Share', titleHyd: 'Google Classroom Sync', readMins: '1 min' },
  ],
  'arena': [
    { id: 'sub-arena-intro', titleEn: 'Battleground Rules', titleHyd: 'Quiz ke Qawaid', readMins: '1 min' },
    { id: 'sub-arena-quiz', titleEn: 'Live Timed Challenge', titleHyd: 'Timed Challenge Quiz', readMins: '2 min' },
    { id: 'sub-arena-leaderboard', titleEn: 'Streaks & Leaderboard', titleHyd: 'Leaderboard & Points', readMins: '1 min' },
  ]
};

interface IndividualLessonViewProps {
  lessonId: string;
  onBackToHome: () => void;
  onSelectLesson: (id: string) => void;
}

export default function IndividualLessonView({
  lessonId,
  onBackToHome,
  onSelectLesson
}: IndividualLessonViewProps) {
  const { lang } = useLanguage();

  const currentIndex = LESSON_MODULES.findIndex(m => m.id === lessonId);
  const currentModule = LESSON_MODULES[currentIndex >= 0 ? currentIndex : 0];
  const prevModule = currentIndex > 0 ? LESSON_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < LESSON_MODULES.length - 1 ? LESSON_MODULES[currentIndex + 1] : null;

  const subTopics = LESSON_SUBTOPICS[lessonId] || [
    { id: 'sub-main', titleEn: 'Main Lesson Content', titleHyd: 'Sabaq ka Mawad', readMins: '2 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '1 min' }
  ];

  const [activeSubTopicId, setActiveSubTopicId] = useState<string>(subTopics[0]?.id || '');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSubTopicMenuOpen, setIsSubTopicMenuOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSubTopicId(subTopics[0]?.id || '');
    setScrollProgress(0);
  }, [lessonId]);

  // ScrollSpy & Progress Calculation
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate overall progress for this lesson
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const current = window.scrollY;
        const progress = Math.min(100, Math.max(0, Math.round((current / totalScrollable) * 100)));
        setScrollProgress(progress);
      }

      // 2. Identify active sub-topic based on viewport position
      const scrollPosition = window.scrollY + 180;
      for (let i = subTopics.length - 1; i >= 0; i--) {
        const topic = subTopics[i];
        const el = document.getElementById(topic.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSubTopicId(topic.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [subTopics, lessonId]);

  const scrollToSubTopic = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // accounts for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSubTopicId(id);
      setIsSubTopicMenuOpen(false);
    }
  };

  const activeIndex = Math.max(0, subTopics.findIndex(t => t.id === activeSubTopicId));
  const activeSubTopic = subTopics[activeIndex] || subTopics[0];

  return (
    <div className="min-h-screen pt-16 pb-20 text-left">
      {/* 1. Sticky Sub-Topic Progress Navigation Bar */}
      <nav 
        aria-label="Sub-topic navigation"
        className="sticky top-14 sm:top-16 z-30 bg-white/90 backdrop-blur-md border-b border-brand-slate/15 shadow-xs transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Current Lesson & Subtopic Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBackToHome}
              className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-brand-muted hover:text-brand-amber transition-colors shrink-0 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Lessons</span>
            </button>

            <span className="hidden sm:inline text-brand-slate/30">/</span>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-md bg-brand-charcoal text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                0{currentModule.lessonNum}
              </span>
              
              <div className="truncate flex items-center gap-1 text-xs">
                <span className="font-bold text-brand-charcoal truncate">
                  {lang === 'en' ? currentModule.titleEn : currentModule.titleHyd}
                </span>
                <span className="text-brand-slate/40 hidden md:inline">•</span>
                <span className="text-[11px] font-mono text-brand-amber font-bold hidden md:inline truncate">
                  {lang === 'en' ? activeSubTopic.titleEn : activeSubTopic.titleHyd}
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right: Subtopic Pills & Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Horizontal Sub-Topic Pills */}
            <div className="hidden lg:flex items-center gap-1">
              {subTopics.map((topic, index) => {
                const isActive = topic.id === activeSubTopicId;
                const isPassed = index < activeIndex;
                return (
                  <button
                    key={topic.id}
                    onClick={() => scrollToSubTopic(topic.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-brand-charcoal text-white shadow-2xs scale-105'
                        : isPassed
                        ? 'bg-brand-sand/70 text-brand-charcoal hover:bg-brand-sand border border-brand-slate/10'
                        : 'text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/50'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="font-mono text-[9px] opacity-70">0{index + 1}</span>
                    )}
                    <span className="max-w-[130px] truncate">
                      {lang === 'en' ? topic.titleEn : topic.titleHyd}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile / Tablet Collapsible Sub-Topic Selector */}
            <div className="relative lg:hidden">
              <button
                onClick={() => setIsSubTopicMenuOpen(!isSubTopicMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-brand-sand/80 hover:bg-brand-sand border border-brand-slate/20 text-xs font-bold text-brand-charcoal transition-colors cursor-pointer"
              >
                <ListOrdered className="w-3.5 h-3.5 text-brand-amber" />
                <span className="text-[11px] font-mono">
                  {activeIndex + 1}/{subTopics.length}
                </span>
                <ChevronDown className={`w-3 h-3 text-brand-muted transition-transform ${isSubTopicMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSubTopicMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 p-2 bg-white rounded-2xl border border-brand-slate/20 shadow-xl z-50 space-y-1"
                  >
                    <div className="px-2 py-1 text-[10px] font-mono font-bold text-brand-muted uppercase border-b border-brand-slate/10 mb-1">
                      {lang === 'en' ? "Jump to Sub-Topic" : "Sabaq ke Hissay"}
                    </div>
                    {subTopics.map((topic, index) => {
                      const isActive = topic.id === activeSubTopicId;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => scrollToSubTopic(topic.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-brand-charcoal text-white'
                              : 'hover:bg-brand-sand text-brand-charcoal'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[10px] opacity-70">0{index + 1}</span>
                            <span className="truncate">{lang === 'en' ? topic.titleEn : topic.titleHyd}</span>
                          </div>
                          <span className="text-[9px] font-mono opacity-60 shrink-0 ml-1">{topic.readMins}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Next/Prev Subtopic Buttons */}
            <div className="flex items-center gap-0.5 border-l border-brand-slate/15 pl-2">
              <button
                disabled={activeIndex === 0}
                onClick={() => scrollToSubTopic(subTopics[activeIndex - 1].id)}
                className="p-1 rounded-lg text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous Sub-Topic"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={activeIndex === subTopics.length - 1}
                onClick={() => scrollToSubTopic(subTopics[activeIndex + 1].id)}
                className="p-1 rounded-lg text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Next Sub-Topic"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Subtopic / Lesson Scroll Progress Bar */}
        <div className="w-full h-0.5 bg-brand-slate/10 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-amber via-orange-500 to-amber-600 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Main Container with 2-Column Responsive Layout (Sticky Sidebar + Lesson Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Lesson Content Column (Col span 8 or 9) */}
          <main ref={contentRef} className="lg:col-span-8 xl:col-span-9 space-y-10">
            
            {/* Top Control Header & Breadcrumbs */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-slate/10">
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <button
                    onClick={onBackToHome}
                    className="flex items-center gap-1 hover:text-brand-amber font-bold transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "Home" : "Ghar"}</span>
                  </button>
                  <span>/</span>
                  <span className="font-semibold text-brand-slate">
                    {lang === 'en' ? "Lessons" : "Asbaaq"}
                  </span>
                  <span>/</span>
                  <span className="font-mono font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-md">
                    Lesson 0{currentModule.lessonNum}
                  </span>
                </div>

                <button
                  onClick={onBackToHome}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-xs font-bold shadow-2xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? "Back to All Lessons" : "Saare Sabaq Dekhein"}</span>
                </button>
              </div>

              {/* Lesson Hero Banner */}
              <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-brand-sand/40 to-brand-sand/70 border border-brand-amber/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-charcoal text-white font-mono text-[11px] font-black uppercase tracking-wider">
                      Lesson 0{currentModule.lessonNum}
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-amber uppercase tracking-wider">
                      {lang === 'en' ? currentModule.categoryEn : currentModule.categoryHyd}
                    </span>
                    <span className="text-brand-slate/40">•</span>
                    <span className="flex items-center gap-1 text-xs font-mono text-brand-muted">
                      <Clock className="w-3 h-3 text-brand-amber" />
                      <span>{currentModule.readTime}</span>
                    </span>
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-brand-charcoal tracking-tight">
                    {lang === 'en' ? currentModule.titleEn : currentModule.titleHyd}
                  </h1>

                  <p className="text-xs sm:text-sm text-brand-slate max-w-2xl leading-relaxed">
                    {lang === 'en' ? currentModule.subtitleEn : currentModule.subtitleHyd}
                  </p>
                </div>

                {/* Lesson Progress Badge */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-brand-amber/30 shrink-0 shadow-xs">
                  <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">
                    {lang === 'en' ? "Curriculum Progress" : "Course Progress"}
                  </span>
                  <span className="font-mono font-black text-2xl text-brand-amber mt-0.5">
                    {currentModule.lessonNum} / {LESSON_MODULES.length}
                  </span>
                  <div className="w-24 h-1.5 bg-brand-slate/15 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-brand-amber rounded-full transition-all duration-500"
                      style={{ width: `${(currentModule.lessonNum / LESSON_MODULES.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Topics Interactive Container */}
            <div className="space-y-12">
              {lessonId === 'what-is-ai' && (
                <div className="space-y-10">
                  <div id="sub-foundations" className="scroll-mt-24">
                    <WhatIsAI />
                  </div>
                  <div id="sub-analogizer" className="scroll-mt-24">
                    {/* Anchor wrapper for analogizer section */}
                  </div>
                  <div id="sub-clay-host" className="scroll-mt-24">
                    <ClayExplainer />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="what-is-ai" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="basics" />
                  </div>
                </div>
              )}

              {lessonId === 'family-tree' && (
                <div className="space-y-10">
                  <div id="sub-tree-overview" className="scroll-mt-24">
                    <AIFamilyTree />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="family-tree" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="family-tree" />
                  </div>
                </div>
              )}

              {lessonId === 'generative-ai' && (
                <div className="space-y-10">
                  <div id="sub-gen-intro" className="scroll-mt-24">
                    <GenerativeAI />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="generative-ai" />
                  </div>
                </div>
              )}

              {lessonId === 'prompting-rag' && (
                <div className="space-y-10">
                  <div id="sub-prompt-basics" className="scroll-mt-24">
                    <PromptingAndRAG />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="prompting-rag" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="prompting-rag" />
                  </div>
                </div>
              )}

              {lessonId === 'tools' && (
                <div className="space-y-10">
                  <div id="sub-tools-dir" className="scroll-mt-24">
                    <AIToolsList />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="tools" />
                  </div>
                </div>
              )}

              {lessonId === 'deeper' && (
                <div className="space-y-10">
                  <div id="sub-12-concepts" className="scroll-mt-24">
                    <ClosingAndDeeper />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="deeper" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="deeper" />
                  </div>
                </div>
              )}

              {lessonId === 'flashcards' && (
                <div className="space-y-10">
                  <div id="sub-flash-deck" className="scroll-mt-24">
                    <InteractiveFlashcards />
                  </div>
                </div>
              )}

              {lessonId === 'classroom-hub' && (
                <div className="space-y-10">
                  <div id="sub-class-overview" className="scroll-mt-24">
                    <GoogleClassroomHub />
                  </div>
                </div>
              )}

              {lessonId === 'arena' && (
                <div className="space-y-10">
                  <div id="sub-arena-intro" className="scroll-mt-24">
                    <AIArena />
                  </div>
                </div>
              )}
            </div>

            {/* Social Sharing Component at the End of Every Lesson */}
            <SocialShareSection currentChapterTitle={lang === 'en' ? currentModule.titleEn : currentModule.titleHyd} />

            {/* Bottom Lesson Pagination (Prev / Next) */}
            <div className="pt-8 border-t border-brand-slate/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevModule ? (
                <button
                  onClick={() => onSelectLesson(prevModule.id)}
                  className="w-full sm:w-auto flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-brand-sand border border-brand-slate/15 hover:border-brand-amber/40 text-left shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded-xl bg-brand-sand text-brand-charcoal group-hover:bg-brand-amber group-hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
                      {lang === 'en' ? "Previous Lesson" : "Pichla Sabaq"}
                    </span>
                    <span className="font-display text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                      0{prevModule.lessonNum}. {lang === 'en' ? prevModule.titleEn : prevModule.titleHyd}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextModule ? (
                <button
                  onClick={() => onSelectLesson(nextModule.id)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 p-4 rounded-2xl bg-white hover:bg-brand-sand border border-brand-slate/15 hover:border-brand-amber/40 text-right shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
                      {lang === 'en' ? "Next Lesson" : "Agla Sabaq"}
                    </span>
                    <span className="font-display text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                      0{nextModule.lessonNum}. {lang === 'en' ? nextModule.titleEn : nextModule.titleHyd}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-amber text-white group-hover:bg-amber-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={onBackToHome}
                  className="w-full sm:w-auto flex items-center gap-2 px-6 py-4 rounded-2xl bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'en' ? "Course Completed! Back to Overview" : "Mukammal Hua! Wapis Jayein"}</span>
                </button>
              )}
            </div>
          </main>

          {/* 2. Desktop Sticky Sidebar (TOC & Real-time Progress Monitor) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28 self-start space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-brand-slate/15 shadow-sm space-y-4">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-slate/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-brand-amber/15 text-brand-amber">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
                      {lang === 'en' ? "Lesson Outline" : "Sabaq ka Khaka"}
                    </span>
                    <span className="font-display text-xs font-bold text-brand-charcoal">
                      {subTopics.length} {lang === 'en' ? "Sub-Topics" : "Hissay"}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-black text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-md">
                  {scrollProgress}%
                </span>
              </div>

              {/* Progress Bar in Sidebar */}
              <div className="w-full h-1.5 bg-brand-slate/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-amber rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Step-by-Step Subtopics List */}
              <div className="space-y-1.5">
                {subTopics.map((topic, index) => {
                  const isActive = topic.id === activeSubTopicId;
                  const isPassed = index < activeIndex;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => scrollToSubTopic(topic.id)}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                        isActive
                          ? 'bg-brand-charcoal text-white shadow-xs font-bold scale-[1.02]'
                          : isPassed
                          ? 'bg-brand-sand/40 hover:bg-brand-sand text-brand-charcoal'
                          : 'text-brand-slate hover:bg-brand-sand/50 hover:text-brand-charcoal'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isPassed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-brand-amber text-white' : 'bg-brand-slate/15 text-brand-muted group-hover:bg-brand-slate/25'
                          }`}>
                            0{index + 1}
                          </span>
                        )}

                        <span className={`text-xs truncate ${isActive ? 'text-white' : 'text-brand-charcoal'}`}>
                          {lang === 'en' ? topic.titleEn : topic.titleHyd}
                        </span>
                      </div>

                      <span className={`text-[9.5px] font-mono shrink-0 ${
                        isActive ? 'text-brand-sand/70' : 'text-brand-muted'
                      }`}>
                        {topic.readMins}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Fast Jump Card / Shortcuts */}
              <div className="pt-3 border-t border-brand-slate/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    const quizEl = document.getElementById('sub-quiz') || document.getElementById('sub-takeaways');
                    if (quizEl) {
                      quizEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-sand/60 hover:bg-brand-sand text-xs font-bold text-brand-charcoal transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Jump to Quiz & Notes" : "Quiz par Jayein"}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                {nextModule && (
                  <button
                    onClick={() => onSelectLesson(nextModule.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-brand-amber transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Next: 0{nextModule.lessonNum}. {lang === 'en' ? nextModule.titleEn : nextModule.titleHyd}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
