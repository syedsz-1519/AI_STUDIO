import { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Image as ImageIcon, Music, Cpu, MessageSquare, Sparkles } from 'lucide-react';
import TechTooltip from './TechTooltip';

export default function GenerativeAI() {
  const [activeOutput, setActiveOutput] = useState<string>('text');

  const genExamples = [
    {
      id: 'text',
      title: 'ChatGPT (Text)',
      role: 'Writes prose, poems, and clean code.',
      icon: Pencil,
      preview: 'Write a warm, simple haiku about a coffee shop on a rainy afternoon...',
      output: 'Soft rain taps the glass,\nWarm steam rises from the cup,\nSilence shares the space.'
    },
    {
      id: 'image',
      title: 'Midjourney (Images)',
      role: 'Drafts gorgeous digital illustrations.',
      icon: ImageIcon,
      preview: 'A tiny mouse sitting on a dandelion reading a miniature leather book, oil painting style...',
      output: '🎨 [Generates a soft, warm oil painting focusing on a spectacled field mouse turning pages under a glowing golden dandelion root]'
    },
    {
      id: 'music',
      title: 'Suno (Music)',
      role: 'Creates songs with vocals and melodies.',
      icon: Music,
      preview: 'A retro-wave track with acoustic guitars and synthesizers about driving into a golden sunset...',
      output: '🎵 [Synthesizes a warm, rhythmic 120bpm stereo track blending tactile fingerstyle guitar strumming with analog low-pass synthesizers]'
    }
  ];

  return (
    <div id="generative-ai" className="scroll-mt-16 py-12">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Generative AI Intro (Bento Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          
          {/* Bento Card 1: Intro Text Explanation (Col Span 7) */}
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
                <Sparkles className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono block mb-2">Lesson 06</span>
              <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mb-4">
                What is Generative AI?
              </h2>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] mb-6">
                Until recently, AI was mostly used to analyze, sort, or predict values (like spam or stock prices). But <TechTooltip term="Generative AI">Generative AI</TechTooltip> — <span className="text-brand-slate italic">a modern branch of Artificial Intelligence designed to synthesize and output entirely new files, such as custom text, realistic images, and original musical tracks, rather than just analyzing existing ones</span> — has opened up creative frontiers.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-l-4 border-brand-amber relative bg-brand-sand/20">
              <span className="font-mono text-[10px] font-bold text-brand-amber uppercase block mb-1">In Practice</span>
              <p className="text-brand-charcoal text-xs leading-relaxed italic">
                Instead of just recognizing a picture of a cat, Generative AI has learned the "math map" of cats, allowing it to paint a brand-new illustration of a "cat floating in a zero-gravity space helmet" from scratch when asked.
              </p>
            </div>
          </motion.div>

          {/* Bento Card 2: Interactive Creation Simulator (Col Span 5) */}
          <div className="lg:col-span-5 p-8 bg-[#F9F7F3] border border-brand-slate/10 rounded-3xl skeuo-raised flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                {/* 3D-style Tactile Icon Tile */}
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 text-brand-amber">
                  <Pencil className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">Creation Simulator</span>
                  <div className="flex gap-1.5 mt-2">
                    {genExamples.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveOutput(item.id)}
                          className={`p-2 rounded-lg cursor-pointer transition-all border ${activeOutput === item.id ? 'bg-brand-amber text-white border-brand-amber shadow-sm' : 'bg-white hover:bg-brand-sand border-brand-slate/10 text-brand-slate'}`}
                          aria-label={`Select ${item.id} generator`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Prompt Preview */}
              <div className="bg-white border border-brand-slate/10 p-4 rounded-xl mb-4 relative shadow-sm">
                <span className="absolute -top-2 left-3 bg-white px-2 border border-brand-slate/10 rounded text-[9px] font-mono font-bold text-brand-muted uppercase">Prompt Input</span>
                <p className="text-[11px] font-semibold text-brand-charcoal leading-relaxed mt-1">
                  "{genExamples.find(e => e.id === activeOutput)?.preview}"
                </p>
              </div>

              {/* Generated Output */}
              <motion.div
                key={activeOutput}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-charcoal border border-brand-charcoal/30 text-brand-cream font-mono p-4 rounded-xl min-h-[120px] flex flex-col justify-between relative shadow-inner overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/5 rounded-full blur-xl pointer-events-none" />
                <p className="whitespace-pre-line leading-relaxed z-10 text-[10px]">
                  {genExamples.find(e => e.id === activeOutput)?.output}
                </p>
                <span className="text-[9px] text-brand-amber font-bold uppercase tracking-wider block mt-4 z-10">
                  ✨ Successfully generated by {genExamples.find(e => e.id === activeOutput)?.title}
                </span>
              </motion.div>
            </div>
          </div>

        </div>

        {/* Large Language Models Section (Bento Card 3, Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="skeuo-raised p-8 md:p-10 bg-white border border-brand-slate/10 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-brand-slate/5 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Box (Col Span 8) */}
            <div className="md:col-span-8">
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <Cpu className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">Lesson 07</span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mb-4">
                What is an LLM (Large Language Model)?
              </h3>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] md:text-[15px] mb-4">
                A <TechTooltip term="Large Language Model">Large Language Model</TechTooltip> — <span className="text-brand-slate italic">a specific type of Generative AI model trained on massive oceans of written books, articles, and websites to predict the most logical next word in a sentence</span> — powers modern conversational tools.
              </p>
              <p className="font-sans text-brand-muted text-xs sm:text-sm leading-relaxed">
                When you ask Claude, Gemini, or ChatGPT a question, they aren't looking up answers in a neat file drawer. They are running billions of tiny calculations to ask: <em>"Given all human text I have digested, what is the most likely, helpful sequence of words to write next?"</em>
              </p>
            </div>

            {/* Right Box (Col Span 4) */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 rounded-full bg-brand-sand/50 border border-brand-slate/10 flex flex-col items-center justify-center skeuo-raised relative shadow-inner">
                <MessageSquare className="w-10 h-10 text-brand-amber mb-1.5" />
                <span className="font-mono text-[9px] font-bold text-brand-muted uppercase">Word Predictor</span>
                {/* Micro-nodes around circle */}
                <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-brand-amber" />
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-brand-slate" />
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
