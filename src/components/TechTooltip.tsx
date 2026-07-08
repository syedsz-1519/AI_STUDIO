import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface TechTooltipProps {
  term: string;
  children: React.ReactNode;
  definition?: string;
  key?: React.Key;
}

const definitions: Record<string, string> = {
  'Artificial Intelligence': 'The capability of computer systems to perform tasks that historically required human thinking or reasoning.',
  'AI': 'The capability of computer systems to perform tasks that historically required human thinking or reasoning.',
  'Machine Learning': 'Algorithms that learn patterns from historical examples to make predictions or decisions without explicit rules.',
  'ML': 'Algorithms that learn patterns from historical examples to make predictions or decisions without explicit rules.',
  'Deep Learning': 'An advanced branch of AI that mimics human brains using layered neural networks to process complex features.',
  'Generative AI': 'A modern subset of AI designed to synthesize entirely new text, images, music, or code from instructions.',
  'Large Language Models': 'Massive neural networks trained on world archives of text to calculate and generate natural human language.',
  'LLMs': 'Massive neural networks trained on world archives of text to calculate and generate natural human language.',
  'Retrieval-Augmented Generation': 'A workflow that retrieves fresh, reliable documents from a database and appends them to your prompt to prevent AI errors.',
  'RAG': 'A workflow that retrieves fresh, reliable documents from a database and appends them to your prompt to prevent AI errors.',
  'Neural Networks': 'Mathematical systems modeled on human brain structures that filter signals to recognize patterns in data.',
  'Hallucinations': 'Scenarios where an AI model confidently invents incorrect or false information due to pattern prediction gaps.',
  'Tokens': 'Word fragments or semantic building blocks that models use to analyze and generate language numerically.',
  'AI Agents': 'AI systems equipped with memory and tools that can actively perform multi-step digital actions on your behalf.',
  'Fine-tuning': 'Adjusting an existing general-purpose AI model on special datasets to turn it into a dedicated domain expert.',
  'Embeddings': 'Mathematical list coordinates representing semantic concepts, letting computers easily group similar ideas.',
  'Multimodal AI': 'Systems capable of processing text, images, sound, and video simultaneously in one single integrated model.',
  'AI Ethics & Bias': 'Guarding against bias, privacy invasion, and unfair outputs resulting from training models on historical internet records.'
};

export default function TechTooltip({ term, children, definition: customDefinition }: TechTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Normalize search to find matching term
  const normTerm = term.trim();
  const definition = customDefinition || definitions[normTerm] || definitions[term] || 'An important technical concept in modern artificial intelligence pathways.';

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span className="cursor-help font-extrabold underline decoration-dashed decoration-brand-amber/60 hover:decoration-brand-amber underline-offset-4 text-brand-charcoal hover:text-brand-amber transition-all duration-200 decoration-2">
        {children}
      </span>
      
      <AnimatePresence>
        {isVisible && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 sm:w-72 z-50 pointer-events-none block"
          >
            {/* Tooltip Card - Glassmorphic design */}
            <span className="block p-3.5 rounded-2xl bg-[#FDFBF7]/95 backdrop-blur-md border border-brand-amber/35 shadow-xl text-left text-xs leading-relaxed text-brand-charcoal font-sans relative">
              <span className="flex items-center gap-1.5 font-display font-extrabold text-[10px] text-brand-amber uppercase tracking-wider mb-1 font-mono">
                <BookOpen className="w-3 h-3 shrink-0" />
                <span>{normTerm}</span>
              </span>
              <span className="block text-brand-charcoal/90 font-medium">
                {definition}
              </span>
              
              {/* Soft decorative visual node accent */}
              <span className="absolute top-2 right-3 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-amber"></span>
              </span>
              
              {/* Sleek Tooltip Arrow */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-[#FDFBF7] drop-shadow-[0_2px_1px_rgba(217,119,6,0.1)] z-10" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-brand-amber/35 mt-[1px]" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
