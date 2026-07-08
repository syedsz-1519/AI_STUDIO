import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Crown, 
  Trophy, 
  Search, 
  User, 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  ArrowUp,
  Award,
  BookOpen,
  Database,
  Globe
} from 'lucide-react';

interface LeaderboardProps {
  userScore: number;
  userProfile: any;
  lang: string;
  soundEnabled: boolean;
  playTone: (frequency: number, type: OscillatorType, duration: number, volume?: number) => void;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  avatar?: string;
  rankTitle: { en: string; ur: string };
  isBot?: boolean;
  isClay?: boolean;
  isUser?: boolean;
}

// Fixed mock historical figures and interesting AI agents
const INITIAL_BOTS: LeaderboardEntry[] = [
  { 
    name: "Alan Turing", 
    score: 450, 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "AGI Commander", ur: "AGI Sipahsalar" }, 
    isBot: true 
  },
  { 
    name: "Ada Lovelace", 
    score: 385, 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "Prompt Master", ur: "Prompt Ka Ustad" }, 
    isBot: true 
  },
  { 
    name: "Geoffrey Hinton", 
    score: 300, 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "Prompt Master", ur: "Prompt Ka Ustad" }, 
    isBot: true 
  },
  { 
    name: "Yann LeCun", 
    score: 245, 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "Prompt Master", ur: "Prompt Ka Ustad" }, 
    isBot: true 
  },
  { 
    name: "Fei-Fei Li", 
    score: 190, 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "Transformer Expert", ur: "Transformer Mahir" }, 
    isBot: true 
  },
  { 
    name: "Andrej Karpathy", 
    score: 135, 
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "Transformer Expert", ur: "Transformer Mahir" }, 
    isBot: true 
  },
  { 
    name: "Clay (AI Bot)", 
    score: 85, 
    isClay: true, 
    rankTitle: { en: "Neural Apprentice", ur: "Neural Shagird" }, 
    isBot: true 
  },
  { 
    name: "Silicon Novice", 
    score: 20, 
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80", 
    rankTitle: { en: "Silicon Novice", ur: "Shuruati Explorer" }, 
    isBot: true 
  },
];

export default function Leaderboard({ 
  userScore, 
  userProfile, 
  lang, 
  soundEnabled, 
  playTone 
}: LeaderboardProps) {
  
  // Load and persist user custom name or high score
  const [customName, setCustomName] = useState<string>(() => {
    return localStorage.getItem('clay_leaderboard_username') || '';
  });
  
  const [userHighScore, setUserHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('clay_leaderboard_user_highscore');
    const parsed = saved ? parseInt(saved, 10) : 0;
    // High score should be at least current active user score
    return Math.max(parsed, userScore);
  });

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(customName);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync and persist high score if userScore exceeds it
  useEffect(() => {
    if (userScore > userHighScore) {
      setUserHighScore(userScore);
      localStorage.setItem('clay_leaderboard_user_highscore', userScore.toString());
      if (soundEnabled) {
        // Play special rank up or high score celebration sound
        setTimeout(() => playTone(600, 'sine', 0.1, 0.05), 0);
        setTimeout(() => playTone(800, 'sine', 0.15, 0.05), 100);
      }
    }
  }, [userScore, userHighScore, soundEnabled, playTone]);

  // Compute rank title based on high score
  const getRankBadgeForScore = (points: number) => {
    if (points >= 400) return { en: "AGI Commander", ur: "AGI Sipahsalar" };
    if (points >= 250) return { en: "Prompt Master", ur: "Prompt Ka Ustad" };
    if (points >= 120) return { en: "Transformer Expert", ur: "Transformer Mahir" };
    if (points >= 50) return { en: "Neural Apprentice", ur: "Neural Shagird" };
    return { en: "Silicon Novice", ur: "Shuruati Explorer" };
  };

  const activeUserName = userProfile?.fullName || customName || (lang === 'en' ? 'You' : 'Aap');
  const activeUserAvatar = userProfile?.avatar;

  // Combine bots + current user with high score
  const leaderboardList: LeaderboardEntry[] = [
    ...INITIAL_BOTS,
    {
      name: activeUserName,
      score: userHighScore,
      avatar: activeUserAvatar,
      rankTitle: getRankBadgeForScore(userHighScore),
      isUser: true
    }
  ];

  // Sort by score descending
  const sortedList = leaderboardList.sort((a, b) => b.score - a.score);

  // Find user's position
  const userRankIndex = sortedList.findIndex(entry => entry.isUser);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : sortedList.length;

  // Filtered list based on search
  const filteredList = sortedList.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lang === 'en' ? entry.rankTitle.en : entry.rankTitle.ur).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    setCustomName(trimmed);
    localStorage.setItem('clay_leaderboard_username', trimmed);
    setIsEditingName(false);
    if (soundEnabled) playTone(650, 'sine', 0.08, 0.05);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (soundEnabled) playTone(440, 'triangle', 0.1, 0.05);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Find immediate competitor ahead of the user
  const competitorAhead = userRankIndex > 0 ? sortedList[userRankIndex - 1] : null;
  const pointsToOvertake = competitorAhead ? competitorAhead.score - userHighScore : 0;

  return (
    <div className="space-y-6">
      {/* Leaderboard Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {/* Stat 1: Rank Position */}
        <div className="p-5 bg-white border border-brand-slate/15 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="block text-[10px] font-mono text-brand-muted uppercase font-bold">
              {lang === 'en' ? "GLOBAL POSITION" : "AALMI RANKING"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-display font-black text-brand-charcoal">
                #{userRank}
              </span>
              <span className="text-xs text-brand-muted font-mono">
                / {sortedList.length}
              </span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-amber/10 pointer-events-none">
            <Crown className="w-16 h-16 stroke-[1.5]" />
          </div>
        </div>

        {/* Stat 2: High Score */}
        <div className="p-5 bg-white border border-brand-slate/15 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="block text-[10px] font-mono text-brand-muted uppercase font-bold">
              {lang === 'en' ? "PERSONAL RECORD" : "INFRADI RECORD"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-display font-black text-brand-amber">
                {userHighScore}
              </span>
              <span className="text-xs text-brand-muted font-mono font-bold">XP</span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-amber/10 pointer-events-none">
            <Trophy className="w-16 h-16 stroke-[1.5]" />
          </div>
        </div>

        {/* Stat 3: Next target or climb prompt */}
        <div className="p-5 bg-brand-charcoal text-brand-cream border border-brand-charcoal rounded-2xl flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="block text-[10px] font-mono text-brand-amber uppercase font-black tracking-wider">
              {lang === 'en' ? "NEXT LADDER TARGET" : "AGLA MEEL-E-SANG"}
            </span>
            {competitorAhead ? (
              <p className="text-xs text-brand-cream/80 leading-relaxed mt-1">
                {lang === 'en' ? (
                  <>
                    Accumulate <span className="text-brand-amber font-bold font-mono">{pointsToOvertake + 1} XP</span> more to overtake <span className="font-extrabold text-white">{competitorAhead.name}</span>!
                  </>
                ) : (
                  <>
                    <span className="font-extrabold text-white">{competitorAhead.name}</span> se aage nikalne ke liye mazeed <span className="text-brand-amber font-bold font-mono">{pointsToOvertake + 1} XP</span> haasil karein!
                  </>
                )}
              </p>
            ) : (
              <p className="text-xs text-brand-amber font-extrabold leading-relaxed mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber animate-pulse shrink-0" />
                <span>{lang === 'en' ? "You are at the absolute peak!" : "Aap is waqt sabse aage hain!"}</span>
              </p>
            )}
          </div>
          {competitorAhead && (
            <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-brand-amber font-bold uppercase">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? "Climbing Active" : "Tarakki Jaari Hai"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel: Search & Username Customizer */}
      <div className="p-5 bg-brand-sand/30 border border-brand-slate/15 rounded-2xl flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 text-left">
        {/* Name Customizer */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-mono font-bold text-brand-charcoal uppercase shrink-0">
            {lang === 'en' ? "Leaderboard Handle:" : "Leaderboard Handle:"}
          </span>
          {isEditingName ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value.slice(0, 20))}
                className="px-3 py-1.5 bg-white border border-brand-slate/20 rounded-lg text-xs font-sans font-medium text-brand-charcoal outline-none focus:border-brand-amber max-w-[180px]"
                placeholder={lang === 'en' ? "Enter your handle..." : "Naam likhein..."}
                maxLength={20}
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1.5 bg-brand-amber hover:bg-brand-amber/90 text-brand-charcoal border border-brand-amber/20 font-mono font-black text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 shrink-0"
              >
                {lang === 'en' ? "SAVE" : "MEHFOOZ"}
              </button>
              <button
                onClick={() => {
                  setTempName(customName);
                  setIsEditingName(false);
                }}
                className="px-2.5 py-1.5 bg-transparent hover:bg-brand-sand text-brand-muted font-mono font-medium text-[10px] rounded-lg cursor-pointer shrink-0"
              >
                {lang === 'en' ? "CANCEL" : "CANCEL"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-brand-charcoal bg-white border border-brand-slate/10 px-3 py-1 rounded-lg">
                {activeUserName}
              </span>
              {!userProfile && (
                <button
                  onClick={() => {
                    setTempName(customName);
                    setIsEditingName(true);
                    if (soundEnabled) playTone(500, 'sine', 0.05, 0.05);
                  }}
                  className="text-xs font-mono font-bold text-brand-amber hover:text-brand-charcoal transition-colors underline cursor-pointer"
                >
                  {lang === 'en' ? "EDIT" : "EDIT"}
                </button>
              )}
              {userProfile && (
                <span className="text-[10px] font-mono text-green-600 bg-green-500/10 border border-green-500/15 px-2 py-0.5 rounded uppercase font-bold">
                  {lang === 'en' ? "VERIFIED ACCOUNT" : "TASTEEQ SHUDA"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Search Input and Refresh Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? "Search coders or ranks..." : "Dost ya rank dhoondein..."}
              className="w-full pl-9 pr-4 py-2 bg-white border border-brand-slate/15 rounded-xl text-xs font-sans font-medium text-brand-charcoal outline-none focus:border-brand-amber"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 bg-white hover:bg-brand-sand border border-brand-slate/15 rounded-xl text-brand-charcoal cursor-pointer transition-transform ${isRefreshing ? 'opacity-80' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-amber' : ''}`} />
          </button>
        </div>
      </div>

      {/* Global Board Rankings */}
      <div className="bg-white border border-brand-slate/15 rounded-2xl shadow-sm overflow-hidden text-left">
        <div className="p-4 bg-brand-sand/15 border-b border-brand-slate/10 flex items-center justify-between">
          <span className="text-[10px] font-mono font-black text-brand-charcoal uppercase tracking-wider">
            {lang === 'en' ? "GLOBAL LEADERBOARD STANDINGS" : "AALMI ARENA RANKINGS"}
          </span>
          <span className="text-xs text-brand-muted font-mono">
            {lang === 'en' ? "Refreshed live" : "Live update"}
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <User className="w-10 h-10 text-brand-muted mx-auto opacity-40" />
            <p className="text-sm font-sans font-semibold text-brand-charcoal">
              {lang === 'en' ? "No matching coders found" : "Koi matching competitor nahi mila"}
            </p>
            <p className="text-xs text-brand-muted">
              {lang === 'en' ? "Try clearing your search query" : "Apne search lafz badal kar dhoondein"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-slate/10 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-brand-sand/5 text-[10px] font-mono font-extrabold text-brand-muted uppercase text-left">
                  <th className="py-3 px-6 w-16 text-center">{lang === 'en' ? "RANK" : "RANK"}</th>
                  <th className="py-3 px-4">{lang === 'en' ? "CODER PROFILE" : "COMPETITOR"}</th>
                  <th className="py-3 px-4">{lang === 'en' ? "TITULAR RANK" : "ARENA RANK"}</th>
                  <th className="py-3 px-6 text-right w-32">{lang === 'en' ? "SCORE" : "SCORE"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate/10 font-sans">
                {filteredList.map((entry, index) => {
                  // Find index in main sorted list to show actual rank
                  const originalRank = sortedList.findIndex(e => e.name === entry.name) + 1;
                  
                  // Rank styling indicators
                  let rankIndicator = null;
                  if (originalRank === 1) {
                    rankIndicator = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-mono font-black text-xs ring-2 ring-amber-500/10">
                        👑
                      </span>
                    );
                  } else if (originalRank === 2) {
                    rankIndicator = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/10 text-slate-600 border border-slate-400/20 font-mono font-black text-xs ring-2 ring-slate-400/10">
                        🥈
                      </span>
                    );
                  } else if (originalRank === 3) {
                    rankIndicator = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/10 text-amber-800 border border-amber-700/20 font-mono font-black text-xs ring-2 ring-amber-700/10">
                        🥉
                      </span>
                    );
                  } else {
                    rankIndicator = (
                      <span className="font-mono font-bold text-brand-muted text-xs">
                        #{originalRank}
                      </span>
                    );
                  }

                  // Default icons if no custom avatar
                  let avatarMarkup = null;
                  if (entry.avatar) {
                    avatarMarkup = (
                      <img 
                        src={entry.avatar} 
                        alt={entry.name}
                        className="w-8 h-8 rounded-full border border-brand-slate/15 object-cover shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                    );
                  } else if (entry.isClay) {
                    avatarMarkup = (
                      <div className="w-8 h-8 rounded-full bg-brand-amber/15 border border-brand-amber/25 text-brand-amber flex items-center justify-center font-black text-[10px] shrink-0">
                        🤖
                      </div>
                    );
                  } else {
                    avatarMarkup = (
                      <div className="w-8 h-8 rounded-full bg-brand-sand border border-brand-slate/15 text-brand-charcoal flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    );
                  }

                  return (
                    <motion.tr
                      key={entry.name}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`transition-colors duration-150 ${
                        entry.isUser 
                          ? 'bg-brand-amber/10 hover:bg-brand-amber/15 border-l-4 border-l-brand-amber' 
                          : 'hover:bg-brand-sand/20'
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3 px-6 text-center select-none">
                        {rankIndicator}
                      </td>

                      {/* Profile Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {avatarMarkup}
                          <div>
                            <span className={`text-sm font-bold flex items-center gap-1.5 ${entry.isUser ? 'text-brand-charcoal font-black' : 'text-brand-charcoal/90'}`}>
                              <span>{entry.name}</span>
                              {entry.isUser && (
                                <span className="text-[9px] font-mono font-black bg-brand-amber text-brand-charcoal px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                                  {lang === 'en' ? "YOU" : "AAP"}
                                </span>
                              )}
                              {entry.isClay && (
                                <span className="text-[9px] font-mono font-black bg-brand-charcoal text-white px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                                  {lang === 'en' ? "HOST" : "HOST"}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rank Title Column */}
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono font-medium text-brand-muted">
                          {lang === 'en' ? entry.rankTitle.en : entry.rankTitle.ur}
                        </span>
                      </td>

                      {/* Score Column */}
                      <td className="py-3 px-6 text-right font-mono">
                        <div className="inline-flex items-center gap-1 text-right">
                          <span className={`text-sm font-black ${entry.isUser ? 'text-brand-amber' : 'text-brand-charcoal/80'}`}>
                            {entry.score}
                          </span>
                          <span className="text-[10px] font-bold text-brand-muted">
                            XP
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
