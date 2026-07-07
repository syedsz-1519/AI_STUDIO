import { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Image as ImageIcon, Music, Cpu, MessageSquare, Sparkles } from 'lucide-react';
import TechTooltip from './TechTooltip';
import { useLanguage } from '../hooks/useLanguage';

export default function GenerativeAI() {
  const { lang, t } = useLanguage();
  const [activeOutput, setActiveOutput] = useState<string>('text');

  const genExamples = [
    {
      id: 'text',
      title: lang === 'en' ? 'ChatGPT (Text)' : 'ChatGPT (Aasaan Text)',
      role: lang === 'en' ? 'Writes prose, poems, and clean code.' : 'Mazmoon, shayari, aur saaf code likhta hai.',
      icon: Pencil,
      preview: lang === 'en' 
        ? 'Write a warm, simple haiku about a coffee shop on a rainy afternoon...'
        : 'Baarish ki dopahar mein ek garam chai ki dukaan pe shayari likho...',
      output: lang === 'en'
        ? 'Soft rain taps the glass,\nWarm steam rises from the cup,\nSilence shares the space.'
        : 'Garam chai ki pyaali ho,\nBaarish ka thanda mausam ho,\nBas thodi si khamoshi ho.'
    },
    {
      id: 'image',
      title: lang === 'en' ? 'Midjourney (Images)' : 'Midjourney (Photos)',
      role: lang === 'en' ? 'Drafts gorgeous digital illustrations.' : 'Bohot pyaari photos aur paintings banata hai.',
      icon: ImageIcon,
      preview: lang === 'en'
        ? 'A tiny mouse sitting on a dandelion reading a miniature leather book, oil painting style...'
        : 'Ek chota sa chuha patti par baith ke kitabi panna palat raha hai, oil painting style...',
      output: lang === 'en'
        ? '🎨 [Generates a soft, warm oil painting focusing on a spectacled field mouse turning pages under a glowing golden dandelion root]'
        : '🎨 [Ek pyaari oil painting banti hai jisme chashma lagaya so chuha sunhare patti ke neeche baith ke kitabi panne palat raha hai]'
    },
    {
      id: 'music',
      title: lang === 'en' ? 'Suno (Music)' : 'Suno (Gaane aur Music)',
      role: lang === 'en' ? 'Creates songs with vocals and melodies.' : 'Awaaz aur dhun ke sath naye gaane banata hai.',
      icon: Music,
      preview: lang === 'en'
        ? 'A retro-wave track with acoustic guitars and synthesizers about driving into a golden sunset...'
        : 'Ek mast retro-wave track guitar aur synth ke sath jo shaam ke safar ke baare mein ho...',
      output: lang === 'en'
        ? '🎵 [Synthesizes a warm, rhythmic 120bpm stereo track blending tactile fingerstyle guitar strumming with analog low-pass synthesizers]'
        : '🎵 [Ek mast 120bpm stereo track banti hai jisme guitar ki dhun ke sath analog synthesizer ka heavy sound ghumta hai]'
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

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono block mb-2">
                {lang === 'en' ? "Lesson 06" : "Sabak 06"}
              </span>
              <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mb-4">
                {lang === 'en' ? "What is Generative AI?" : "Generative AI Kya Hai?"}
              </h2>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] mb-6">
                {lang === 'en' ? (
                  <>
                    Until recently, AI was mostly used to analyze, sort, or predict values (like spam or stock prices). But <TechTooltip term="Generative AI">Generative AI</TechTooltip> — <span className="text-brand-slate italic">a modern branch of Artificial Intelligence designed to synthesize and output entirely new files, such as custom text, realistic images, and original musical tracks, rather than just analyzing existing ones</span> — has opened up creative frontiers.
                  </>
                ) : (
                  <>
                    Pehle ke zamane mein AI sirf data analyze, sort, ya predict karne ke liye tha (jaise spam messages ya share market). Lekin <strong className="text-brand-amber">Generative AI</strong> — <span className="text-brand-slate italic">Artificial Intelligence ki nayi branch hai jo bina purani files ko copy kiye, bilkul naye mazmoon, photos, aur gaane khud se likh aur bana sakti hai</span> — isne dunya badal di hai.
                  </>
                )}
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-l-4 border-brand-amber relative bg-brand-sand/20">
              <span className="font-mono text-[10px] font-bold text-brand-amber uppercase block mb-1">
                {lang === 'en' ? "In Practice" : "Asli Zindagi Mein"}
              </span>
              <p className="text-brand-charcoal text-xs leading-relaxed italic">
                {lang === 'en' ? (
                  `Instead of just recognizing a picture of a cat, Generative AI has learned the "math map" of cats, allowing it to paint a brand-new illustration of a "cat floating in a zero-gravity space helmet" from scratch when asked.`
                ) : (
                  `Billi ki photo pehchanna toh bacho ka khel hai yaaron. Generative AI billiyon ka poora "math map" dimaag mein bitha leta hai. Jab tum bolo "space helmet pehne so billi hawa mein udri", toh wo waisi billi ki bilkul nayi photo banake de deta hai.`
                )}
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
                  <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">
                    {lang === 'en' ? "Creation Simulator" : "Creation Simulator"}
                  </span>
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
                <span className="absolute -top-2 left-3 bg-white px-2 border border-brand-slate/10 rounded text-[9px] font-mono font-bold text-brand-muted uppercase">
                  {lang === 'en' ? "Prompt Input" : "Aapka Prompt"}
                </span>
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
                  {lang === 'en'
                    ? `✨ Successfully generated by ${genExamples.find(e => e.id === activeOutput)?.title}`
                    : `✨ ${genExamples.find(e => e.id === activeOutput)?.title} ne dhang se bana diya!`
                  }
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
                <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">
                  {lang === 'en' ? "Lesson 07" : "Sabak 07"}
                </span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mb-4">
                {lang === 'en' ? "What is an LLM (Large Language Model)?" : "LLM (Large Language Model) Kya Hai?"}
              </h3>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] md:text-[15px] mb-4">
                {lang === 'en' ? (
                  <>
                    A <TechTooltip term="Large Language Model">Large Language Model</TechTooltip> — <span className="text-brand-slate italic">a specific type of Generative AI model trained on massive oceans of written books, articles, and websites to predict the most logical next word in a sentence</span> — powers modern conversational tools.
                  </>
                ) : (
                  <>
                    Ek <strong className="text-brand-amber">Large Language Model (LLM)</strong> — <span className="text-brand-slate italic">Generative AI ka wo model hai jisko dunya ki hazaaro kitabein aur websites ruttayi gayi hain, taake wo dhang ka agla word dimaag se bol sake</span> — ye aajkal ke chatbots ko power karta hai.
                  </>
                )}
              </p>
              <p className="font-sans text-brand-muted text-xs sm:text-sm leading-relaxed">
                {lang === 'en' ? (
                  <>
                    When you ask Claude, Gemini, or ChatGPT a question, they aren't looking up answers in a neat file drawer. They are running billions of tiny calculations to ask: <em>"Given all human text I have digested, what is the most likely, helpful sequence of words to write next?"</em>
                  </>
                ) : (
                  <>
                    Jab tum Claude, Gemini ya ChatGPT se sawaal puchte ho, toh wo kisi diary mein se khol ke answer nahi dhoond rahe hain miya. Wo log billion calculations chalake puchte hain: <em>"Puri dunya ka jo text main ne padha hai, uske mutabiq abhi likhne ke liye sabse sahi aur fayedemand words konse hain?"</em>
                  </>
                )}
              </p>
            </div>

            {/* Right Box (Col Span 4) */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 rounded-full bg-brand-sand/50 border border-brand-slate/10 flex flex-col items-center justify-center skeuo-raised relative shadow-inner">
                <MessageSquare className="w-10 h-10 text-brand-amber mb-1.5" />
                <span className="font-mono text-[9px] font-bold text-brand-muted uppercase">
                  {lang === 'en' ? "Word Predictor" : "Word Predictor"}
                </span>
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
