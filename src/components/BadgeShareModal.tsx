import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Share2, 
  Copy, 
  Download, 
  Check, 
  ExternalLink,
  Award, 
  Cpu, 
  Database, 
  Globe, 
  BookOpen, 
  Zap, 
  Trophy, 
  Sparkles,
  Shield
} from 'lucide-react';

interface BadgeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    title: { en: string; ur: string };
    desc: { en: string; ur: string };
    icon: string;
    color: string;
    unlocked: boolean;
    currentProgress: number;
    maxProgress: number;
  };
  userScore: number;
  userProfile: any;
  lang: string;
  soundEnabled: boolean;
  playTone: (frequency: number, type: OscillatorType, duration: number, volume?: number) => void;
}

export default function BadgeShareModal({
  isOpen,
  onClose,
  achievement,
  userScore,
  userProfile,
  lang: appLang,
  soundEnabled,
  playTone
}: BadgeShareModalProps) {
  const [lang, setLang] = useState<string>(appLang);
  const [customName, setCustomName] = useState<string>(() => {
    return localStorage.getItem('clay_leaderboard_username') || userProfile?.fullName || '';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(customName);
  const [copied, setCopied] = useState<boolean>(false);
  const [timestamp] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleDateString(appLang === 'en' ? 'en-US' : 'ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  useEffect(() => {
    setLang(appLang);
  }, [appLang]);

  if (!isOpen) return null;

  // Generate a mock verification hash for added skeuomorphic immersion
  const generateVerificationHash = (name: string, badgeId: string) => {
    const seed = `${name}-${badgeId}-CLAY-ARENA-SECURE`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `CLAY-AE-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  };

  const activeName = customName.trim() || (lang === 'en' ? 'Honorary Researcher' : 'Moazzaz Safeer');
  const verificationHash = generateVerificationHash(activeName, achievement.id);

  // Map achievement icon string to the corresponding Lucide Icon
  const getIconComponent = () => {
    switch (achievement.icon) {
      case 'BookOpen': return BookOpen;
      case 'Cpu': return Cpu;
      case 'Zap': return Zap;
      case 'Database': return Database;
      case 'Globe': return Globe;
      case 'Award': return Award;
      case 'Trophy': return Trophy;
      default: return Sparkles;
    }
  };

  const IconComponent = getIconComponent();

  // Get difficulty/rank title of user based on their score
  const getRankTitle = () => {
    if (userScore >= 400) return { en: "AGI Commander", ur: "AGI Sipahsalar" };
    if (userScore >= 250) return { en: "Prompt Master", ur: "Prompt Ka Ustad" };
    if (userScore >= 120) return { en: "Transformer Expert", ur: "Transformer Mahir" };
    if (userScore >= 50) return { en: "Neural Apprentice", ur: "Neural Shagird" };
    return { en: "Silicon Novice", ur: "Shuruati Explorer" };
  };

  const rankTitle = getRankTitle();

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    setCustomName(trimmed);
    localStorage.setItem('clay_leaderboard_username', trimmed);
    setIsEditingName(false);
    if (soundEnabled) playTone(650, 'sine', 0.08, 0.05);
  };

  // Generate stylized markdown message for clipboard
  const shareText = `🦾 I just unlocked the "${achievement.title.en}" Badge in the AI Arena!

🌟 Badge: ${achievement.title.en} (${achievement.desc.en})
⚡ Score: ${userScore} XP
🎖️ Coder Rank: ${rankTitle.en}
🔒 Verification Hash: ${verificationHash}

Challenge my neural weights in AI Arena! #AIArena #ClayML`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    if (soundEnabled) {
      playTone(523.25, 'sine', 0.08, 0.05); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.12, 0.05), 80); // E5
    }
    setTimeout(() => setCopied(false), 2000);
  };

  // Build and Trigger SVG Download
  const handleDownloadSVG = () => {
    // Elegant, highly detailed SVG blueprint that looks professional
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <!-- Definitions for styling, gradients, and filters -->
        <defs>
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2d2d2d" />
            <stop offset="100%" stop-color="#1a1a1a" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#d97706" />
            <stop offset="50%" stop-color="#fbbf24" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
          <linearGradient id="meshGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#d97706" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#2d2d2d" stop-opacity="0" />
          </linearGradient>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#d97706" flood-opacity="0.4" />
          </filter>
        </defs>

        <!-- Main Background Card -->
        <rect width="800" height="500" rx="24" fill="url(#cardGrad)" stroke="#d97706" stroke-width="3" />
        
        <!-- Cybernetic Grid Overlay -->
        <path d="M 0 50 L 800 50 M 0 100 L 800 100 M 0 150 L 800 150 M 0 200 L 800 200 M 0 250 L 800 250 M 0 300 L 800 300 M 0 350 L 800 350 M 0 400 L 800 400 M 0 450 L 800 450" stroke="#d97706" stroke-width="0.3" opacity="0.15" />
        <path d="M 100 0 L 100 500 M 200 0 L 200 500 M 300 0 L 300 500 M 400 0 L 400 500 M 500 0 L 500 500 M 600 0 L 600 500 M 700 0 L 700 500" stroke="#d97706" stroke-width="0.3" opacity="0.15" />

        <!-- Aesthetic Corner Brackets -->
        <path d="M 30 50 L 30 30 L 50 30" fill="none" stroke="#d97706" stroke-width="2" />
        <path d="M 770 50 L 770 30 L 750 30" fill="none" stroke="#d97706" stroke-width="2" />
        <path d="M 30 450 L 30 470 L 50 470" fill="none" stroke="#d97706" stroke-width="2" />
        <path d="M 770 450 L 770 470 L 750 470" fill="none" stroke="#d97706" stroke-width="2" />

        <!-- Dynamic Tech Accent Circuits -->
        <circle cx="50" cy="30" r="3" fill="#d97706" />
        <circle cx="750" cy="30" r="3" fill="#d97706" />
        <circle cx="50" cy="470" r="3" fill="#d97706" />
        <circle cx="750" cy="470" r="3" fill="#d97706" />

        <!-- Header Titles -->
        <text x="400" y="55" font-family="'Sora', 'Inter', sans-serif" font-weight="900" font-size="12" fill="#d97706" letter-spacing="4" text-anchor="middle">CLAY AI ARENA CERTIFICATION</text>
        <line x1="280" y1="65" x2="520" y2="65" stroke="#d97706" stroke-width="1.5" opacity="0.6" />
        
        <!-- Recipient Information -->
        <text x="400" y="115" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">THIS DIGITAL BADGE IS PROUDLY CONFERRED UPON</text>
        <text x="400" y="155" font-family="'Sora', 'Inter', sans-serif" font-weight="800" font-size="28" fill="#F5F2ED" text-anchor="middle">${activeName}</text>
        <line x1="200" y1="175" x2="600" y2="175" stroke="#d97706" stroke-width="1" opacity="0.4" />

        <!-- Achievement Title Block -->
        <text x="400" y="210" font-family="'Inter', sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">FOR OUTSTANDING CONQUEST OF THE NEURAL LEARNING MODULE</text>
        <rect x="200" y="225" width="400" height="42" rx="8" fill="#F5F2ED" fill-opacity="0.05" stroke="#d97706" stroke-width="1.5" />
        <text x="400" y="252" font-family="'Sora', 'Inter', sans-serif" font-weight="800" font-size="18" fill="#fbbf24" text-anchor="middle">${lang === 'en' ? achievement.title.en : achievement.title.ur}</text>

        <!-- Description text (wrapped or summarized) -->
        <text x="400" y="295" font-family="'Inter', sans-serif" font-size="11" fill="#cbd5e1" text-anchor="middle" font-style="italic">
          "${lang === 'en' ? achievement.desc.en : achievement.desc.ur}"
        </text>

        <!-- Stats and Signatures Grid -->
        <line x1="50" y1="335" x2="750" y2="335" stroke="#d97706" stroke-width="0.5" opacity="0.2" />

        <!-- Column 1: Rank Badge -->
        <text x="180" y="365" font-family="'Inter', sans-serif" font-size="10" fill="#94a3b8">CODER RANKING</text>
        <text x="180" y="390" font-family="'Sora', sans-serif" font-weight="700" font-size="14" fill="#F5F2ED">${lang === 'en' ? rankTitle.en : rankTitle.ur}</text>

        <!-- Column 2: Total XP -->
        <text x="400" y="365" font-family="'Inter', sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">TOTAL XP ACCUMULATED</text>
        <text x="400" y="390" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="16" fill="#fbbf24" text-anchor="middle">${userScore} XP</text>

        <!-- Column 3: Verification Hash -->
        <text x="620" y="365" font-family="'Inter', sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">VERIFICATION CODE</text>
        <text x="620" y="390" font-family="'JetBrains Mono', monospace" font-size="11" fill="#a7f3d0" text-anchor="end">${verificationHash}</text>

        <!-- Footer Seal Info -->
        <line x1="50" y1="415" x2="750" y2="415" stroke="#d97706" stroke-width="0.5" opacity="0.2" />
        
        <text x="100" y="445" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">Verified Epoch: ${timestamp}</text>
        <text x="700" y="445" font-family="'JetBrains Mono', monospace" font-size="10" fill="#d97706" text-anchor="end">CLAY-ARENA-V2-SECURE</text>

        <!-- Small Golden Badge Illustration (Right Bottom Corner overlay) -->
        <circle cx="700" cy="245" r="30" fill="#2d2d2d" stroke="url(#goldGrad)" stroke-width="2" filter="url(#glow)" />
        <circle cx="700" cy="245" r="25" fill="#d97706" fill-opacity="0.1" />
        <path d="M 693 241 L 700 234 L 707 241 M 700 234 L 700 256 M 693 250 L 700 257 L 707 250" fill="none" stroke="#fbbf24" stroke-width="2" />
        <circle cx="700" cy="245" r="3" fill="#fbbf24" />
      </svg>
    `;

    // Convert SVG string to data URI and initiate browser download
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Clay-AI-Arena-Badge-${achievement.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (soundEnabled) playTone(880, 'sine', 0.15, 0.05); // Clean success sound
  };

  // Pre-configured social URLs
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://ai.studio/build')}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 bg-brand-charcoal/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-brand-cream border border-brand-slate/15 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-left"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-brand-slate/10 bg-brand-sand/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-amber" />
            <h3 className="font-display font-black text-lg text-brand-charcoal tracking-tight">
              {lang === 'en' ? "Share Your Achievement" : "Apni Kamyabi Share Karein"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-brand-sand rounded-xl text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Interactive Handle Customizer */}
          <div className="p-4 bg-brand-sand/30 border border-brand-slate/10 rounded-xl space-y-3">
            <span className="block text-[10px] font-mono uppercase font-black text-brand-muted tracking-wider">
              {lang === 'en' ? "CERTIFICATE NAME CUSTOMIZATION" : "CERTIFICATE PAR NAAM TABDEELI"}
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value.slice(0, 25))}
                    className="w-full max-w-[250px] px-3 py-1.5 bg-white border border-brand-slate/20 rounded-lg text-xs font-sans font-medium text-brand-charcoal outline-none focus:border-brand-amber"
                    placeholder={lang === 'en' ? "Enter recipient name..." : "Naam likhein..."}
                    maxLength={25}
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3.5 py-1.5 bg-brand-amber hover:bg-brand-amber/90 border border-brand-amber/20 hover:border-brand-amber/40 text-brand-charcoal font-mono font-black text-[10px] rounded-lg cursor-pointer active:scale-95 transition-all"
                  >
                    {lang === 'en' ? "SAVE" : "MEHFOOZ"}
                  </button>
                  <button
                    onClick={() => {
                      setTempName(customName);
                      setIsEditingName(false);
                    }}
                    className="px-2.5 py-1.5 text-brand-muted hover:bg-brand-sand font-mono text-[10px] rounded-lg cursor-pointer"
                  >
                    {lang === 'en' ? "CANCEL" : "WAPAS"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-sans font-extrabold text-brand-charcoal">
                    {activeName}
                  </span>
                  <button
                    onClick={() => {
                      setTempName(customName);
                      setIsEditingName(true);
                      if (soundEnabled) playTone(500, 'sine', 0.05, 0.05);
                    }}
                    className="text-xs font-mono font-bold text-brand-amber hover:text-brand-charcoal hover:underline transition-all cursor-pointer"
                  >
                    {lang === 'en' ? "[Edit Name]" : "[Naam Badlein]"}
                  </button>
                </div>
              )}

              {/* Languages button */}
              <div className="flex bg-brand-sand p-0.5 rounded-lg border border-brand-slate/10 shrink-0">
                <button
                  onClick={() => {
                    setLang('en');
                    if (soundEnabled) playTone(600, 'sine', 0.04, 0.04);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono font-black rounded ${
                    lang === 'en' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLang('ur');
                    if (soundEnabled) playTone(600, 'sine', 0.04, 0.04);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono font-black rounded ${
                    lang === 'ur' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Rendered Skeuomorphic Certificate Showcase */}
          <div className="border-2 border-brand-charcoal bg-brand-charcoal text-brand-cream p-6 rounded-2xl relative shadow-md overflow-hidden aspect-[8/5] flex flex-col justify-between">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Frame Corners */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brand-amber opacity-60" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brand-amber opacity-60" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brand-amber opacity-60" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brand-amber opacity-60" />

            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <span className="block text-[8px] font-mono uppercase font-black text-brand-amber tracking-widest">
                  CLAY AI ARENA CERTIFICATION
                </span>
                <span className="block text-[7px] font-mono text-white/50">
                  ID: {verificationHash}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                LEVEL {Math.floor(userScore / 100) + 1}
              </span>
            </div>

            {/* Recipient Greeting */}
            <div className="text-center my-auto py-2">
              <span className="text-[9px] font-mono text-white/60 tracking-wider block uppercase">
                {lang === 'en' ? "This dynamic digital badge is awarded to" : "Ye digital badge is koshish par diya gaya"}
              </span>
              <h4 className="font-display font-black text-xl text-brand-cream leading-tight mt-1 truncate">
                {activeName}
              </h4>
              <div className="w-24 h-0.5 bg-brand-amber/40 mx-auto my-1.5" />
              <p className="text-[10px] font-mono text-brand-amber font-extrabold uppercase tracking-wide">
                {lang === 'en' ? "Conqueror of the Neural Node" : "Neural Node Ke Fateh"}
              </p>
            </div>

            {/* Badge Highlight Block */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-amber/15 border border-brand-amber/25 text-brand-amber flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="block text-[8px] font-mono font-bold text-brand-amber uppercase">
                  {lang === 'en' ? "OFFICIALLY UNLOCKED" : "MUKAMMAL UNLOCK HUWA"}
                </span>
                <h5 className="font-display font-black text-sm text-brand-cream tracking-tight truncate">
                  {lang === 'en' ? achievement.title.en : achievement.title.ur}
                </h5>
                <p className="text-[10px] text-white/70 line-clamp-1">
                  {lang === 'en' ? achievement.desc.en : achievement.desc.ur}
                </p>
              </div>
            </div>

            {/* Footer Row */}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[8px] font-mono text-white/50">
              <span>{lang === 'en' ? "Verified Epoch:" : "Tasdeeqi Tareekh:"} {timestamp}</span>
              <span className="text-brand-amber uppercase font-bold">
                {lang === 'en' ? rankTitle.en : rankTitle.ur} ({userScore} XP)
              </span>
            </div>
          </div>

          {/* Section 3: Interactive Action Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-5 py-3.5 rounded-xl border-2 border-brand-charcoal hover:bg-brand-sand/30 font-mono font-black text-xs text-brand-charcoal flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600 animate-bounce" />
                  <span className="text-green-600">{lang === 'en' ? "COPIED TO CLIPBOARD" : "CLIPBOARD PAR COPIED!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{lang === 'en' ? "COPY SHARE INVITE" : "INVITE TEXT COPY KAREIN"}</span>
                </>
              )}
            </button>

            {/* Download SVG Button */}
            <button
              onClick={handleDownloadSVG}
              className="px-5 py-3.5 rounded-xl bg-brand-charcoal hover:bg-brand-charcoal/95 border-2 border-brand-charcoal text-white font-mono font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 hover:shadow-md"
            >
              <Download className="w-4 h-4 text-brand-amber" />
              <span>{lang === 'en' ? "DOWNLOAD DIGITAL CERT" : "CERTIFICATE DOWNLOAD KAREIN"}</span>
            </button>
          </div>

          {/* Section 4: Quick Social Redirect Shortcuts */}
          <div className="space-y-3 pt-2">
            <span className="block text-center text-[10px] font-mono uppercase font-black text-brand-muted tracking-wider">
              {lang === 'en' ? "QUICK BROADCAST TO NETWORKS" : "NETWORKS PAR SHURUATI SHOUQ"}
            </span>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white font-mono font-bold text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </a>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-mono font-bold text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-mono font-bold text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-brand-sand/15 border-t border-brand-slate/10 flex justify-between items-center text-xs text-brand-muted">
          <span>{lang === 'en' ? "Cryptographically verifiable badge showcase." : "Mehfooz tareen digital badge certificate."}</span>
          <span className="font-mono font-bold text-[10px] text-brand-amber">AI ARENA SECURE</span>
        </div>
      </motion.div>
    </div>
  );
}
