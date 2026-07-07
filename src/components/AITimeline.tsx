import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Zap, History, Compass } from 'lucide-react';
import ClayLogo from './ClayLogo';

export default function AITimeline() {
  const [activeTab, setActiveTab] = useState<'history' | 'now'>('history');

  const historyEvents = [
    {
      time: "1950",
      title: "Alan Turing's Question",
      text: "Alan Turing asks \"Can machines think?\" — the spark that ignited computer intelligence research."
    },
    {
      time: "1956",
      title: "Coining the Term",
      text: "The term **Artificial Intelligence** (machines mimicking human decision-making) is coined at a small Dartmouth conference."
    },
    {
      time: "1950s–1970s",
      title: "Early Rules",
      text: "Early **rule-based AI** (systems following rigid if-then instructions) emerges — exciting but severely limited."
    },
    {
      time: "1980s–1990s",
      title: "AI Winters",
      text: "Multiple **AI Winters** (periods when research funding dried up due to overhyped promises) cool down expectations."
    },
    {
      time: "1997",
      title: "Deep Blue Victory",
      text: "IBM's Deep Blue beats chess champion Garry Kasparov, creating the first massive public breakthrough moment."
    },
    {
      time: "2012",
      title: "Deep Learning Boom",
      text: "A **Deep Learning** (neural networks with many layers learning from huge datasets) breakthrough makes image recognition incredibly accurate."
    },
    {
      time: "2022",
      title: "ChatGPT Launches",
      text: "The conversational bot **ChatGPT** (a system predicting the next word in a sentence) launches as an overnight household name."
    },
    {
      time: "2023–2025",
      title: "Generative AI Race",
      text: "The global **Generative AI** (AI that creates new text, images, or media) race starts as leading labs release weekly updates."
    }
  ];

  const currentCards = [
    {
      title: "It's a tight race",
      text: "Leading AI research labs are now releasing major new models every few weeks, meaning the gap in intelligence between the top systems has never been smaller."
    },
    {
      title: "AI is starting to take actions, not just answer",
      text: "The newest trend is **AI agents** (autonomous software systems that plan and execute multi-step tasks) that can book flights, conduct research, or write code."
    },
    {
      title: "It's everywhere now",
      text: "From your phone's personal recommendations to customer service agents, AI adoption is growing faster than any consumer technology in human history."
    }
  ];

  return (
    <div className="relative mt-4 mb-8">
      {/* Container Frame (Bento Card style matching section index layout) */}
      <div className="bg-[#F9F7F3] border-2 border-brand-charcoal/10 hover:border-brand-charcoal/15 rounded-3xl p-6 sm:p-8 skeuo-raised relative overflow-hidden transition-all">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E07A5F]/20" />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-brand-slate/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#E07A5F]/10 text-[#E07A5F] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Special Module
              </span>
              <span className="text-[10px] font-mono font-bold text-brand-muted">
                Timeline Perspective
              </span>
            </div>
            <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mt-2 flex items-center gap-2">
              The AI Timeline
            </h3>
            <p className="text-xs text-brand-muted mt-1 max-w-xl italic">
              Trace how we got here, and understand the breathtaking speed of what is happening right now.
            </p>
          </div>

          {/* Glassmorphic Sliding Toggle Switch */}
          <div className="bg-white/40 backdrop-blur-md border border-brand-charcoal/10 p-1 rounded-full flex self-start sm:self-center shadow-sm relative overflow-hidden shrink-0">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-full font-display text-xs font-bold relative z-10 transition-colors cursor-pointer ${activeTab === 'history' ? 'text-brand-charcoal' : 'text-brand-slate hover:text-brand-charcoal'}`}
            >
              History
              {activeTab === 'history' && (
                <motion.div
                  layoutId="timeline-active-pill"
                  className="absolute inset-0 bg-white border border-brand-charcoal/5 rounded-full shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('now')}
              className={`px-4 py-1.5 rounded-full font-display text-xs font-bold relative z-10 transition-colors cursor-pointer ${activeTab === 'now' ? 'text-brand-charcoal' : 'text-brand-slate hover:text-brand-charcoal'}`}
            >
              Right Now (2026)
              {activeTab === 'now' && (
                <motion.div
                  layoutId="timeline-active-pill"
                  className="absolute inset-0 bg-white border border-brand-charcoal/5 rounded-full shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Interactive Content Crossfader with blur and opacity */}
        <AnimatePresence mode="wait">
          {activeTab === 'history' ? (
            <motion.div
              key="history-panel"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative pl-2 sm:pl-6"
            >
              {/* Raised Clay vertical track line */}
              <div className="absolute left-3.5 sm:left-4.5 top-2 bottom-2 w-1.5 bg-[#EBE7E0] rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),_1px_1px_0px_rgba(255,255,255,0.8)] border border-brand-charcoal/5" />

              <div className="flex flex-col gap-6 relative">
                {historyEvents.map((evt, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 items-start relative group">
                    {/* Skeuomorphic Timeline Node (clay button style) */}
                    <div className="w-8 h-8 rounded-full bg-[#E07A5F] border-2 border-[#C55937] shadow-[2px_2px_4px_rgba(0,0,0,0.1),_inset_1px_1.5px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-[9px] text-white font-mono font-bold shrink-0 z-10 transition-transform group-hover:scale-110 active:scale-95 select-none">
                      •
                    </div>

                    <div className="bg-white border border-brand-slate/10 hover:border-brand-slate/20 rounded-2xl p-3 px-4 shadow-sm flex-grow transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[11px] font-extrabold text-[#E07A5F]">
                          {evt.time}
                        </span>
                        <h4 className="font-display text-xs font-bold text-brand-charcoal">
                          {evt.title}
                        </h4>
                      </div>
                      <p 
                        className="text-xs sm:text-[13px] text-brand-slate leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: evt.text }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="now-panel"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {currentCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-md border-2 border-white/80 hover:border-brand-amber/20 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Visual clay accent */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-amber to-brand-amber-dark opacity-10 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber mb-4 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    
                    <h4 className="font-display text-sm font-extrabold text-brand-charcoal mb-2 group-hover:text-brand-amber transition-colors">
                      "{card.title}"
                    </h4>
                    
                    <p 
                      className="text-xs sm:text-[13px] text-brand-slate leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: card.text }}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-mono font-bold text-brand-muted">
                    <ClayLogo size={14} />
                    <span>Clay Outlook 2026</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
