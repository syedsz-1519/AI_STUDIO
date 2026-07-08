import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Play, 
  ArrowLeft, 
  Award, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Shield, 
  Zap,
  Flame,
  Star,
  Timer,
  Trophy,
  BookOpen,
  Cpu,
  Database,
  Globe,
  Crown,
  User,
  Share2
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { quizModules, QuizModule, QuizSection, Question } from '../data/quizQuestions';
import { syncQuizProgressToCloud } from '../lib/firebase';
import ClayLogo from './ClayLogo';
import Confetti from './Confetti';
import Leaderboard from './Leaderboard';
import BadgeShareModal from './BadgeShareModal';

// Browser Audio Synthesizer for Retro Game SFX
const playTone = (frequency: number, type: OscillatorType, duration: number, volume = 0.1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio Context blocked or not supported
  }
};

const playCorrectSFX = () => {
  playTone(523.25, 'sine', 0.1, 0.12); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.15, 0.12), 80); // E5
  setTimeout(() => playTone(783.99, 'sine', 0.2, 0.15), 160); // G5
};

const playWrongSFX = () => {
  playTone(220, 'sawtooth', 0.25, 0.08); // A3 Low
  setTimeout(() => playTone(180, 'sawtooth', 0.3, 0.08), 100);
};

const playVictorySFX = () => {
  const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5]; // C scale ascending
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 'triangle', 0.15, 0.1);
    }, idx * 100);
  });
};

export default function AIArena() {
  const { lang } = useLanguage();
  const currentLang = lang === 'hyd' ? 'ur' : 'en';
  
  // Game state
  const [score, setScore] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<QuizModule | null>(null);
  const [activeSection, setActiveSection] = useState<QuizSection | null>(null);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'victory'>('lobby');
  
  // Active Question flow
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [runCorrectCount, setRunCorrectCount] = useState<number>(0);
  const [runPointsEarned, setRunPointsEarned] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<boolean[]>([]); // Track correct/incorrect for current 5 questions
  const [timeLeft, setTimeLeft] = useState<number>(20); // 20s per question

  const selectedIdxRef = useRef<number | null>(null);
  useEffect(() => {
    selectedIdxRef.current = selectedIdx;
  }, [selectedIdx]);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [leaderboardName, setLeaderboardName] = useState<string>(() => {
    return localStorage.getItem('clay_leaderboard_username') || '';
  });
  const [sharingAchievement, setSharingAchievement] = useState<any | null>(null);

  // Load from local storage & register events for Firebase updates
  useEffect(() => {
    const handleSync = () => {
      const savedScore = localStorage.getItem('clay_quiz_score') || '0';
      const savedCompleted = localStorage.getItem('clay_quiz_completed') || '{}';
      const savedHighScores = localStorage.getItem('clay_quiz_high_scores') || '{}';
      const savedProfile = localStorage.getItem('clay_user_profile');
      
      setScore(parseInt(savedScore, 10));
      setCompletedSections(JSON.parse(savedCompleted));
      setHighScores(JSON.parse(savedHighScores));

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        setUserProfile(null);
      }
    };
    
    handleSync();
    window.addEventListener('clay_auth_state_changed', handleSync);
    return () => window.removeEventListener('clay_auth_state_changed', handleSync);
  }, []);

  // Compute Rank Badge based on score
  const getRankBadge = () => {
    if (score >= 400) return { title: { en: "AGI Commander", ur: "AGI Sipahsalar" }, color: "bg-red-500/15 text-red-600 border-red-500/25" };
    if (score >= 250) return { title: { en: "Prompt Master", ur: "Prompt Ka Ustad" }, color: "bg-brand-amber/15 text-brand-amber border-brand-amber/25" };
    if (score >= 120) return { title: { en: "Transformer Expert", ur: "Transformer Mahir" }, color: "bg-purple-500/15 text-purple-600 border-purple-500/25" };
    if (score >= 50) return { title: { en: "Neural Apprentice", ur: "Neural Shagird" }, color: "bg-blue-500/15 text-blue-600 border-blue-500/25" };
    return { title: { en: "Silicon Novice", ur: "Shuruati Explorer" }, color: "bg-brand-slate/15 text-brand-slate border-brand-slate/25" };
  };

  const rank = getRankBadge();

  const [lobbyTab, setLobbyTab] = useState<'modules' | 'achievements' | 'leaderboard'>('modules');

  // Dynamic Achievements & Badge System
  const getAchievements = () => {
    // 1. First Steps: Unlock 1 section
    const completedCount = Object.values(completedSections).filter(Boolean).length;
    
    // 2. High Scorer: score >= 10 on any section
    const scores = Object.values(highScores) as number[];
    const hasHighScore = scores.some(s => s >= 10);
    const maxScoreVal = scores.length > 0 ? Math.max(...scores) : 0;

    // 3. Perfect run: score 15 (all 5 correct) on any section
    const hasPerfectRun = scores.some(s => s >= 15);

    // 4. Module 1 Conqueror: Complete all 3 sections of Mod 1
    const m1Secs = ['intro', 'reg', 'cls'];
    const m1DoneCount = m1Secs.filter(id => completedSections[id]).length;
    
    // 5. Module 2 Conqueror: Complete all 3 sections of Mod 2
    const m2Secs = ['dt', 'pre', 'opt'];
    const m2DoneCount = m2Secs.filter(id => completedSections[id]).length;

    // 6. Module 3 Conqueror: Complete all 3 of Mod 3
    const m3Secs = ['over', 'regu', 'eval'];
    const m3DoneCount = m3Secs.filter(id => completedSections[id]).length;

    // 7. Speed Demon: high score of 15 (perfect) on any of Module 4 or 5 sections
    const advancedSecs = ['cnn', 'rnn', 'tf', 'prompt', 'rag', 'llm'];
    const advancedHighScores = advancedSecs.map(id => highScores[id] || 0);
    const hasAdvancedPerfect = advancedHighScores.some(s => s >= 15);

    // 8. Grandmaster of Silicon: Complete all 15 sections
    const totalSectionsCount = 15; // 5 modules * 3 sections

    return [
      {
        id: 'first_steps',
        title: { en: "First Steps", ur: "Pehla Qadam" },
        desc: { 
          en: "Complete your very first AI Arena quiz section to initialize your learning weights.", 
          ur: "Apna pehla AI Arena test pass karein aur seekhne ka aghaaz karein." 
        },
        icon: 'BookOpen',
        color: 'blue',
        unlocked: completedCount >= 1,
        currentProgress: completedCount >= 1 ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'high_scorer',
        title: { en: "High Scorer", ur: "Aala Karkardagi" },
        desc: { 
          en: "Achieve a score of 10 points or more on any individual quiz section.", 
          ur: "Kisi bhi test me 10 ya us se zyada points haasil karein." 
        },
        icon: 'Zap',
        color: 'pink',
        unlocked: hasHighScore,
        currentProgress: maxScoreVal >= 10 ? 10 : maxScoreVal,
        maxProgress: 10
      },
      {
        id: 'perfect_precision',
        title: { en: "Perfect Precision", ur: "Bemisaal Mahaarat" },
        desc: { 
          en: "Get a perfect score of 15 points (5/5 correct answers) in any section.", 
          ur: "Kisi bhi aik section me mukammal 15 points (5/5 sahi jawab) haasil karein." 
        },
        icon: 'Award',
        color: 'yellow',
        unlocked: hasPerfectRun,
        currentProgress: hasPerfectRun ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'mod1_conqueror',
        title: { en: "Module 1 Conqueror", ur: "Module 1 Fateh" },
        desc: { 
          en: "Unlock and complete all 3 core quiz sections in Module 1: Foundations of ML.", 
          ur: "Module 1 Foundations of ML ke tamam 3 sections ko kamyabi se mukammal karein." 
        },
        icon: 'Cpu',
        color: 'green',
        unlocked: m1DoneCount === 3,
        currentProgress: m1DoneCount,
        maxProgress: 3
      },
      {
        id: 'mod2_conqueror',
        title: { en: "Module 2 Conqueror", ur: "Module 2 Fateh" },
        desc: { 
          en: "Complete all 3 core sections of Module 2: Data Engineering & Preprocessing.", 
          ur: "Module 2 Data Engineering & Preprocessing ke tamam 3 sections clear karein." 
        },
        icon: 'Database',
        color: 'purple',
        unlocked: m2DoneCount === 3,
        currentProgress: m2DoneCount,
        maxProgress: 3
      },
      {
        id: 'mod3_conqueror',
        title: { en: "Module 3 Conqueror", ur: "Module 3 Fateh" },
        desc: { 
          en: "Complete all 3 core sections of Module 3: Model Tuning & Evaluation.", 
          ur: "Module 3 Model Tuning & Evaluation ke tamam 3 sections clear karein." 
        },
        icon: 'Globe',
        color: 'indigo',
        unlocked: m3DoneCount === 3,
        currentProgress: m3DoneCount,
        maxProgress: 3
      },
      {
        id: 'deep_learner',
        title: { en: "Deep Learner", ur: "Gehra Seekhne Wala" },
        desc: { 
          en: "Achieve a perfect high score of 15 points in any advanced neural network or LLM section (Modules 4 or 5).", 
          ur: "Module 4 ya 5 ke kisi advanced neural network ya LLM test me 15 points haasil karein." 
        },
        icon: 'Trophy',
        color: 'red',
        unlocked: hasAdvancedPerfect,
        currentProgress: hasAdvancedPerfect ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'grandmaster',
        title: { en: "Grandmaster of Silicon", ur: "Silicon Grandmaster" },
        desc: { 
          en: "Conquer all 15 quiz sections in the AI Arena with passing scores to achieve legendary status.", 
          ur: "AI Arena ke tamam 15 sections ko kamyabi se pass kar ke legendary rutba haasil karein." 
        },
        icon: 'Sparkles',
        color: 'yellow',
        unlocked: completedCount === totalSectionsCount,
        currentProgress: completedCount,
        maxProgress: totalSectionsCount
      }
    ];
  };

  const achievements = getAchievements();

  // Locked states logic: Module X is unlocked if Module X-1 has at least 1 section completed (or all, let's say at least 1 completed to keep it engaging yet guided!)
  const isModuleLocked = (mod: QuizModule) => {
    if (mod.number === 1) return false;
    const prevMod = quizModules.find(m => m.number === mod.number - 1);
    if (!prevMod) return false;
    
    // Check if any section in previous module is marked completed
    return !prevMod.sections.some(sec => completedSections[sec.id]);
  };

  // Handle Timeout when countdown runs out
  const handleTimeout = () => {
    if (isAnswerChecked || !activeSection) return;
    const currentSelected = selectedIdxRef.current;
    
    const question = activeSection.questions[currentQuestionIdx];
    const correct = currentSelected !== null && currentSelected === question.answerIndex;
    
    setIsAnswerChecked(true);
    setAnswersLog(prev => [...prev, correct]);
    
    if (correct) {
      setRunCorrectCount(p => p + 1);
      setRunPointsEarned(p => p + question.points);
      if (soundEnabled) playCorrectSFX();
    } else {
      if (soundEnabled) playWrongSFX();
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'playing' || isAnswerChecked || !activeSection) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isAnswerChecked, currentQuestionIdx, activeSection, soundEnabled]);

  // Reset timer on question change
  useEffect(() => {
    if (gameState === 'playing') {
      setTimeLeft(20);
    }
  }, [gameState, currentQuestionIdx]);

  // Launch quiz run
  const handleStartSectionQuiz = (section: QuizSection) => {
    setActiveSection(section);
    setCurrentQuestionIdx(0);
    setSelectedIdx(null);
    setIsAnswerChecked(false);
    setRunCorrectCount(0);
    setRunPointsEarned(0);
    setAnswersLog([]);
    setGameState('playing');
    
    if (soundEnabled) playTone(440, 'sine', 0.1, 0.05);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedIdx(idx);
    if (soundEnabled) playTone(350, 'sine', 0.05, 0.05);
  };

  const handleVerifyAnswer = () => {
    if (selectedIdx === null || isAnswerChecked || !activeSection) return;
    
    const question = activeSection.questions[currentQuestionIdx];
    const correct = selectedIdx === question.answerIndex;
    
    setIsAnswerChecked(true);
    setAnswersLog(prev => [...prev, correct]);
    
    if (correct) {
      setRunCorrectCount(p => p + 1);
      setRunPointsEarned(p => p + question.points);
      if (soundEnabled) playCorrectSFX();
    } else {
      if (soundEnabled) playWrongSFX();
    }
  };

  const handleNextQuestion = () => {
    if (!activeSection) return;
    
    if (currentQuestionIdx < activeSection.questions.length - 1) {
      setCurrentQuestionIdx(p => p + 1);
      setSelectedIdx(null);
      setIsAnswerChecked(false);
    } else {
      // Completed last question of the 5-MCQ batch! Let's trigger Victory
      handleCompleteSectionRun();
    }
  };

  const handleCompleteSectionRun = async () => {
    if (!activeSection) return;
    
    const prevHighScore = highScores[activeSection.id] || 0;
    const isNewHigh = runPointsEarned > prevHighScore;
    
    // Calculate new high score and global score delta
    const scoreDiff = isNewHigh ? (runPointsEarned - prevHighScore) : 0;
    const updatedGlobalScore = score + scoreDiff;
    
    const updatedCompleted = { ...completedSections, [activeSection.id]: true };
    const updatedHighScores = { ...highScores, [activeSection.id]: Math.max(prevHighScore, runPointsEarned) };
    
    // Write state
    setScore(updatedGlobalScore);
    setCompletedSections(updatedCompleted);
    setHighScores(updatedHighScores);
    setGameState('victory');
    
    if (soundEnabled) playVictorySFX();

    // Sync back to Firebase Cloud
    await syncQuizProgressToCloud(updatedGlobalScore, updatedCompleted, updatedHighScores);
  };

  const handleExitToLobby = () => {
    setGameState('lobby');
    setActiveSection(null);
  };

  // Reset progress confirmation
  const handleResetProgress = async () => {
    if (window.confirm(lang === 'en' ? "Are you sure you want to reset your AI Arena high scores and points to 0?" : "Kya aap such me apne saare points aur high scores reset karna chahte hain?")) {
      setScore(0);
      setCompletedSections({});
      setHighScores({});
      setGameState('lobby');
      setActiveSection(null);
      
      await syncQuizProgressToCloud(0, {}, {});
    }
  };

  // Clay's Commentary based on current status
  const getClayCommentary = () => {
    if (gameState === 'playing') {
      if (isAnswerChecked) {
        const correct = selectedIdx === activeSection?.questions[currentQuestionIdx].answerIndex;
        if (correct) {
          return lang === 'en' 
            ? "Excellent! Your neural pathways are fully matching mine." 
            : "Zabardast! Aapke dimaag ke patterns bilkul mujhse match ho rahe hain.";
        } else {
          return lang === 'en' 
            ? "Ah! Don't fret. Learning involves updating weights through error backpropagation." 
            : "Koi baat nahi! Galti hi machine ko behtar seekhne me madad karti hai.";
        }
      }
      if (timeLeft <= 5) {
        return lang === 'en'
          ? "Hurry! The countdown is running low! Confirm your selection now."
          : "Jaldi karein! Waqt khatam ho raha hai! Apne option ko confirm karein.";
      }
      return lang === 'en' 
        ? `Tackling Question ${currentQuestionIdx + 1} of 5. Read all 4 options closely!` 
        : `Sawaal number ${currentQuestionIdx + 1} samne hai. Charo options ko dhyan se parhein!`;
    }

    if (lobbyTab === 'achievements') {
      const unlockedCount = achievements.filter(a => a.unlocked).length;
      if (unlockedCount === 0) {
        return lang === 'en'
          ? "No badges unlocked yet! Begin with Module 1, Section 1 to earn your first AI Initiate medal!"
          : "Abhi tak koi badge unlock nahi hua! Apna pehla badge haasil karne ke liye Module 1, Section 1 se shuru karein!";
      }
      if (unlockedCount === 8) {
        return lang === 'en'
          ? "Spectacular! You have unlocked every single achievement in the database! Legendary status."
          : "Behtareen! Aapne database ka har aik badge unlock kar liya hai! Aap aik tareekhi legend hain.";
      }
      return lang === 'en'
        ? `You have unlocked ${unlockedCount} of 8 achievements. Keep crushing quizzes to claim them all!`
        : `Aapne 8 mein se ${unlockedCount} badges unlock kiye hain. Saare badges haasil karne ke liye koshish jaari rakhein!`;
    }

    if (lobbyTab === 'leaderboard') {
      if (score === 0) {
        return lang === 'en'
          ? "You are currently at the bottom of the ladder! Complete some modules to climb the rankings!"
          : "Aap abhi rankings me sabse neeche hain! Rank badhane ke liye tests clear karein!";
      }
      if (score >= 450) {
        return lang === 'en'
          ? "Amazing! You have surpassed Alan Turing and claimed the absolute peak of the AI Arena!"
          : "Kamal kar diya! Aapne Alan Turing ko bhi peeche chor kar AI Arena ki choti fatah kar li!";
      }
      return lang === 'en'
        ? `You have compiled ${score} XP. Keep completing modules to overtake your competitors!`
        : `Aapke paas ${score} XP hain. Apne muqablay baazo se aage nikalne ke liye tests clear karte rahein!`;
    }

    if (score === 0) {
      return lang === 'en'
        ? "Welcome to the AI Arena! Unlock modules sequentially by answering my topic-wise MCQs."
        : "AI Arena me aapka khush-amdeed! Ek-ek kar ke modules ke test pass karein aur points kamayein.";
    }
    
    if (score >= 400) {
      return lang === 'en'
        ? "Incredible! You have reached AGI Commander rank! I bow down to your silicon intelligence."
        : "MashaAllah! Aap AGI Commander ban chuke hain! Ab aapka dimaag computer se bhi tez hai.";
    }

    return lang === 'en'
      ? `Great job so far! You've gathered ${score} points. Can you reach the Hard Module 5 and unlock AGI level?`
      : `Boht khoob! Aapke paas ${score} points hain. Kya aap aakhri mushkil Module 5 ko unlock kar sakte hain?`;
  };

  return (
    <div id="ai-arena" className="max-w-5xl mx-auto my-16 px-6 relative text-left scroll-mt-24">
      {/* Visual background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-amber/5 rounded-full blur-3xl -ml-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl -mr-20 pointer-events-none" />

      {/* Main Container HUD Frame */}
      <div className="bg-white border border-brand-slate/15 rounded-3xl shadow-xl overflow-hidden relative backdrop-blur-xs">
        
        {/* Arena Navigation & Control Header */}
        <div className="bg-brand-charcoal text-brand-cream p-5 md:px-8 border-b border-brand-slate/15 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5 select-none text-left">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 border border-brand-amber/35 flex items-center justify-center text-brand-amber shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase font-black text-brand-amber tracking-wider">
                {lang === 'en' ? "TACTILE GAMIFIED HORIZON" : "GAMIFIED LEARNING PORTAL"}
              </span>
              <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
                AI Arena
              </h2>
            </div>
          </div>

          {/* Sound, Reset & Points HUD */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
              title={soundEnabled ? "Mute audio" : "Unmute audio"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-amber" /> : <VolumeX className="w-4 h-4 text-brand-slate" />}
            </button>
            
            <button
              onClick={handleResetProgress}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white/70 hover:text-white cursor-pointer"
              title="Reset Arena Progress"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-brand-amber text-brand-charcoal rounded-xl border border-brand-amber/25 font-mono font-bold text-sm">
              <Star className="w-4 h-4 fill-current text-brand-charcoal" />
              <span>{score} PTS</span>
            </div>
          </div>
        </div>

        {/* Dynamic Coach: Clay Commentary HUD */}
        <div className="bg-brand-sand/40 border-b border-brand-slate/10 px-6 py-4 flex items-start gap-4 text-left select-none">
          <div className="shrink-0 pt-0.5">
            <ClayLogo size={36} />
          </div>
          <div className="flex-1 space-y-1">
            <span className="block text-[9px] font-mono uppercase font-extrabold text-brand-slate/60 tracking-wider">
              CLAY THE HOST • COMMENTS
            </span>
            <p className="text-xs md:text-sm font-semibold text-brand-charcoal leading-relaxed">
              "{getClayCommentary()}"
            </p>
          </div>
        </div>

        {/* VIEW 1: LOBBY & MODULE SELECTION */}
        <AnimatePresence mode="wait">
          {gameState === 'lobby' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 space-y-8 text-left"
            >
              {/* Profile Card & Global Rank Indicator */}
              <div className="p-5 bg-brand-sand/20 border border-brand-slate/10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="block text-[9px] font-mono uppercase text-brand-muted font-bold">
                    {lang === 'en' ? "ACTIVE COMBATANT STATUS" : "Aapka Active Status"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-charcoal">
                      {lang === 'en' ? "Your Level:" : "Aapka Level:"}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold border font-mono ${rank.color}`}>
                      {lang === 'en' ? rank.title.en : rank.title.ur}
                    </span>
                  </div>
                </div>
                
                {/* Stats Breakdown Row */}
                <div className="flex flex-wrap gap-5 text-left font-mono">
                  <div className="space-y-0.5">
                    <span className="block text-[9px] uppercase text-brand-muted font-bold">{lang === 'en' ? "COMPLETED SECTIONS" : "MUKAMMAL SECTIONS"}</span>
                    <span className="block text-base font-black text-brand-charcoal">
                      {Object.values(completedSections).filter(Boolean).length} / 15
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-brand-slate/15 pl-5">
                    <span className="block text-[9px] uppercase text-brand-muted font-bold">{lang === 'en' ? "ARENA LEVEL COMPOSITE" : "TOTAL ARENA SCORE"}</span>
                    <span className="block text-base font-black text-brand-amber">
                      {score} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Selector: Modules vs Achievements */}
              <div className="flex border-b border-brand-slate/15 pb-1">
                <button
                  onClick={() => {
                    setLobbyTab('modules');
                    if (soundEnabled) playTone(550, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'modules'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Shield className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Quiz Modules" : "Sawaalat Modules"}</span>
                </button>
                <button
                  onClick={() => {
                    setLobbyTab('achievements');
                    if (soundEnabled) playTone(650, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'achievements'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Achievements & Badges" : "Kamyabiyan aur Badges"}</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-charcoal font-mono font-bold">
                    {achievements.filter(a => a.unlocked).length}/8
                  </span>
                </button>
                <button
                  onClick={() => {
                    setLobbyTab('leaderboard');
                    if (soundEnabled) playTone(750, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'leaderboard'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Crown className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Global Leaderboard" : "Aalmi Rankings"}</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {lobbyTab === 'modules' ? (
                  <motion.div
                    key="modules-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Modules Roadmap */}
                    <div className="space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-brand-charcoal flex items-center gap-2 select-none">
                          <Shield className="w-5 h-5 text-brand-amber" />
                          <span>{lang === 'en' ? "Five Difficulty-Progressive Modules" : "Dushwari Ke 5 Mukhtalif Modules"}</span>
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-brand-slate bg-brand-sand px-2.5 py-1 rounded border border-brand-slate/10 uppercase select-none">
                          {lang === 'en' ? "Sequentially Locked" : "Sequence me locked"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {quizModules.map((mod) => {
                          const locked = isModuleLocked(mod);
                          const isActive = activeModule?.id === mod.id;
                          
                          // Count completed sections in this module
                          const modCompletedCount = mod.sections.filter(sec => completedSections[sec.id]).length;
                          
                          // Difficulty colors
                          let diffBadge = "bg-green-500/10 text-green-700 border-green-500/20";
                          if (mod.difficulty === 'Medium-Easy') diffBadge = "bg-blue-500/10 text-blue-700 border-blue-500/20";
                          if (mod.difficulty === 'Medium') diffBadge = "bg-purple-500/10 text-purple-700 border-purple-500/20";
                          if (mod.difficulty === 'Medium-Hard') diffBadge = "bg-brand-amber/10 text-brand-amber border-brand-amber/20";
                          if (mod.difficulty === 'Hard') diffBadge = "bg-red-500/10 text-red-700 border-red-500/20";

                          return (
                            <motion.button
                              key={mod.id}
                              onClick={() => {
                                if (locked) {
                                  alert(lang === 'en' 
                                    ? `This module is locked! Answer at least one section in Module ${mod.number - 1} first to unlock weight updates.` 
                                    : `Ye module locked hai! Pehle Module ${mod.number - 1} ke kisi aik section ka test clear karein.`);
                                  return;
                                }
                                setActiveModule(isActive ? null : mod);
                              }}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all duration-200 cursor-pointer relative ${
                                locked 
                                  ? 'bg-brand-sand/20 border-brand-slate/10 opacity-60'
                                  : isActive 
                                    ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal scale-102 shadow-md'
                                    : 'bg-white hover:bg-brand-sand border-brand-slate/15 hover:scale-101 hover:border-brand-slate/30'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Locking Badge overlay */}
                              {locked && (
                                <div className="absolute top-3 right-3 p-1.5 bg-brand-sand border border-brand-slate/10 rounded-lg text-brand-muted">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 rounded ${
                                    isActive ? 'bg-white/10 border-white/20 text-brand-amber' : 'bg-brand-sand text-brand-slate border-brand-slate/10'
                                  }`}>
                                    MOD {mod.number}
                                  </span>
                                  
                                  <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 rounded uppercase ${
                                    isActive ? 'bg-white/5 border-white/10 text-white' : diffBadge
                                  }`}>
                                    {mod.difficulty}
                                  </span>
                                </div>

                                <h4 className={`font-display font-black text-sm tracking-tight leading-snug line-clamp-2 ${
                                  isActive ? 'text-brand-cream' : 'text-brand-charcoal'
                                }`}>
                                  {lang === 'en' ? mod.title.en : mod.title.ur}
                                </h4>
                              </div>

                              <div className="pt-2 border-t border-brand-slate/10 w-full flex items-center justify-between text-xs font-mono">
                                <span className={isActive ? 'text-white/60' : 'text-brand-muted'}>
                                  {lang === 'en' ? "COMPLETED" : "PASS HUE"}:
                                </span>
                                <span className={`font-bold ${isActive ? 'text-brand-amber' : 'text-brand-charcoal'}`}>
                                  {modCompletedCount}/3
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sub-Section Accordion Drawer */}
                    <AnimatePresence>
                      {activeModule && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 border border-brand-slate/15 bg-brand-sand/25 rounded-2xl space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="block text-[10px] font-mono uppercase font-black text-brand-amber">
                              {lang === 'en' ? `Module ${activeModule.number} Sections Checklist` : `Module ${activeModule.number} ke Sections`}
                            </span>
                            <span className="text-xs font-mono font-medium text-brand-muted">
                              {lang === 'en' ? "Every section contains 5 topic-focused MCQs" : "Har section me 5 sawalat hain"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {activeModule.sections.map((sec) => {
                              const scoreRecorded = highScores[sec.id] || 0;
                              const isDone = completedSections[sec.id];
                              const maxPossiblePoints = sec.questions.reduce((a, b) => a + b.points, 0);

                              return (
                                <div
                                  key={sec.id}
                                  className="bg-white p-5 border border-brand-slate/15 rounded-xl flex flex-col justify-between gap-4 text-left"
                                >
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-mono font-bold text-brand-amber uppercase">
                                        {sec.id.toUpperCase()}
                                      </span>
                                      
                                      {isDone ? (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black text-green-600 bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/20">
                                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                                          <span>{lang === 'en' ? "PASSED" : "MUKAMMAL"}</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black text-brand-slate/60 bg-brand-sand px-2 py-0.5 rounded-full border border-brand-slate/10">
                                          <span>{lang === 'en' ? "READY" : "TAYYAR"}</span>
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="font-sans font-bold text-sm text-brand-charcoal">
                                      {lang === 'en' ? sec.title.en : sec.title.ur}
                                    </h5>
                                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                                      {lang === 'en' ? sec.subtitle.en : sec.subtitle.ur}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
                                    <div className="text-[10px] font-mono">
                                      <span className="block text-brand-muted uppercase">{lang === 'en' ? "HIGH SCORE" : "BEST SCORE"}</span>
                                      <span className="block text-xs font-black text-brand-charcoal">
                                        {scoreRecorded} / {maxPossiblePoints} PTS
                                      </span>
                                    </div>

                                    <button
                                      onClick={() => handleStartSectionQuiz(sec)}
                                      className="px-3.5 py-2 bg-brand-amber hover:bg-brand-amber/95 border border-brand-amber/20 hover:border-brand-amber/45 rounded-lg text-xs font-mono font-black text-brand-charcoal flex items-center gap-1 cursor-pointer transition-transform duration-150 hover:scale-102 active:scale-98"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>{lang === 'en' ? "ENTER" : "SHURU"}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : lobbyTab === 'achievements' ? (
                  <motion.div
                    key="achievements-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-left"
                  >
                    {/* Achievements Dashboard Header Banner */}
                    <div className="p-6 bg-brand-charcoal text-brand-cream rounded-2xl relative overflow-hidden shadow-lg border border-brand-slate/15">
                      {/* Decorative lights */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-2">
                          <span className="block text-[10px] font-mono uppercase font-black text-brand-amber tracking-wider">
                            {lang === 'en' ? "ACCOMPLISHMENT LEDGER" : "SHARAF-E-KAMYABI"}
                          </span>
                          <h3 className="font-display text-2xl font-extrabold tracking-tight">
                            {lang === 'en' ? "Achievements Showcase" : "Aapka Badge Dashboard"}
                          </h3>
                          <p className="text-xs text-brand-cream/70 max-w-xl leading-relaxed">
                            {lang === 'en' 
                              ? "Earn special cryptographic badges as you progress through difficulty tiers and conquer quizzes with high scores. Your silicon wisdom is recorded here."
                              : "Jaise jaise aap modules pass karenge aur behtareen high scores banayenge, aapko khusoosi badges se nawaza jayega. Aapki aqalmandi ka mukammal record yahan mehfooz hai."}
                          </p>
                        </div>

                        {/* Unlocked Badges count widget */}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-xl shrink-0">
                          <div className="relative">
                            {/* circular progress svg */}
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle cx="28" cy="28" r="24" className="stroke-white/10 fill-none" strokeWidth="4" />
                              <circle 
                                cx="28" 
                                cy="28" 
                                r="24" 
                                className="stroke-brand-amber fill-none transition-all duration-500" 
                                strokeWidth="4" 
                                strokeDasharray={2 * Math.PI * 24}
                                strokeDashoffset={2 * Math.PI * 24 * (1 - achievements.filter(a => a.unlocked).length / 8)}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold">
                              {achievements.filter(a => a.unlocked).length}/8
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] font-mono text-white/50 uppercase">
                              {lang === 'en' ? "UNLOCKED BADGES" : "UNLOCK HUE BADGES"}
                            </span>
                            <span className="text-lg font-bold font-mono text-brand-amber">
                              {Math.round((achievements.filter(a => a.unlocked).length / 8) * 100)}% Complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badges Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {achievements.map((ach, idx) => {
                        // Icon resolver
                        let IconComponent = Sparkles;
                        if (ach.icon === 'BookOpen') IconComponent = BookOpen;
                        if (ach.icon === 'Cpu') IconComponent = Cpu;
                        if (ach.icon === 'Zap') IconComponent = Zap;
                        if (ach.icon === 'Database') IconComponent = Database;
                        if (ach.icon === 'Globe') IconComponent = Globe;
                        if (ach.icon === 'Award') IconComponent = Award;
                        if (ach.icon === 'Trophy') IconComponent = Trophy;

                        // Color theme resolver
                        let colorClasses = {
                          bg: "bg-amber-500/10 border-amber-500/20 text-amber-600",
                          glow: "shadow-amber-500/10 ring-amber-500/20",
                          progress: "bg-amber-500"
                        };
                        if (ach.color === 'blue') {
                          colorClasses = {
                            bg: "bg-blue-500/10 border-blue-500/20 text-blue-600",
                            glow: "shadow-blue-500/10 ring-blue-500/20",
                            progress: "bg-blue-500"
                          };
                        } else if (ach.color === 'purple') {
                          colorClasses = {
                            bg: "bg-purple-500/10 border-purple-500/20 text-purple-600",
                            glow: "shadow-purple-500/10 ring-purple-500/20",
                            progress: "bg-purple-500"
                          };
                        } else if (ach.color === 'pink') {
                          colorClasses = {
                            bg: "bg-pink-500/10 border-pink-500/20 text-pink-600",
                            glow: "shadow-pink-500/10 ring-pink-500/20",
                            progress: "bg-pink-500"
                          };
                        } else if (ach.color === 'green') {
                          colorClasses = {
                            bg: "bg-green-500/10 border-green-500/20 text-green-600",
                            glow: "shadow-green-500/10 ring-green-500/20",
                            progress: "bg-green-500"
                          };
                        } else if (ach.color === 'red') {
                          colorClasses = {
                            bg: "bg-red-500/10 border-red-500/20 text-red-600",
                            glow: "shadow-red-500/10 ring-red-500/20",
                            progress: "bg-red-500"
                          };
                        } else if (ach.color === 'yellow') {
                          colorClasses = {
                            bg: "bg-brand-amber/10 border-brand-amber/20 text-brand-amber",
                            glow: "shadow-brand-amber/10 ring-brand-amber/20",
                            progress: "bg-brand-amber"
                          };
                        } else if (ach.color === 'indigo') {
                          colorClasses = {
                            bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
                            glow: "shadow-indigo-500/10 ring-indigo-500/20",
                            progress: "bg-indigo-500"
                          };
                        }

                        const progressPercent = Math.min((ach.currentProgress / ach.maxProgress) * 100, 100);

                        return (
                          <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            className={`p-5 rounded-2xl border transition-all duration-300 relative select-none flex flex-col justify-between gap-4 h-64 ${
                              ach.unlocked
                                ? 'bg-white border-brand-slate/15 hover:border-brand-slate/30 shadow-sm hover:shadow-md hover:scale-101'
                                : 'bg-brand-sand/15 border-brand-slate/5 opacity-70'
                            }`}
                          >
                            {/* Lock overlay icon for locked achievements, Share button for unlocked */}
                            {!ach.unlocked ? (
                              <div className="absolute top-4 right-4 text-brand-slate/40">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSharingAchievement(ach);
                                  if (soundEnabled) playTone(600, 'sine', 0.05, 0.05);
                                }}
                                title={lang === 'en' ? "Share My Badge" : "Badge Share Karein"}
                                className="absolute top-4 right-4 p-1.5 bg-brand-sand/40 hover:bg-brand-amber/10 border border-transparent hover:border-brand-amber/25 text-brand-muted hover:text-brand-amber rounded-lg transition-all duration-200 cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Achievement details */}
                            <div className="space-y-3">
                              {/* Circle badge container */}
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 ${
                                ach.unlocked 
                                  ? `${colorClasses.bg} ${colorClasses.glow} ring-4` 
                                  : "bg-brand-sand border-brand-slate/10 text-brand-muted"
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>

                              <div className="space-y-1">
                                <h4 className={`font-display text-sm font-black tracking-tight leading-snug ${
                                  ach.unlocked ? 'text-brand-charcoal' : 'text-brand-muted'
                                }}`}>
                                  {lang === 'en' ? ach.title.en : ach.title.ur}
                                </h4>
                                <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                                  {lang === 'en' ? ach.desc.en : ach.desc.ur}
                                </p>
                              </div>
                            </div>

                            {/* Progress bar info */}
                            <div className="space-y-1.5 pt-2 border-t border-brand-slate/5">
                              <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-brand-muted">
                                <span>{lang === 'en' ? "PROGRESS" : "RAFQAAR"}</span>
                                <span className={ach.unlocked ? "text-brand-charcoal font-bold" : ""}>
                                  {ach.unlocked ? (lang === 'en' ? "UNLOCKED" : "HASIL SHUDA") : `${ach.currentProgress}/${ach.maxProgress}`}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden border border-brand-slate/5">
                                <div 
                                  className={`h-full transition-all duration-1000 rounded-full ${
                                    ach.unlocked ? colorClasses.progress : "bg-brand-slate/30"
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="leaderboard-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-1 space-y-6"
                  >
                    <Leaderboard
                      userScore={score}
                      userProfile={userProfile}
                      lang={lang}
                      soundEnabled={soundEnabled}
                      playTone={playTone}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* VIEW 2: ACTIVE PLAYING COMBAT ARENA */}
          {gameState === 'playing' && activeSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-8 space-y-6 text-left"
            >
              {/* Question Combat HUD Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-slate/10 pb-5">
                <button
                  onClick={handleExitToLobby}
                  className="flex items-center gap-1.5 text-xs font-mono font-black text-brand-slate uppercase hover:text-brand-amber transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'en' ? "ESCAPE ARENA" : "LOBBY ME WAPAS"}</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono font-bold text-brand-muted bg-brand-sand border border-brand-slate/10 px-2.5 py-1 rounded-lg">
                    {lang === 'en' ? "Section:" : "Section:"} <span className="text-brand-charcoal font-black">{lang === 'en' ? activeSection.title.en : activeSection.title.ur}</span>
                  </span>
                  
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-charcoal text-brand-amber border border-brand-charcoal/25 rounded-lg text-xs font-mono font-black">
                    <Flame className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
                    <span>+{activeSection.questions[currentQuestionIdx]?.points} PTS</span>
                  </span>
                </div>
              </div>

              {/* Live Battle Stats Trackers & Countdown Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-5 gap-2.5 max-w-sm w-full">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const wasAnswered = idx < answersLog.length;
                    const isCorrectAnswer = answersLog[idx];
                    const isCurrent = idx === currentQuestionIdx;

                    let boxStyle = "bg-brand-sand border-brand-slate/10 text-brand-muted";
                    if (isCurrent) boxStyle = "bg-brand-amber border-brand-amber text-brand-charcoal scale-102 ring-2 ring-brand-amber/20";
                    else if (wasAnswered) {
                      boxStyle = isCorrectAnswer 
                        ? "bg-green-500/20 border-green-500/35 text-green-700 font-bold" 
                        : "bg-red-500/20 border-red-500/35 text-red-700 font-bold";
                    }

                    return (
                      <div
                        key={`tracker-${idx}`}
                        className={`h-9 border rounded-xl flex items-center justify-center font-mono text-xs select-none transition-all duration-200 ${boxStyle}`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>

                {/* Countdown Timer HUD */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className={`relative flex items-center gap-2 px-4 py-1.5 border rounded-2xl font-mono text-xs font-bold transition-all duration-300 ${
                    isAnswerChecked 
                      ? 'bg-brand-sand/30 border-brand-slate/5 text-brand-muted opacity-60' 
                      : timeLeft <= 5 
                        ? 'bg-red-500/10 border-red-500/35 text-red-600 animate-pulse scale-105' 
                        : 'bg-brand-sand/50 border-brand-slate/10 text-brand-charcoal'
                  }`}>
                    <Timer className={`w-4 h-4 ${timeLeft <= 5 && !isAnswerChecked ? 'text-red-500 animate-spin-slow' : 'text-brand-amber'}`} />
                    <span className="tabular-nums">
                      {isAnswerChecked 
                        ? (lang === 'en' ? "RESOLVED" : "HAL SHUDA") 
                        : `${timeLeft}s`}
                    </span>
                  </div>

                  {/* Horizontal visual indicator bar */}
                  {!isAnswerChecked && (
                    <div className="w-16 h-1.5 bg-brand-sand border border-brand-slate/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-brand-amber'}`}
                        style={{ width: `${(timeLeft / 20) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Question Core Area */}
              <div className="space-y-6">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono font-black text-brand-amber uppercase tracking-widest">
                    {lang === 'en' ? `LIVE SYSTEM QUERY 0${currentQuestionIdx + 1}` : `MASHINI QUERY SHUMAR 0${currentQuestionIdx + 1}`}
                  </span>
                  <h3 className="font-display text-lg md:text-xl font-bold text-brand-charcoal leading-relaxed max-w-3xl">
                    {lang === 'en' 
                      ? activeSection.questions[currentQuestionIdx]?.text.en 
                      : activeSection.questions[currentQuestionIdx]?.text.ur}
                  </h3>
                </div>

                {/* 4 options buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                  {activeSection.questions[currentQuestionIdx]?.options[currentLang]?.map((opt, idx) => {
                    const isSelected = selectedIdx === idx;
                    const isCorrectOption = idx === activeSection.questions[currentQuestionIdx].answerIndex;
                    
                    let buttonStyle = "bg-white hover:bg-brand-sand border-brand-slate/15 text-brand-charcoal";
                    if (isSelected) {
                      buttonStyle = "bg-brand-charcoal text-brand-cream border-brand-charcoal";
                    }
                    if (isAnswerChecked) {
                      if (isCorrectOption) {
                        buttonStyle = "bg-green-500/10 border-green-500/35 text-green-700 font-semibold";
                      } else if (isSelected && !isCorrectOption) {
                        buttonStyle = "bg-red-500/10 border-red-500/35 text-red-700";
                      } else {
                        buttonStyle = "bg-white/50 border-brand-slate/5 text-brand-muted opacity-50 pointer-events-none";
                      }
                    }

                    return (
                      <button
                        key={`playing-opt-${idx}`}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswerChecked}
                        className={`p-4 md:p-5 rounded-2xl border text-left text-sm font-medium transition-all duration-200 flex items-start gap-3 select-none cursor-pointer ${buttonStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-black shrink-0 ${
                          isSelected 
                            ? 'bg-brand-amber text-brand-charcoal border-brand-amber' 
                            : 'bg-brand-sand text-brand-muted border-brand-slate/10'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-tight pt-0.5">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions & Explanations Layer */}
              <div className="pt-4 border-t border-brand-slate/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
                
                {/* Answer Explanation Box (Shown after checking) */}
                <div className="flex-1">
                  <AnimatePresence>
                    {isAnswerChecked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 bg-white/80 ${
                          selectedIdx === activeSection.questions[currentQuestionIdx].answerIndex
                            ? 'border-green-500/25 text-green-800'
                            : 'border-brand-slate/15 text-brand-charcoal'
                        }`}
                      >
                        <Award className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-sans uppercase font-bold text-[10px] tracking-wider mb-1">
                            {lang === 'en' ? "EXPLANATION BREAKDOWN" : "MASHINI TAFSEEL"}
                          </strong>
                          <span>
                            {lang === 'en' 
                              ? activeSection.questions[currentQuestionIdx].explanation.en 
                              : activeSection.questions[currentQuestionIdx].explanation.ur}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Side Control Buttons */}
                <div className="flex justify-end items-center gap-3 shrink-0 self-end sm:self-auto">
                  {!isAnswerChecked ? (
                    <button
                      onClick={handleVerifyAnswer}
                      disabled={selectedIdx === null}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold font-mono tracking-wider transition-all duration-200 shadow-xs cursor-pointer ${
                        selectedIdx !== null
                          ? 'bg-brand-amber hover:bg-brand-amber/95 text-brand-charcoal scale-102 hover:shadow-md'
                          : 'bg-brand-slate/15 text-brand-muted opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {lang === 'en' ? "VERIFY SELECTION" : "OPTION LOCK KAREIN"}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-brand-charcoal hover:bg-brand-charcoal/95 text-brand-cream rounded-2xl text-xs font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer shadow-xs scale-102 hover:shadow-md flex items-center gap-1"
                    >
                      <span>
                        {currentQuestionIdx < activeSection.questions.length - 1
                          ? (lang === 'en' ? "NEXT QUERY" : "AGLA SAWAAAL")
                          : (lang === 'en' ? "VIEW ARENA REPORT" : "ARENA REPORT DEKHEIN")}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* VIEW 3: VICTORY REPORT SCREEN */}
          {gameState === 'victory' && activeSection && (
            <>
              <Confetti />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center space-y-8 select-none text-left"
              >
              <div className="max-w-md mx-auto space-y-6 text-center">
                <div className="inline-flex p-4 bg-brand-amber/15 border border-brand-amber/25 rounded-3xl text-brand-amber animate-bounce">
                  <Award className="w-12 h-12" />
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono font-black text-brand-amber uppercase tracking-widest">
                    {lang === 'en' ? "ARENA EXCURSION COMPLETED" : "ARENA CHIP VICTORY"}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-brand-charcoal">
                    {lang === 'en' ? "Victory Achieved!" : "Fatah Hasil Hui!"}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                    {lang === 'en'
                      ? `You completed the '${activeSection.title.en}' battle arena safely and synchronized progress.`
                      : `Aapne '${activeSection.title.ur}' battle arena ka test safalata ke sath poora kar liya.`}
                  </p>
                </div>

                {/* Score Summary Box */}
                <div className="p-6 bg-brand-sand/35 border border-brand-slate/10 rounded-2xl grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-mono text-brand-muted uppercase">{lang === 'en' ? "CORRECT BATCH" : "SAHI JAWAB"}</span>
                    <span className="block text-xl font-black text-brand-charcoal">
                      {runCorrectCount} / 5
                    </span>
                  </div>
                  
                  <div className="space-y-0.5 border-l border-brand-slate/10 pl-4">
                    <span className="block text-[10px] font-mono text-brand-muted uppercase">{lang === 'en' ? "EARNED SCORE" : "POINTS MILE"}</span>
                    <span className="block text-xl font-black text-brand-amber">
                      +{runPointsEarned} PTS
                    </span>
                  </div>
                </div>

                {/* Interactive Feedback message from Clay */}
                <p className="text-xs font-semibold text-brand-charcoal italic bg-brand-sand/15 p-4 border border-brand-slate/10 rounded-xl leading-relaxed">
                  "{runCorrectCount === 5 
                    ? (lang === 'en' ? "PERFECT RESPONSE ALIGNMENT! Flawless backpropagation achieved, all weights matching 100%!" : "LA-JAWAB JAWABAT! Har dimaagi weight bilkul sahi point par fit ho chuka hai!")
                    : (lang === 'en' ? `Solid run! You got ${runCorrectCount} correct. Retake the test anytime to maximize points.` : `Acha koshish! Aapne ${runCorrectCount} sahi kiye. Points behtar karne ke liye aap jab chahein dubara khel sakte hain.`)}"
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleStartSectionQuiz(activeSection)}
                    className="px-5 py-3 border border-brand-slate/15 hover:bg-brand-sand rounded-2xl text-xs font-mono font-bold text-brand-charcoal tracking-wide cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "RETRY TEST" : "DUBARA KHELEIN"}</span>
                  </button>

                  <button
                    onClick={handleExitToLobby}
                    className="px-6 py-3 bg-brand-amber hover:bg-brand-amber/95 border border-brand-amber/20 rounded-2xl text-xs font-mono font-black text-brand-charcoal tracking-wide cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98 shadow-sm hover:shadow-md"
                  >
                    <span>{lang === 'en' ? "RETURN TO ARENA LOBBY" : "LOBBY ME WAPAS"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Badge Share Showcase Modal */}
        <AnimatePresence>
          {sharingAchievement && (
            <BadgeShareModal
              isOpen={sharingAchievement !== null}
              onClose={() => setSharingAchievement(null)}
              achievement={sharingAchievement}
              userScore={score}
              userProfile={userProfile}
              lang={lang}
              soundEnabled={soundEnabled}
              playTone={playTone}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
