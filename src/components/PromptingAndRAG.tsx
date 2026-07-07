import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ChevronRight, 
  Eye, 
  HelpCircle, 
  Search, 
  BookOpen, 
  CheckCircle,
  HelpCircle as QuestionIcon,
  MessageSquare
} from 'lucide-react';
import { PromptingType } from '../types';
import TechTooltip from './TechTooltip';

export default function PromptingAndRAG() {
  const [selectedPromptType, setSelectedPromptType] = useState<number>(0);
  const [ragStep, setRagStep] = useState<number>(0);

  // Auto-cycle the RAG diagram steps gently
  useEffect(() => {
    const timer = setInterval(() => {
      setRagStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const promptingTypes: PromptingType[] = [
    {
      title: 'Zero-shot',
      definition: 'Directly asking for something without giving any background context or guidelines.',
      example: '"Translate \'Good Morning\' into French."'
    },
    {
      title: 'Few-shot',
      definition: 'Providing 1 to 3 written examples first so the machine understands the format you want.',
      example: '"Happy -> Positive, Angry -> Negative, Relaxed -> ?"'
    },
    {
      title: 'Chain-of-thought',
      definition: 'Explicitly instructing the AI to walk through its reasoning path step-by-step.',
      example: '"Explain why 15 is a composite number. Think step by step."'
    },
    {
      title: 'Role prompting',
      definition: 'Assigning a virtual persona, context, or career background to the AI model before it answers.',
      example: '"Act as an experienced senior editor. Review this text..."'
    }
  ];

  const ragSteps = [
    { id: 0, label: 'Question', desc: 'The user asks a specific question.', icon: QuestionIcon },
    { id: 1, label: 'Search', desc: 'The system searches a private document base.', icon: Search },
    { id: 2, label: 'Context', desc: 'Relevant facts are retrieved & loaded.', icon: BookOpen },
    { id: 3, label: 'Answer', desc: 'The AI answers using those exact verified facts.', icon: CheckCircle }
  ];

  return (
    <div id="prompting-rag" className="scroll-mt-16 bg-brand-sand/15 py-16 border-b border-brand-slate/5">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* 1. Prompting Module (Bento Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          
          {/* Bento Card 1: Prompting Text Explanation (Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between p-8 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <Zap className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber block mb-2 font-mono">Lesson 08</span>
              <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mb-4">
                Talking to AI: Prompting
              </h2>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] mb-6">
                A <TechTooltip term="Prompt">Prompt</TechTooltip> — <span className="text-brand-slate italic">the raw written instructions, queries, or background text you feed into an AI system to guide its behavior</span> — is how humans steering AI get high-quality results. 
                Just like talking to another person, being vague results in vague answers. Over time, builders have mapped out specific styles of asking questions to extract highly accurate logic.
              </p>
            </div>

            {/* Quick-tips tactile drawer */}
            <div className="bg-[#F9F7F3] border border-brand-slate/10 p-4 rounded-2xl flex items-center gap-3.5 shadow-inner">
              <Zap className="w-5 h-5 text-brand-amber shrink-0 animate-pulse" />
              <div className="text-[11px] leading-normal">
                <span className="font-bold text-brand-charcoal block">Prompting Rule of Thumb</span>
                <span className="text-brand-muted">Treat the AI like a highly capable intern with zero context. Spell out exactly what you want.</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: Interactive Prompting Selector (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 bg-[#F9F7F3] border border-brand-slate/10 rounded-3xl skeuo-raised min-h-[350px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                {/* 3D-style Tactile Icon Tile */}
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 text-brand-amber">
                  <MessageSquare className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
                </div>
                <span className="text-xs font-mono font-bold text-brand-muted uppercase">Prompt Styles</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {promptingTypes.map((type, i) => (
                  <button
                    key={type.title}
                    onClick={() => setSelectedPromptType(i)}
                    className={`p-3 text-left rounded-xl transition-all border font-display text-xs font-bold cursor-pointer select-none ${selectedPromptType === i ? 'bg-brand-amber text-white border-brand-amber shadow-sm' : 'bg-white hover:bg-brand-sand border-brand-slate/10 text-brand-charcoal'}`}
                  >
                    <span className="block text-[8px] uppercase tracking-wider opacity-60 mb-0.5 font-mono">0{i + 1}</span>
                    {type.title}
                  </button>
                ))}
              </div>

              {/* Prompt Type Description Card */}
              <motion.div
                key={selectedPromptType}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-brand-slate/10 p-5 rounded-2xl min-h-[140px] flex flex-col justify-between shadow-sm"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-brand-amber uppercase tracking-wider block mb-1">Definition</span>
                  <p className="text-xs text-brand-charcoal leading-relaxed mb-3">
                    {promptingTypes[selectedPromptType].definition}
                  </p>
                </div>

                <div className="bg-brand-sand/30 border border-brand-slate/5 p-2.5 rounded-xl">
                  <span className="text-[8px] font-mono font-bold text-brand-slate uppercase tracking-wider block mb-0.5">Real World Example</span>
                  <p className="text-[10px] font-mono font-semibold text-brand-charcoal leading-snug">
                    {promptingTypes[selectedPromptType].example}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        {/* 2. RAG Module (Bento Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Bento Card 3: Animated RAG Diagram (Col Span 5) */}
          <div className="lg:col-span-5 p-8 bg-[#F9F7F3] border border-brand-slate/10 rounded-3xl skeuo-raised flex flex-col justify-between min-h-[360px]">
            <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start mb-6 z-10">
                {/* 3D-style Tactile Icon Tile */}
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 text-brand-amber">
                  <Search className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-brand-muted">RAG Loop Sequence</span>
                  <span className="text-[9px] bg-brand-sand px-2 py-0.5 border border-brand-slate/15 rounded font-mono text-brand-amber font-bold mt-1.5">
                    Step {ragStep + 1}/4
                  </span>
                </div>
              </div>

              {/* Steps Layout Grid */}
              <div className="grid grid-cols-4 gap-1 relative mb-6">
                
                {/* SVG Connecting Track */}
                <svg className="absolute top-6 left-0 w-full h-2 pointer-events-none z-0">
                  <line x1="12.5%" y1="50%" x2="87.5%" y2="50%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4,4" />
                  {/* Glowing moving pulse indicator */}
                  <motion.circle
                    r="4"
                    fill="#d97706"
                    initial={{ cx: '12.5%' }}
                    animate={{ 
                      cx: ragStep === 0 ? '12.5%' : ragStep === 1 ? '37.5%' : ragStep === 2 ? '62.5%' : '87.5%'
                    }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    style={{ filter: 'drop-shadow(0 0 4px #d97706)' }}
                  />
                </svg>

                {ragSteps.map((step) => {
                  const Icon = step.icon;
                  const isActive = ragStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setRagStep(step.id)}
                      className="flex flex-col items-center z-10 cursor-pointer focus:outline-none"
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${isActive ? 'bg-brand-amber text-white border-brand-amber shadow-md scale-105' : 'bg-white hover:bg-brand-sand text-brand-slate border-brand-slate/10'}`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className={`text-[9px] font-bold mt-2 font-display ${isActive ? 'text-brand-amber' : 'text-brand-muted'}`}>
                        {step.label}
                      </span>
                    </button>
                  );
                })}

              </div>

              {/* Active Step Description Card */}
              <motion.div
                key={ragStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-brand-slate/10 p-4 rounded-2xl text-center flex-grow flex flex-col justify-center min-h-[90px] shadow-sm"
              >
                <h4 className="font-display text-xs font-bold text-brand-charcoal mb-1">
                  Step {ragStep + 1}: {ragSteps[ragStep].label}
                </h4>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  {ragSteps[ragStep].desc}
                </p>
              </motion.div>
            </div>

            <div className="text-center mt-4 text-[9px] text-brand-muted font-mono">
              Tap icons or wait to auto-cycle
            </div>
          </div>

          {/* Bento Card 4: RAG Description Text (Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between p-8 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <BookOpen className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono block mb-2">Lesson 09</span>
              <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mb-4">
                RAG: Reducing Hallucinations
              </h2>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] mb-6">
                <TechTooltip term="Retrieval-Augmented Generation">Retrieval-Augmented Generation</TechTooltip> — <span className="text-brand-slate italic">an AI system pattern that first searches a secure, private document database for relevant facts before sending those exact details along with your question to the LLM</span> — is like giving an AI an open-book exam.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-l-4 border-brand-slate relative bg-brand-sand/20">
              <span className="font-mono text-[10px] font-bold text-brand-slate uppercase block mb-1">Behind the scenes</span>
              <p className="text-brand-charcoal text-xs leading-relaxed italic">
                Without RAG, an AI relies purely on its memory of training data, which can lead to "<TechTooltip term="Hallucinations">hallucinations</TechTooltip>" (writing confidently incorrect facts). With RAG, the system acts as a smart research assistant: it scans your trusted documents first, copies out the true data, and instructs the AI to write an answer using only those verified facts.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
