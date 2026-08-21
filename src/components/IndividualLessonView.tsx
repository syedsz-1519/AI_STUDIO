import React, { useEffect } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonId]);

  return (
    <div className="min-h-screen pt-20 pb-20 text-left">
      {/* Top Breadcrumb & Control Header */}
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-slate/10">
          {/* Breadcrumb Navigation */}
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

          {/* Quick Back to All Lessons */}
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

          {/* Lesson Counter Progress Badge */}
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

      {/* Main Interactive Lesson Content */}
      <main className="max-w-5xl mx-auto space-y-12">
        {lessonId === 'what-is-ai' && (
          <div>
            <WhatIsAI />
            <ClayExplainer />
            <QuickTakeaway sectionId="what-is-ai" />
            <CheckYourKnowledge sectionId="basics" />
          </div>
        )}

        {lessonId === 'family-tree' && (
          <div>
            <AIFamilyTree />
            <QuickTakeaway sectionId="family-tree" />
            <CheckYourKnowledge sectionId="family-tree" />
          </div>
        )}

        {lessonId === 'generative-ai' && (
          <div>
            <GenerativeAI />
            <QuickTakeaway sectionId="generative-ai" />
          </div>
        )}

        {lessonId === 'prompting-rag' && (
          <div>
            <PromptingAndRAG />
            <QuickTakeaway sectionId="prompting-rag" />
            <CheckYourKnowledge sectionId="prompting-rag" />
          </div>
        )}

        {lessonId === 'tools' && (
          <div>
            <AIToolsList />
            <QuickTakeaway sectionId="tools" />
          </div>
        )}

        {lessonId === 'deeper' && (
          <div>
            <ClosingAndDeeper />
            <QuickTakeaway sectionId="deeper" />
            <CheckYourKnowledge sectionId="deeper" />
          </div>
        )}

        {lessonId === 'flashcards' && (
          <div>
            <InteractiveFlashcards />
          </div>
        )}

        {lessonId === 'classroom-hub' && (
          <div>
            <GoogleClassroomHub />
          </div>
        )}

        {lessonId === 'arena' && (
          <div>
            <AIArena />
          </div>
        )}

        {/* Social Sharing Component at the End of Every Lesson */}
        <SocialShareSection currentChapterTitle={lang === 'en' ? currentModule.titleEn : currentModule.titleHyd} />

        {/* Bottom Lesson Pagination (Prev / Next) */}
        <div className="px-6 pt-8 border-t border-brand-slate/10 flex flex-col sm:flex-row items-center justify-between gap-4">
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
    </div>
  );
}
