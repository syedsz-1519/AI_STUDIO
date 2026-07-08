import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2, Lock, Target, Zap, BookOpen, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface RoadmapLevel {
  id: string;
  titleEn: string;
  titleHyd: string;
  descriptionEn: string;
  descriptionHyd: string;
  icon: React.ReactNode;
  topics: TopicItem[];
  timeEstimate: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
}

interface TopicItem {
  titleEn: string;
  titleHyd: string;
  descriptionEn: string;
  descriptionHyd: string;
  duration: string;
}

export default function LearningRoadmap() {
  const { lang } = useLanguage();
  const [expandedLevel, setExpandedLevel] = useState<string>('level1');
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);

  const roadmapLevels: RoadmapLevel[] = [
    {
      id: 'level1',
      titleEn: 'Foundations',
      titleHyd: 'Bunyad',
      descriptionEn: 'Start here! Learn what AI is, how it learns, and basic concepts.',
      descriptionHyd: 'Yahan se shuru karo! AI kya hai, ye kaisa seekhta hai, aur basic concepts samjho.',
      icon: <Zap className="w-5 h-5" />,
      topics: [
        {
          titleEn: 'What is Artificial Intelligence?',
          titleHyd: 'AI kya hai?',
          descriptionEn: 'Introduction to AI, machine learning, and pattern matching concepts',
          descriptionHyd: 'AI, ML aur pattern matching ka parichay',
          duration: '15 min',
        },
        {
          titleEn: 'How Machines Learn',
          titleHyd: 'Machines kaisa seekhte hain?',
          descriptionEn: 'Understanding data, training, and prediction mechanisms',
          descriptionHyd: 'Data, training aur prediction ko samjhna',
          duration: '20 min',
        },
        {
          titleEn: 'Real-World AI Applications',
          titleHyd: 'Asal jeevan mein AI',
          descriptionEn: 'Netflix recommendations, Google Maps, spam filters, and more',
          descriptionHyd: 'Netflix, Google Maps, spam filters aur aur bohot kuch',
          duration: '10 min',
        },
      ],
      timeEstimate: '45 min',
      difficulty: 'beginner',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'level2',
      titleEn: 'Core Concepts',
      titleHyd: 'Main Baatein',
      descriptionEn: 'Understand neural networks, deep learning, and how data shapes AI.',
      descriptionHyd: 'Neural networks, deep learning aur data ka role samjho.',
      icon: <Target className="w-5 h-5" />,
      topics: [
        {
          titleEn: 'Neural Networks 101',
          titleHyd: 'Neural Networks kya hain?',
          descriptionEn: 'How artificial neurons mimic human brain connections',
          descriptionHyd: 'Artificial neurons kaisa kaam karte hain?',
          duration: '25 min',
        },
        {
          titleEn: 'Deep Learning Explained',
          titleHyd: 'Deep Learning simple bhasha mein',
          descriptionEn: 'Layers, backpropagation, and training deep models',
          descriptionHyd: 'Layers, training aur complex models',
          duration: '30 min',
        },
        {
          titleEn: 'Data: The Fuel of AI',
          titleHyd: 'Data: AI ka tel',
          descriptionEn: 'Quality data, bias, and why data matters',
          descriptionHyd: 'Data ki quality, bias aur importance',
          duration: '20 min',
        },
      ],
      timeEstimate: '75 min',
      difficulty: 'intermediate',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'level3',
      titleEn: 'Generative AI & LLMs',
      titleHyd: 'Gen AI aur Language Models',
      descriptionEn: 'Explore transformers, large language models, and ChatGPT concepts.',
      descriptionHyd: 'Transformers, LLMs aur modern AI mo dels dekho.',
      icon: <Zap className="w-5 h-5" />,
      topics: [
        {
          titleEn: 'Transformers & Attention',
          titleHyd: 'Transformers kaise kaam karte hain?',
          descriptionEn: 'Understanding the architecture behind modern AI',
          descriptionHyd: 'Modern AI ke architecture ko samjhna',
          duration: '35 min',
        },
        {
          titleEn: 'Large Language Models',
          titleHyd: 'Bade Language Models',
          descriptionEn: 'How GPT, Claude, and Gemini work',
          descriptionHyd: 'GPT, Claude, Gemini kaisa kaam karte hain?',
          duration: '30 min',
        },
        {
          titleEn: 'Prompting & RAG',
          titleHyd: 'Prompt Engineering aur RAG',
          descriptionEn: 'Write better prompts and retrieve-augmented generation',
          descriptionHyd: 'Acche prompts likho aur RAG samjho',
          duration: '25 min',
        },
      ],
      timeEstimate: '90 min',
      difficulty: 'intermediate',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'level4',
      titleEn: 'Advanced Topics',
      titleHyd: 'Advanced Concepts',
      descriptionEn: 'Dive into ethics, bias, hallucinations, and AI safety.',
      descriptionHyd: 'Ethics, bias, hallucinations aur AI safety dekho.',
      icon: <BookOpen className="w-5 h-5" />,
      topics: [
        {
          titleEn: 'AI Ethics & Bias',
          titleHyd: 'AI ki ethics aur bias',
          descriptionEn: 'Understanding fairness, accountability, and transparency',
          descriptionHyd: 'Fairness, accountability aur transparency',
          duration: '30 min',
        },
        {
          titleEn: 'AI Hallucinations',
          titleHyd: 'AI jhooth bolna',
          descriptionEn: 'Why AI generates false information and how to prevent it',
          descriptionHyd: 'AI kyun jhooth bolte hain aur rokne ke tareeqe',
          duration: '20 min',
        },
        {
          titleEn: 'AI Safety & Alignment',
          titleHyd: 'AI ki suraksha',
          descriptionEn: 'Ensuring AI systems align with human values',
          descriptionHyd: 'AI ko insaani values se jodna',
          duration: '25 min',
        },
      ],
      timeEstimate: '75 min',
      difficulty: 'advanced',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'level5',
      titleEn: 'Business & Career',
      titleHyd: 'Naukri aur Business',
      descriptionEn: 'Learn how to apply AI in business and launch your AI career.',
      descriptionHyd: 'Business mein AI kaise lagao aur career banao.',
      icon: <Briefcase className="w-5 h-5" />,
      topics: [
        {
          titleEn: 'AI Use Cases in Business',
          titleHyd: 'Business mein AI ke upyog',
          descriptionEn: 'Healthcare, finance, marketing, and customer service applications',
          descriptionHyd: 'Healthcare, finance, marketing aur aur use cases',
          duration: '30 min',
        },
        {
          titleEn: 'Building AI Products',
          titleHyd: 'AI products banao',
          descriptionEn: 'From idea to deployment: creating AI solutions',
          descriptionHyd: 'Idea se leke deployment tak AI products',
          duration: '40 min',
        },
        {
          titleEn: 'AI Career Paths',
          titleHyd: 'AI mein career',
          descriptionEn: 'Data scientist, ML engineer, AI researcher, and more',
          descriptionHyd: 'Data scientist, ML engineer, researcher aur aur roles',
          duration: '25 min',
        },
      ],
      timeEstimate: '95 min',
      difficulty: 'advanced',
      color: 'from-green-500 to-green-600',
    },
  ];

  const getLevelIcon = (difficulty: string) => {
    if (difficulty === 'beginner') return <Zap className="w-4 h-4" />;
    if (difficulty === 'intermediate') return <Target className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  return (
    <section className="w-full py-16 px-6 bg-gradient-to-br from-brand-sand/30 to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-amber/15 rounded-full text-xs font-semibold text-brand-amber shadow-sm mb-6"
          >
            <Target className="w-4 h-4" />
            <span>{lang === 'en' ? 'Your Learning Path' : 'Aapka Seekhne ka Rasta'}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal mb-4 text-balance">
            {lang === 'en' ? 'Master AI in 5 Levels' : 'AI Mein Mahir Bano 5 Levels Mein'}
          </h2>

          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Follow this structured path from complete beginner to AI expert. Each level builds on the previous one.'
              : 'Iss structured raste ko follow karo. Har level pichle par build hota hai.'}
          </p>
        </div>

        {/* Roadmap Levels */}
        <div className="space-y-4">
          {roadmapLevels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() =>
                  setExpandedLevel(expandedLevel === level.id ? '' : level.id)
                }
                className="w-full"
              >
                <div
                  className={`bg-gradient-to-r ${level.color} p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 text-white`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        {getLevelIcon(level.difficulty)}
                        <h3 className="text-2xl font-bold">
                          {lang === 'en' ? level.titleEn : level.titleHyd}
                        </h3>
                        <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                          {level.difficulty.charAt(0).toUpperCase() +
                            level.difficulty.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm">
                        {lang === 'en'
                          ? level.descriptionEn
                          : level.descriptionHyd}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-lg">
                        {level.timeEstimate}
                      </span>
                      <motion.div
                        animate={{
                          rotate: expandedLevel === level.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedLevel === level.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-brand-slate/10 rounded-b-xl overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {level.topics.map((topic, topicIndex) => (
                        <motion.div
                          key={topicIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: topicIndex * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-brand-sand/20 rounded-lg hover:bg-brand-sand/40 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-brand-charcoal mb-1">
                              {lang === 'en'
                                ? topic.titleEn
                                : topic.titleHyd}
                            </h4>
                            <p className="text-sm text-brand-muted">
                              {lang === 'en'
                                ? topic.descriptionEn
                                : topic.descriptionHyd}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-brand-amber bg-brand-amber/10 px-3 py-1 rounded-full whitespace-nowrap">
                            {topic.duration}
                          </span>
                        </motion.div>
                      ))}

                      {/* Complete Level Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (completedLevels.includes(level.id)) {
                            setCompletedLevels(
                              completedLevels.filter((id) => id !== level.id)
                            );
                          } else {
                            setCompletedLevels([...completedLevels, level.id]);
                          }
                        }}
                        className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          completedLevels.includes(level.id)
                            ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                            : 'bg-brand-amber/20 text-brand-amber border border-brand-amber/30 hover:bg-brand-amber/30'
                        }`}
                      >
                        {completedLevels.includes(level.id) ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            {lang === 'en' ? 'Completed' : 'Poora ho gaya'}
                          </>
                        ) : (
                          <>
                            {lang === 'en'
                              ? 'Mark as Complete'
                              : 'Complete Karo'}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-white rounded-xl border border-brand-slate/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-charcoal">
              {lang === 'en' ? 'Your Progress' : 'Aapni Pishrani'}
            </h3>
            <span className="text-2xl font-bold text-brand-amber">
              {Math.round((completedLevels.length / roadmapLevels.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-brand-slate/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(completedLevels.length / roadmapLevels.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-brand-amber to-brand-amber/80 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
