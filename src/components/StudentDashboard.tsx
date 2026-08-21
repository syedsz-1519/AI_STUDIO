import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Brain, 
  Video, 
  Award, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Eye, 
  MessageSquare, 
  BookOpen, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  Play, 
  ShieldCheck, 
  Target, 
  Zap, 
  Settings, 
  LogOut, 
  LogIn, 
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Activity,
  BarChart3,
  Download,
  Printer,
  PlayCircle,
  Calendar,
  Wifi,
  WifiOff,
  FolderDown,
  HardDrive,
  Check,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { MockInterviewRecord, MockInterviewDraft } from '../types';
import { UserProfile, setupAuthListener, logoutUserManually } from '../lib/firebase';
import { audioEngine } from '../lib/audioEngine';
import InterviewPerformanceChart from './InterviewPerformanceChart';
import InterviewReportModal from './InterviewReportModal';
import PracticeReminderModal from './PracticeReminderModal';
import TakeawaysNotesExportModal from './TakeawaysNotesExportModal';
import { streakManager, type DailyStreakState } from '../lib/streakManager';
import { offlineLessonCache, type OfflineCacheStats } from '../lib/offlineLessonCache';
import { getStudentKnowledgeNotes } from '../lib/notesExporter';

interface StudentDashboardProps {
  onStartInterview: () => void;
  onOpenAuth: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const AI_CURRICULUM_CONCEPTS = [
  { id: 'c1', title: 'AI vs ML vs Deep Learning Hierarchy', category: 'Foundations', level: 'Beginner' },
  { id: 'c2', title: 'Supervised vs Unsupervised vs Reinforcement', category: 'ML Types', level: 'Beginner' },
  { id: 'c3', title: 'Neural Networks & Backpropagation', category: 'Deep Learning', level: 'Intermediate' },
  { id: 'c4', title: 'Transformer Architecture & Self-Attention', category: 'GenAI', level: 'Advanced' },
  { id: 'c5', title: 'RAG (Retrieval-Augmented Generation) & Vectors', category: 'GenAI', level: 'Advanced' },
  { id: 'c6', title: 'Prompt Engineering & System Personas', category: 'Prompting', level: 'Beginner' },
  { id: 'c7', title: 'Loss Functions, Regularization & Overfitting', category: 'Optimization', level: 'Intermediate' },
  { id: 'c8', title: 'KV-Caching, Quantization & Model Latency', category: 'Production', level: 'Advanced' },
];

export default function StudentDashboard({
  onStartInterview,
  onOpenAuth,
  onNavigateSection,
}: StudentDashboardProps) {
  const { lang } = useLanguage();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<MockInterviewRecord[]>([]);
  const [selectedChartSessionId, setSelectedChartSessionId] = useState<string | null>(null);
  const [masteredConcepts, setMasteredConcepts] = useState<string[]>(['c1', 'c2', 'c6']);
  const [expandedInterviewId, setExpandedInterviewId] = useState<string | null>(null);
  const [activeDraft, setActiveDraft] = useState<MockInterviewDraft | null>(null);
  const [selectedReportRecord, setSelectedReportRecord] = useState<MockInterviewRecord | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExportNotesModalOpen, setIsExportNotesModalOpen] = useState(false);

  // Daily Streak State
  const [streakState, setStreakState] = useState<DailyStreakState>(() => streakManager.getStreakState());
  const [streakCelebrate, setStreakCelebrate] = useState(false);

  // Offline Cache State
  const [isOnline, setIsOnline] = useState(() => offlineLessonCache.isOnline());
  const [cacheStats, setCacheStats] = useState<OfflineCacheStats>(() => offlineLessonCache.getStats());
  const [isSyncingCache, setIsSyncingCache] = useState(false);

  // Student Notes count
  const [savedNotesCount, setSavedNotesCount] = useState<number>(() => {
    return Object.keys(getStudentKnowledgeNotes()).length;
  });

  // Sync user and mock interview records
  useEffect(() => {
    const unsub = setupAuthListener((user) => {
      setCurrentUser(user);
    });

    const updateStreak = () => {
      setStreakState(streakManager.getStreakState());
    };

    const updateNotes = () => {
      setSavedNotesCount(Object.keys(getStudentKnowledgeNotes()).length);
    };

    const updateConnectivity = (e: any) => {
      setIsOnline(e.detail?.online ?? navigator.onLine);
    };

    const updateCache = () => {
      setCacheStats(offlineLessonCache.getStats());
    };

    window.addEventListener('clay_streak_updated' as any, updateStreak);
    window.addEventListener('clay_lesson_completed' as any, updateStreak);
    window.addEventListener('clay_notes_updated' as any, updateNotes);
    window.addEventListener('clay_connectivity_change' as any, updateConnectivity);
    window.addEventListener('clay_cache_synced' as any, updateCache);

    // Check for auto-saved interview draft
    const checkDraft = () => {
      try {
        const savedDraftJson = localStorage.getItem('clay_mock_interview_draft');
        if (savedDraftJson) {
          const parsed: MockInterviewDraft = JSON.parse(savedDraftJson);
          if (parsed && parsed.questions && parsed.questions.length > 0) {
            setActiveDraft(parsed);
          } else {
            setActiveDraft(null);
          }
        } else {
          setActiveDraft(null);
        }
      } catch (e) {
        console.warn('Failed to load draft in dashboard:', e);
      }
    };

    checkDraft();
    window.addEventListener('clay_interview_draft_updated', checkDraft);

    // Load interviews from local storage
    const loadInterviews = () => {
      try {
        const saved = localStorage.getItem('clay_mock_interviews');
        if (saved) {
          const parsed = JSON.parse(saved);
          setInterviewHistory(parsed);
          if (parsed.length > 0 && !selectedChartSessionId) {
            setSelectedChartSessionId(parsed[0].id);
          }
        } else {
          // Pre-seed an initial sample record for demonstration
          const sample: MockInterviewRecord = {
            id: 'sample_1',
            timestamp: Date.now() - 86400000,
            dateStr: 'Yesterday',
            roleTrack: 'AI & Machine Learning Engineer',
            interviewerName: 'Dr. Sarah Chen',
            difficulty: 'Mid-Level',
            durationSeconds: 540,
            overallScore: 88,
            hiringDecision: 'Hire',
            technicalScore: 88,
            communicationScore: 92,
            eyeContactScore: 94,
            confidenceScore: 86,
            attempts: [
              {
                questionId: 'ml_1',
                questionText: 'How do L1 and L2 regularization differ in penalizing model weights?',
                userAnswer: 'L1 adds absolute weights creating sparsity while L2 adds squared weights shrinking coefficients.',
                durationSeconds: 120,
                aiFeedback: 'Clear geometric explanation of diamond vs circle penalty contours.',
                score: 90,
                strengths: ['Accurate penalty formula', 'Mentioned sparsity'],
                improvements: ['Could mention non-differentiability at zero'],
                modelAnswer: 'L1 adds sum of absolute weights (|w|) leading to sharp diamond contours...',
                inBetweenInteractions: ['Spot on with L1 and L2 formulas!'],
              }
            ],
            summaryFeedback: 'Excellent grasp of regularization and attention mechanisms.',
            topStrengths: ['Great camera eye contact', 'Structured responses'],
            keyActionItems: ['Practice low-level quantization trade-offs'],
          };
          setInterviewHistory([sample]);
          setSelectedChartSessionId('sample_1');
          localStorage.setItem('clay_mock_interviews', JSON.stringify([sample]));
        }
      } catch (e) {
        console.warn('Failed to load interview history:', e);
      }
    };

    loadInterviews();

    // Listen to custom event when a new interview completes
    window.addEventListener('clay_interview_saved', loadInterviews);

    // Load mastered concepts
    try {
      const savedMastery = localStorage.getItem('clay_mastered_concepts');
      if (savedMastery) {
        setMasteredConcepts(JSON.parse(savedMastery));
      }
    } catch (e) {}

    return () => {
      unsub();
      window.removeEventListener('clay_interview_saved', loadInterviews);
      window.removeEventListener('clay_interview_draft_updated', checkDraft);
    };
  }, []);

  // Toggle concept mastery
  const toggleConceptMastery = (id: string) => {
    audioEngine.playLoFiChord();
    setMasteredConcepts((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('clay_mastered_concepts', JSON.stringify(updated));
      return updated;
    });
  };

  // Calculations
  const averageInterviewScore = interviewHistory.length
    ? Math.round(interviewHistory.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewHistory.length)
    : 0;

  const averageEyeContact = interviewHistory.length
    ? Math.round(interviewHistory.reduce((acc, curr) => acc + curr.eyeContactScore, 0) / interviewHistory.length)
    : 0;

  const masteryPercent = Math.round((masteredConcepts.length / AI_CURRICULUM_CONCEPTS.length) * 100);

  const handleMarkTodayComplete = () => {
    audioEngine.playLoFiChord();
    const updated = streakManager.recordLessonCompletion('dashboard-checkin');
    setStreakState(updated);
    setStreakCelebrate(true);
    setTimeout(() => setStreakCelebrate(false), 3500);
  };

  const handleSyncCacheManually = () => {
    setIsSyncingCache(true);
    audioEngine.playLoFiChord();
    setTimeout(() => {
      const stats = offlineLessonCache.syncCache();
      setCacheStats(stats);
      setIsSyncingCache(false);
    }, 600);
  };

  return (
    <section className="w-full min-h-screen bg-brand-cream py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        
        {/* ========================================================================= */}
        {/* TOP PROFILE & STATS HEADER BANNER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* User Profile Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    currentUser?.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                  }
                  alt="User Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-amber shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-brand-amber text-white p-1 rounded-full text-[10px]">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-white">
                    {currentUser?.displayName || (lang === 'en' ? 'AI Explorer Student' : 'AI Student')}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-[10px] font-mono font-bold">
                    Level 4 • AI Scholar
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  {currentUser?.email || (lang === 'en' ? 'Local Student Profile' : 'Student Profile')}
                </p>

                {/* Badges / Streaks */}
                <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-orange-400 font-bold bg-orange-500/15 px-2.5 py-0.5 rounded-lg">
                    <Flame className="w-3.5 h-3.5" /> {streakState.currentStreak} Day Streak {streakState.todayCompleted ? '🔥' : '⏳'}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" /> {interviewHistory.length} Interviews Attempted
                  </span>
                  <span className={`hidden sm:flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-lg ${
                    isOnline ? 'text-blue-300 bg-blue-500/15' : 'text-amber-300 bg-amber-500/15'
                  }`}>
                    {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                    <span>{isOnline ? 'Online Sync' : 'Offline Cache Ready'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Auth */}
            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsReminderModalOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
                title="Configure daily/weekly mock interview practice reminders"
              >
                <Clock className="w-4 h-4 text-brand-amber" />
                <span>{lang === 'en' ? "Practice Reminders" : "Reminders"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStartInterview}
                className="px-5 py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-2xl text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'en' ? "Launch AI Mock Interview" : "Mock Interview Shuru Karein"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAuth}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-brand-amber" />
                <span>{currentUser ? (lang === 'en' ? "Profile & Settings" : "Settings") : (lang === 'en' ? "Login / Sign Up" : "Login Karein")}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE DRAFT RESUME ALERT BANNER (If Mock Interview in progress) */}
        {/* ========================================================================= */}
        {activeDraft && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(217, 119, 6, 0.15)" }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border-2 border-brand-amber/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-brand-amber text-white rounded-2xl shadow-sm shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark text-[9px] font-mono font-bold uppercase">
                    Unfinished Interview Saved
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted">
                    Question {activeDraft.currentQuestionIndex + 1} of {activeDraft.questions.length}
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-brand-charcoal mt-0.5">
                  Resume your interrupted mock interview session
                </h4>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartInterview}
              className="px-4 py-2 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Now</span>
            </motion.button>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STATS OVERVIEW CARDS WITH FRAMER MOTION HOVER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-brand-amber mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Avg Interview Score</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              {averageInterviewScore ? `${averageInterviewScore}%` : 'N/A'}
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">Across all mock rounds</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Avg Eye Contact</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              {averageEyeContact ? `${averageEyeContact}%` : '92%'}
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">Camera tracker gaze</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-purple-600 mb-1">
              <Brain className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Curriculum Mastery</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              {masteryPercent}%
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">{masteredConcepts.length} of {AI_CURRICULUM_CONCEPTS.length} concepts</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Study Time</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              4.2 Hrs
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">Total active practice</span>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* 1. DAILY STREAK & CONSISTENCY HABIT TRACKER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 border-2 border-brand-amber/35 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Streak Number & Status */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md relative group">
                <Flame className="w-7 h-7 animate-bounce stroke-[2.5]" />
                {streakState.todayCompleted && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                    ✓
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark border border-brand-amber/30">
                    Daily Consistency Tracker
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-muted">
                    Best: {streakState.longestStreak} Days
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal mt-0.5 flex items-center gap-2">
                  <span>{streakState.currentStreak} Consecutive Days Streak</span>
                  <span className="text-lg">{streakState.todayCompleted ? '🔥' : '⏳'}</span>
                </h2>
                <p className="text-xs text-brand-slate">
                  {streakState.todayCompleted
                    ? (lang === 'en' ? "Awesome job! Today's learning streak is secured." : "Zabardast! Aaj ka sabaq mukammal ho gaya.")
                    : (lang === 'en' ? "Complete a lesson or knowledge check today to maintain your streak!" : "Streak bachane ke liye aaj ka sabaq mukammal karein!")}
                </p>
              </div>
            </div>

            {/* Action / Celebration */}
            <div className="flex items-center gap-3">
              {streakCelebrate ? (
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <span>Streak Recorded for Today! 🎉</span>
                </div>
              ) : (
                <button
                  onClick={handleMarkTodayComplete}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                    streakState.todayCompleted
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 hover:bg-emerald-500/25'
                      : 'bg-brand-charcoal hover:bg-black text-white'
                  }`}
                >
                  {streakState.todayCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Today's Learning Verified</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 text-brand-amber" />
                      <span>Check In & Mark Today Complete</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 7-Day Weekly Streak Dots & Milestone Strip */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-brand-amber/15 items-center">
            
            {/* 7-Day Visual Dots */}
            <div className="md:col-span-7 flex items-center justify-between gap-1.5 sm:gap-2 p-3 rounded-2xl bg-white/80 border border-brand-slate/10">
              {streakState.weeklyActivity.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 text-center min-w-[36px]">
                  <span className="text-[10px] font-mono font-bold text-brand-muted">
                    {day.dayName}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    day.completed
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs font-bold text-xs'
                      : day.isToday
                      ? 'border-2 border-dashed border-brand-amber bg-brand-amber/10 text-brand-amber text-xs'
                      : 'bg-brand-sand/50 text-brand-slate/40 text-xs'
                  }`}>
                    {day.completed ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : day.isToday ? (
                      <span className="w-2 h-2 rounded-full bg-brand-amber animate-ping" />
                    ) : (
                      <span className="text-[10px] font-mono">{day.dayNumber}</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-mono font-semibold ${day.isToday ? 'text-brand-amber font-bold' : 'text-brand-slate/50'}`}>
                    {day.isToday ? 'Today' : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Milestone Badge & Progress */}
            <div className="md:col-span-5 p-3 rounded-2xl bg-white/80 border border-brand-slate/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-charcoal flex items-center gap-1.5">
                  <span>{streakState.currentMilestone.badgeEmoji}</span>
                  <span>{streakState.currentMilestone.title}</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-brand-amber">
                  Target: {streakState.currentMilestone.nextMilestoneDays} Days
                </span>
              </div>

              <div className="w-full h-2 bg-brand-sand rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-amber to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${streakState.currentMilestone.progressPercent}%` }}
                />
              </div>

              <p className="text-[10px] text-brand-muted">
                {streakState.currentMilestone.description}
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. OFFLINE LESSON CACHE & KNOWLEDGE NOTES EXPORT HUB */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Offline Cache Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'}`}>
                    {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal">
                      Offline Curriculum Cache
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted block">
                      {isOnline ? 'Sync: Connected' : 'Offline Reading Active'}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-mono font-bold">
                  100% Cached
                </span>
              </div>

              <p className="text-xs text-brand-slate leading-relaxed">
                All 9 core curriculum lessons, 85+ glossary terms, and quick takeaways are stored locally in your browser so you can study without internet.
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-brand-muted">
                Storage: {cacheStats.estimatedSizeKB} KB • 9 Lessons
              </span>

              <button
                onClick={handleSyncCacheManually}
                disabled={isSyncingCache}
                className="px-3 py-1.5 rounded-xl bg-brand-sand/60 hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-brand-amber ${isSyncingCache ? 'animate-spin' : ''}`} />
                <span>{isSyncingCache ? 'Updating Cache...' : 'Refresh Offline Data'}</span>
              </button>
            </div>
          </div>

          {/* Knowledge Notes & Takeaways Exporter Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brand-amber/15 text-brand-amber">
                    <FolderDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal">
                      Knowledge Notes & Takeaways Exporter
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted block">
                      {savedNotesCount} Custom Lesson Notes Saved
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber-dark text-[10px] font-mono font-bold">
                  PDF / TXT / MD
                </span>
              </div>

              <p className="text-xs text-brand-slate leading-relaxed">
                Export all lesson key points, mental models, TL;DR summaries, and your personal study notes into downloadable PDF or plain text files.
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsExportNotesModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-brand-sand/60 hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Notes</span>
              </button>

              <button
                onClick={() => setIsExportNotesModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-brand-amber" />
                <span>Export Study Notebook</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT GRID: CURRICULUM + INTERVIEW HISTORY */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Performance Radar/Bar Analytics & Mock Interview History */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Recharts Performance Radar & Bar Chart Visualizer */}
            {interviewHistory.length > 0 && (
              <InterviewPerformanceChart
                records={interviewHistory}
                selectedRecordId={selectedChartSessionId}
                onSelectRecord={(id) => {
                  setSelectedChartSessionId(id);
                  audioEngine.playLoFiChord();
                }}
              />
            )}

            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                    <Video className="w-4 h-4 text-brand-amber" />
                    {lang === 'en' ? "Mock Interview History & Scorecards" : "Mock Interview Records"}
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {lang === 'en' ? "Detailed AI feedback, technical scores, and eye-contact ratings." : "Aapki pichli mock interviews ke nataij."}
                  </p>
                </div>

                <button
                  onClick={onStartInterview}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber-dark hover:bg-brand-amber/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? "New Interview" : "Nayi Interview"}</span>
                </button>
              </div>

              {/* History List */}
              {interviewHistory.length === 0 ? (
                <div className="p-8 rounded-2xl bg-brand-sand/20 border border-dashed border-brand-slate/20 text-center space-y-3">
                  <Video className="w-8 h-8 text-brand-muted mx-auto" />
                  <p className="text-xs text-brand-muted max-w-sm mx-auto">
                    You haven't completed any mock interviews yet. Attempt your first round with real camera tracking and get graded by our AI interviewer!
                  </p>
                  <button
                    onClick={onStartInterview}
                    className="px-4 py-2 bg-brand-amber text-white rounded-xl text-xs font-bold shadow hover:bg-brand-amber-dark transition-all cursor-pointer"
                  >
                    Start First Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviewHistory.map((rec) => {
                    const isExpanded = expandedInterviewId === rec.id;
                    return (
                      <motion.div
                        key={rec.id}
                        whileHover={{ borderColor: 'rgba(217, 119, 6, 0.4)', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)' }}
                        className="rounded-2xl border border-brand-slate/15 bg-white transition-all overflow-hidden shadow-2xs"
                      >
                        {/* Summary Header Row */}
                        <div
                          onClick={() => setExpandedInterviewId(isExpanded ? null : rec.id)}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-brand-sand/10 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-xs text-brand-charcoal">
                                {rec.roleTrack}
                              </span>
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                rec.hiringDecision === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                                rec.hiringDecision === 'Hire' ? 'bg-teal-100 text-teal-800' :
                                rec.hiringDecision === 'Leaning Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {rec.hiringDecision}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-mono text-brand-muted">
                              <span>Interviewer: {rec.interviewerName}</span>
                              <span>•</span>
                              <span>{rec.dateStr}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="text-right">
                              <span className="text-[9px] font-mono uppercase text-brand-muted block font-bold">Score</span>
                              <span className="font-display font-black text-base text-brand-charcoal">
                                {rec.overallScore}%
                              </span>
                            </div>

                            <div className="text-right hidden sm:block">
                              <span className="text-[9px] font-mono uppercase text-brand-muted block font-bold">Eye Gaze</span>
                              <span className="font-display font-bold text-xs text-emerald-600">
                                {rec.eyeContactScore}%
                              </span>
                            </div>

                            {/* Replay & Scorecard Trigger Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReportRecord(rec);
                                setIsReportModalOpen(true);
                                audioEngine.playLoFiChord();
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-brand-charcoal text-white hover:bg-slate-800 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Replay performance summary and download scorecard"
                            >
                              <PlayCircle className="w-3.5 h-3.5 text-brand-amber" />
                              <span className="hidden sm:inline">Replay</span>
                            </motion.button>

                            <div className="p-1 rounded-lg bg-brand-sand/40 text-brand-slate">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Full Report Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-2 border-t border-brand-slate/10 bg-brand-sand/10 space-y-3"
                            >
                              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-900">
                                <span className="font-mono text-[9px] font-black uppercase text-amber-800 block mb-0.5">
                                  AI Feedback Summary:
                                </span>
                                <p>{rec.summaryFeedback}</p>
                              </div>

                              {/* Question Attempts Count Preview */}
                              {rec.attempts && rec.attempts.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-mono font-bold text-brand-slate uppercase block">
                                    Question Breakdown ({rec.attempts.length} Questions):
                                  </span>
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {rec.attempts.map((att, attIdx) => (
                                      <div 
                                        key={attIdx} 
                                        className="p-2 rounded-xl bg-white border border-brand-slate/10 text-xs flex items-center justify-between gap-2"
                                      >
                                        <div className="truncate flex-1">
                                          <span className="font-bold text-brand-amber mr-1.5">Q{attIdx + 1}:</span>
                                          <span className="text-brand-charcoal text-[11px] font-medium">{att.questionText}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                                          att.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                                          att.score >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {att.score}%
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quick session focus and replay actions */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-slate/10">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedReportRecord(rec);
                                      setIsReportModalOpen(true);
                                      audioEngine.playLoFiChord();
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-brand-charcoal text-white hover:bg-slate-800 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-brand-amber" />
                                    <span>Replay Full AI Scorecard & PDF</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedChartSessionId(rec.id);
                                      audioEngine.playLoFiChord();
                                      window.scrollTo({ top: 180, behavior: 'smooth' });
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-brand-amber/15 text-brand-amber-dark hover:bg-brand-amber/25 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>Inspect on Charts</span>
                                  </button>
                                </div>

                                <span className="text-[10px] font-mono text-brand-muted">
                                  Duration: {Math.round(rec.durationSeconds / 60)} mins
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Curriculum Mastery Checklist & Quick Launch Bar */}
          <div className="space-y-4">
            
            {/* Concept Mastery Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Concept Mastery Roadmap
                </h3>
                <span className="text-[10px] font-mono font-bold text-brand-amber">
                  {masteredConcepts.length}/{AI_CURRICULUM_CONCEPTS.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-brand-sand/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-amber to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>

              {/* Concepts List */}
              <div className="space-y-2 pt-2">
                {AI_CURRICULUM_CONCEPTS.map((concept) => {
                  const isMastered = masteredConcepts.includes(concept.id);
                  return (
                    <motion.button
                      key={concept.id}
                      whileHover={{ scale: 1.015, x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleConceptMastery(concept.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500/[0.04] border-emerald-500/30 text-emerald-950 shadow-2xs'
                          : 'bg-brand-sand/20 border-brand-slate/10 text-brand-slate hover:bg-brand-sand/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                          isMastered ? 'bg-emerald-500 text-white' : 'border border-brand-slate/30'
                        }`}>
                          {isMastered && '✓'}
                        </span>
                        <span className="text-[11px] font-medium truncate">
                          {concept.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-brand-muted shrink-0">
                        {concept.level}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Launchpad to Learning Modules */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
              <h3 className="font-display text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-amber" />
                Quick Launchpad
              </h3>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => onNavigateSection('prompt-sandbox')}
                  className="p-2.5 rounded-xl bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Interactive Prompt Sandbox
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                <button
                  onClick={() => onNavigateSection('rag-simulator')}
                  className="p-2.5 rounded-xl bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-brand-amber" />
                    RAG Knowledge Simulator
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                <button
                  onClick={() => onNavigateSection('quiz-arena')}
                  className="p-2.5 rounded-xl bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    AI Championship Quiz Arena
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="p-2.5 rounded-xl bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer border border-brand-amber/20"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-amber" />
                    Schedule Practice Reminders
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-amber" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Comprehensive Interview Performance & Scorecard Modal */}
      <InterviewReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedReportRecord(null);
        }}
        record={selectedReportRecord}
        studentName={currentUser?.displayName || 'AI Explorer Student'}
        studentEmail={currentUser?.email || 'scholar@clay.edu'}
      />

      {/* Practice Reminders Scheduling Modal */}
      <PracticeReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />

      {/* Quick Takeaways & Personal Knowledge Notes Export Modal */}
      <TakeawaysNotesExportModal
        isOpen={isExportNotesModalOpen}
        onClose={() => setIsExportNotesModalOpen(false)}
      />
    </section>
  );
}
