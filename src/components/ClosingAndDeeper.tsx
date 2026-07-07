import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  GraduationCap, 
  Search, 
  Check, 
  Trophy, 
  Calendar, 
  BookOpen, 
  HelpCircle,
  RefreshCw,
  Award,
  Compass
} from 'lucide-react';
import { roadmapSections, Section, Term } from '../data/roadmapTerms';
import ClayLogo from './ClayLogo';

export default function ClosingAndDeeper() {
  const [isOpen, setIsOpen] = useState(true); // Open by default to showcase the roadmap immediately
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedQuizzes, setRevealedQuizzes] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isDeeperDrawerOpen, setIsDeeperDrawerOpen] = useState(false);
  
  // Track checked terms in localStorage
  const [completedTerms, setCompletedTerms] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('clay_completed_terms');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('clay_completed_terms', JSON.stringify(completedTerms));
  }, [completedTerms]);

  // Compute stats
  const totalTermsCount = roadmapSections.reduce((acc, sec) => acc + sec.terms.length, 0);
  const completedCount = Object.values(completedTerms).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalTermsCount) * 100);

  const toggleTerm = (termTitle: string) => {
    setCompletedTerms(prev => ({
      ...prev,
      [termTitle]: !prev[termTitle]
    }));
  };

  const toggleQuiz = (sectionId: string) => {
    setRevealedQuizzes(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const resetProgress = () => {
    if (window.confirm('Reset all learned terms progress?')) {
      setCompletedTerms({});
    }
  };

  const checkAllInSection = (section: Section) => {
    const nextCompleted = { ...completedTerms };
    const allChecked = section.terms.every(t => completedTerms[t.title]);
    
    section.terms.forEach(t => {
      nextCompleted[t.title] = !allChecked;
    });
    setCompletedTerms(nextCompleted);
  };

  // Filter terms by search query
  const filteredResults: { section: Section; term: Term }[] = [];
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    roadmapSections.forEach(section => {
      section.terms.forEach(term => {
        if (
          term.title.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          section.title.toLowerCase().includes(query)
        ) {
          filteredResults.push({ section, term });
        }
      });
    });
  }

  return (
    <div id="deeper" className="scroll-mt-16 bg-white py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-amber/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-brand-slate/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Head Block with Clay Integration */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <div className="flex justify-center mb-5">
            <ClayLogo size={72} />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sand border border-brand-slate/10 rounded-full text-[11px] font-mono font-bold text-brand-slate mb-4">
            <Calendar className="w-3 h-3 text-brand-amber" />
            <span>Updated Roadmap: 6 July 2026</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-charcoal tracking-tight mb-4">
            85+ AI Terms Explained in Simple Words
          </h2>
          <p className="font-sans text-brand-slate text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A real learning path, not just a random dictionary. Start at the top, work your way down. Each of the 12 sections builds directly on the ones before it.
          </p>
        </div>

        {/* Global Progress Dashboard Widget (Tactile Bento Panel) */}
        <div className="max-w-4xl mx-auto mb-10 bg-[#F9F7F3] border-2 border-brand-charcoal/10 rounded-3xl p-6 sm:p-8 skeuo-raised relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-brand-amber" />
                <h3 className="font-display text-lg font-bold text-brand-charcoal">Your Interactive Study Progress</h3>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed max-w-md">
                Tick off terms as you scroll and read to master the AI ecosystem! Your progress is locally saved.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-brand-slate/10 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase font-bold text-brand-muted">Learned</span>
                  <span className="font-display text-base font-extrabold text-brand-charcoal">
                    {completedCount} <span className="font-normal text-xs text-brand-slate">/ {totalTermsCount} Terms</span>
                  </span>
                </div>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={resetProgress}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-brand-sand border border-brand-slate/10 rounded-xl text-xs font-bold text-brand-slate cursor-pointer transition-colors active:scale-95"
                  title="Reset learning checklist"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-brand-slate mb-2">
              <span>PROGRESS</span>
              <span className="text-brand-amber">{percentComplete}% MASTERED</span>
            </div>
            <div className="w-full h-3 bg-brand-sand border border-brand-slate/10 rounded-full overflow-hidden p-[2px] shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-brand-amber to-brand-amber-dark rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentComplete}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-slate" />
            <input
              type="text"
              placeholder="Search all 85+ terms instantly... (e.g., Transformer, RAG, Epoch)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border-2 border-brand-charcoal/10 rounded-2xl focus:border-brand-amber outline-none font-sans text-sm shadow-sm transition-all placeholder:text-brand-slate/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-brand-slate hover:text-brand-amber bg-brand-sand px-2 py-0.5 rounded border border-brand-slate/10"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS VIEW */}
        <AnimatePresence mode="wait">
          {searchQuery.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-mono font-bold text-brand-muted uppercase">
                  Search Results: found {filteredResults.length} matches
                </span>
              </div>

              {filteredResults.length === 0 ? (
                <div className="p-12 text-center bg-[#F9F7F3] border border-brand-slate/10 rounded-3xl">
                  <p className="text-brand-muted text-sm italic">
                    No terms found matching "{searchQuery}". Try looking up "transformer", "ML", or "agent".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResults.map(({ section, term }) => {
                    const isChecked = !!completedTerms[term.title];
                    return (
                      <div 
                        key={term.title}
                        onClick={() => toggleTerm(term.title)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 select-none ${isChecked ? 'bg-brand-amber/5 border-brand-amber/35 shadow-sm' : 'bg-[#F9F7F3] hover:bg-white border-brand-slate/10 hover:shadow-md'}`}
                      >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${isChecked ? 'bg-brand-amber border-brand-amber text-white' : 'bg-white border-brand-slate/25'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-display text-sm font-bold text-brand-charcoal">{term.title}</h4>
                            <span className="text-[9px] font-mono font-bold bg-brand-sand border border-brand-slate/10 text-brand-slate px-1.5 py-0.5 rounded">
                              Sec {section.number}
                            </span>
                          </div>
                          <p className="text-xs text-brand-slate leading-relaxed mt-2">{term.definition}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROADMAP CURRICULUM VIEW (12 SECTIONS) */}
        {searchQuery.trim() === '' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-8 relative">
            
            {/* Left Timeline vertical indicator bar (desktop only) */}
            <div className="absolute left-10 top-12 bottom-12 w-[2px] bg-brand-amber/15 hidden lg:block" />

            {roadmapSections.map((section, idx) => {
              const isSectionActive = activeSectionId === section.id;
              const sectionCheckedCount = section.terms.filter(t => completedTerms[t.title]).length;
              const isSectionFullyMastered = sectionCheckedCount === section.terms.length;

              return (
                <React.Fragment key={section.id}>
                  <motion.div
                    id={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className={`relative lg:pl-16 transition-all duration-300 ${isSectionFullyMastered ? 'opacity-90' : ''}`}
                  >
                    {/* Timeline Badge (Desktop) */}
                    <div className="absolute left-5 top-0 w-10 h-10 rounded-full bg-white border-2 border-brand-charcoal/10 flex items-center justify-center z-20 hidden lg:flex shadow-sm">
                      {isSectionFullyMastered ? (
                        <div className="w-7 h-7 rounded-full bg-brand-amber flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-brand-slate">{section.number}</span>
                      )}
                    </div>

                    {/* Section Frame (Bento Card style) */}
                    <div className="bg-[#F9F7F3] border-2 border-brand-charcoal/10 hover:border-brand-charcoal/20 rounded-3xl p-6 sm:p-8 skeuo-raised relative overflow-hidden transition-all">
                      
                      {/* Top Accent Strip */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-amber/10" />

                      {/* Header bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-brand-slate/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-brand-amber/10 text-brand-amber px-2.5 py-1 rounded-md">
                              Section {section.number}
                            </span>
                            {section.buildsOn && (
                              <span className="text-[10px] font-mono font-bold text-brand-muted">
                                Builds on: <span className="text-brand-slate italic">{section.buildsOn}</span>
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mt-2">
                            {section.title}
                          </h3>
                          <p className="text-xs text-brand-muted mt-1 max-w-xl italic">
                            {section.subtitle}
                          </p>
                        </div>

                        {/* Section Quick Stats + Actions */}
                        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-brand-slate">
                            {sectionCheckedCount}/{section.terms.length} MASTERED
                          </span>
                          
                          <button
                            onClick={() => checkAllInSection(section)}
                            className="text-[10px] font-mono font-bold text-brand-amber hover:text-brand-amber-dark underline cursor-pointer bg-transparent border-0 p-0"
                          >
                            {isSectionFullyMastered ? "Deselect All" : "Mark All as Learned"}
                          </button>
                        </div>
                      </div>

                      {/* Terms Grid (Clean cards) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.terms.map((term) => {
                          const isChecked = !!completedTerms[term.title];
                          return (
                            <div
                              key={term.title}
                              onClick={() => toggleTerm(term.title)}
                              className={`group p-4 bg-white border rounded-2xl cursor-pointer flex gap-3 transition-all hover:border-brand-amber/30 select-none ${isChecked ? 'border-brand-amber/40 bg-brand-amber/[0.02] shadow-inner' : 'border-brand-slate/10 shadow-sm'}`}
                            >
                              {/* Visual toggle checkbox */}
                              <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${isChecked ? 'bg-brand-amber border-brand-amber text-white' : 'bg-white border-brand-slate/25 group-hover:border-brand-amber/50'}`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>

                              <div>
                                <h4 className="font-display text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                                  {term.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-brand-slate leading-relaxed mt-1">
                                  {term.definition}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Interactive "Test yourself" accordion card */}
                      {section.testYourself && (
                        <div className="mt-8 pt-6 border-t border-brand-slate/10">
                          <div className="bg-white/70 border border-brand-amber/15 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber shrink-0">
                                <HelpCircle className="w-4.5 h-4.5" />
                              </div>
                              <div className="flex-grow">
                                <span className="text-[10px] font-mono uppercase font-bold text-brand-amber block mb-1">
                                  Test yourself
                                </span>
                                <p className="text-xs sm:text-sm font-medium text-brand-charcoal leading-relaxed">
                                  {section.testYourself.question}
                                </p>

                                {/* Toggle Reveal Button */}
                                <button
                                  onClick={() => toggleQuiz(section.id)}
                                  className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-sand hover:bg-brand-sand-dark text-brand-amber border border-brand-amber/20 hover:border-brand-amber/40 font-display text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>{revealedQuizzes[section.id] ? "Hide Answer" : "Reveal Answer"}</span>
                                </button>

                                {/* Animated Answer Box */}
                                <AnimatePresence>
                                  {revealedQuizzes[section.id] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                      className="overflow-hidden border-t border-brand-slate/10"
                                    >
                                      <div className="pt-3 flex gap-2.5 items-start">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                        </div>
                                        <div>
                                          <span className="font-mono text-[9px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                                            EXPLAINED BY CLAY:
                                          </span>
                                          <p className="text-xs text-brand-slate leading-relaxed">
                                            {section.testYourself.answer}
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}

          </div>
        )}

        {/* Layer 4: Go Deeper Drawer */}
        <div className="max-w-4xl mx-auto mt-14 pt-8 border-t border-brand-slate/10">
          <div className="bg-[#F5F2ED] border-2 border-brand-charcoal/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <button
              onClick={() => setIsDeeperDrawerOpen(!isDeeperDrawerOpen)}
              className="w-full flex items-center justify-between p-5 bg-brand-sand/30 hover:bg-brand-sand/50 transition-colors text-left font-display font-extrabold text-brand-charcoal cursor-pointer outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold">Layer 4: Go Deeper</h4>
                  <p className="text-xs font-normal text-brand-muted">Expand to explore advanced, adjacent AI concepts (Opt-in only)</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-brand-slate/10 flex items-center justify-center text-brand-slate shrink-0">
                {isDeeperDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {isDeeperDrawerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-white border-t border-brand-slate/10"
                >
                  <div className="p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0">
                          <strong>AI Agents</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow">
                          AI systems that can plan and take actions using tools, rather than just generating text answers.
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0">
                          <strong>Fine-tuning</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow">
                          The process of customizing a pre-trained model further on your own specific dataset.
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0">
                          <strong>Embeddings</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow">
                          Turning the core meaning of text into lists of numbers to allow computer systems to compare them.
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0">
                          <strong>Multimodal AI</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow">
                          Advanced neural networks built to process multiple types of information (text, images, and audio) together.
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                        <span className="font-display font-extrabold text-sm text-rose-500 sm:w-48 shrink-0">
                          <strong>AI Ethics & Bias</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow">
                          The study of how models can make unfair or incorrect decisions due to human patterns in their training data.
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
