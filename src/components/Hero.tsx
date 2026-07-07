import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown } from 'lucide-react';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // A list of interactive "data points" for a miniature pattern matching game
  const nodes = [
    { id: 1, x: 25, y: 35, color: '#d97706', matches: [3, 5] },
    { id: 2, x: 75, y: 25, color: '#475569', matches: [4, 6] },
    { id: 3, x: 35, y: 70, color: '#d97706', matches: [1, 5] },
    { id: 4, x: 80, y: 65, color: '#475569', matches: [2, 6] },
    { id: 5, x: 50, y: 50, color: '#d97706', matches: [1, 3] },
    { id: 6, x: 65, y: 80, color: '#475569', matches: [2, 4] },
  ];

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-16">
      {/* Background organic blur */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-amber/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-slate/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Subtle Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-amber/15 rounded-full text-xs font-semibold text-brand-amber shadow-sm mb-8"
        >
          <ClayLogo size={20} />
          <span>{t('hero.badge')}</span>
        </motion.div>

        {/* Master Hook Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-charcoal leading-[1.1] tracking-tight max-w-3xl mb-6 text-balance"
        >
          {lang === 'en' ? (
            <>AI is not magic. It’s <span className="text-brand-amber relative">pattern-matching</span> at massive scale.</>
          ) : (
            <>AI koi jaadu nahi hai yaaron. Ye bade paimane par <span className="text-brand-amber relative">pattern matching</span> hai.</>
          )}
        </motion.h1>

        {/* Elegant Sub-intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-sans text-lg md:text-xl text-brand-muted max-w-2xl leading-relaxed mb-10"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Tactile Interactive Pattern Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full max-w-lg h-56 bg-white/50 border border-brand-slate/10 rounded-2xl p-6 mb-12 shadow-sm flex flex-col justify-between overflow-hidden backdrop-blur-sm"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node) => 
              node.matches.map((matchId) => {
                const targetNode = nodes.find((n) => n.id === matchId);
                if (!targetNode || node.id > matchId) return null; // Avoid duplicate lines
                const isMatchingHover = hoveredNode === node.id || hoveredNode === targetNode.id;
                return (
                  <motion.line
                    key={`${node.id}-${matchId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isMatchingHover ? node.color : '#cbd5e1'}
                    strokeWidth={isMatchingHover ? 2.5 : 1}
                    strokeDasharray={isMatchingHover ? '0' : '4,4'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Nodes */}
          {nodes.map((node) => (
            <button
              key={node.id}
              className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              aria-label={`Interactive pattern node ${node.id}`}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: hoveredNode === node.id ? node.color : '#ffffff',
                  border: `2.5px solid ${node.color}`,
                  boxShadow: hoveredNode === node.id 
                    ? `0 0 16px ${node.color}40, inset 0 1px 2px rgba(255,255,255,0.4)`
                    : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: hoveredNode === node.id ? '#ffffff' : node.color }}
                />
              </div>
            </button>
          ))}

          {/* Tactile interaction instructions */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-brand-muted pointer-events-none">
            <span className="font-medium">{t('hero.canvas.instruction')}</span>
            <span className="font-mono bg-brand-sand px-2 py-0.5 rounded border border-brand-slate/5">{t('hero.canvas.engine')}</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => {
            const el = document.getElementById('what-is-ai');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-amber transition-colors group cursor-pointer"
        >
          <span>{t('hero.button')}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white border border-brand-slate/10 flex items-center justify-center shadow-sm group-hover:border-brand-amber/30 group-hover:shadow-md transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
