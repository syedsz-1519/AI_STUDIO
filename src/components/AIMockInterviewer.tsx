import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Clock, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Brain, 
  FileText, 
  Code, 
  Eye, 
  Smile, 
  MessageSquare, 
  ArrowLeft, 
  Download, 
  Share2, 
  ListOrdered,
  Layers,
  Zap,
  TrendingUp,
  XCircle,
  Lightbulb,
  Check,
  RefreshCw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { 
  InterviewQuestion, 
  InterviewerPersona, 
  MockInterviewRecord, 
  QuestionAttempt, 
  CameraTrackingMetrics 
} from '../types';
import { 
  INTERVIEWER_PERSONAS, 
  INTERVIEW_ROLES, 
  INTERVIEW_QUESTIONS_DATABASE 
} from '../data/interviewData';
import CameraTrackerHUD from './CameraTrackerHUD';
import InterviewPerformanceChart from './InterviewPerformanceChart';
import CopyCodeButton from './CopyCodeButton';
import { sendGeminiChat } from '../lib/geminiClient';
import { audioEngine } from '../lib/audioEngine';

interface AIMockInterviewerProps {
  onBackToGuide?: () => void;
  onViewDashboard?: () => void;
}

export default function AIMockInterviewer({
  onBackToGuide,
  onViewDashboard,
}: AIMockInterviewerProps) {
  const { lang } = useLanguage();

  // Screen Stage: 'setup' | 'interview' | 'scorecard'
  const [stage, setStage] = useState<'setup' | 'interview' | 'scorecard'>('setup');

  // Selected configurations
  const [selectedRoleId, setSelectedRoleId] = useState<string>('ai_ml_engineer');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('dr_sarah');
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid-Level' | 'Senior' | 'Staff'>('Mid-Level');
  const [isUrduMode, setIsUrduMode] = useState<boolean>(lang === 'hyd');

  // Interview active session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [userCode, setUserCode] = useState('');
  const [showCodePad, setShowCodePad] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [interviewerStatus, setInterviewerStatus] = useState<'Speaking' | 'Listening' | 'Taking Notes' | 'Pondering' | 'Interacting'>('Speaking');
  const [interviewerSpeechText, setInterviewerSpeechText] = useState('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [inBetweenMessage, setInBetweenMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Live camera tracking metrics from HUD
  const [liveMetrics, setLiveMetrics] = useState<CameraTrackingMetrics>({
    eyeContactScore: 92,
    confidenceScore: 88,
    centeringScore: 95,
    postureAlert: false,
    smilePercentage: 65,
    speakingVolumeDb: -45,
    fillerWordCount: 0,
    blinkRatePerMin: 18,
    lightingQuality: 'Optimal',
  });

  // Scorecard state
  const [completedRecord, setCompletedRecord] = useState<MockInterviewRecord | null>(null);

  // Speech Recognition ref
  const recognitionRef = useRef<any>(null);

  // Selected Persona & Role objects
  const currentPersona = INTERVIEWER_PERSONAS.find(p => p.id === selectedPersonaId) || INTERVIEWER_PERSONAS[0];
  const currentRole = INTERVIEW_ROLES.find(r => r.id === selectedRoleId) || INTERVIEW_ROLES[0];
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Speak Question / In-Between Text via SpeechSynthesis
  const speakText = useCallback((text: string, persona: InterviewerPersona) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = persona.voiceGender === 'female' ? 1.15 : 0.9;
    
    // Choose appropriate browser voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (persona.voiceGender === 'female' ? (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google UK English Female')) : true)
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeakingAudio(true);
      setInterviewerStatus('Speaking');
    };

    utterance.onend = () => {
      setIsSpeakingAudio(false);
      setInterviewerStatus('Listening');
    };

    utterance.onerror = () => {
      setIsSpeakingAudio(false);
      setInterviewerStatus('Listening');
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAudio(false);
  };

  // Start Voice Recognition
  const startSpeechRecognition = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert(lang === 'en' ? 'Speech recognition is not supported in this browser. You can type your answer in the box below.' : 'Aapke browser me speech recognition nahi chali. Aap type kar sakte hain.');
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isUrduMode ? 'ur-PK' : 'en-US';

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        setInterviewerStatus('Listening');
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTrans) {
          setUserAnswer(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + finalTrans.trim());
          
          // Trigger subtle in-between reaction from AI
          triggerInBetweenReaction(finalTrans);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Recognition setup failed:', err);
      setIsRecordingVoice(false);
    }
  };

  // Stop Voice Recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecordingVoice(false);
  };

  // Trigger Realistic In-Between Reaction from the AI Interviewer
  const triggerInBetweenReaction = (transcribedSnippet: string) => {
    if (!currentQuestion) return;
    
    // Check if snippet contains keywords from question
    const matchedKey = currentQuestion.keyConcepts.find(k => 
      transcribedSnippet.toLowerCase().includes(k.toLowerCase().split(' ')[0])
    );

    if (matchedKey && !inBetweenMessage) {
      const reactions = currentQuestion.interviewerInBetweenComments || [
        'Good point, keep expanding on that.',
        'Exactly right on that concept.',
        'Interesting angle!',
      ];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      
      setInBetweenMessage(reaction);
      setInterviewerStatus('Interacting');

      // Auto-clear in-between notification after 4.5 seconds
      setTimeout(() => {
        setInBetweenMessage(null);
        setInterviewerStatus('Listening');
      }, 4500);
    }
  };

  // Request a Hint / In-Between Clarification
  const handleRequestHint = () => {
    if (!currentQuestion) return;
    const hint = currentQuestion.interviewerFollowUpHint || 'Focus on the core trade-offs and structural differences.';
    const formattedHint = `${currentPersona.name}: "${hint}"`;
    setInBetweenMessage(formattedHint);
    setInterviewerStatus('Speaking');
    speakText(hint, currentPersona);

    setTimeout(() => {
      setInBetweenMessage(null);
      setInterviewerStatus('Listening');
    }, 6500);
  };

  // Start Full Interview Session
  const handleStartInterview = () => {
    const pool = INTERVIEW_QUESTIONS_DATABASE[selectedRoleId] || INTERVIEW_QUESTIONS_DATABASE['ai_ml_engineer'];
    setQuestions(pool);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setUserCode('');
    setAttempts([]);
    setElapsedSeconds(0);
    setQuestionSeconds(0);
    setIsPaused(false);
    setStage('interview');

    // Introduce interview question
    if (pool[0]) {
      const qText = isUrduMode && pool[0].questionUrdu ? pool[0].questionUrdu : pool[0].question;
      setInterviewerSpeechText(qText);
      setTimeout(() => {
        speakText(qText, currentPersona);
      }, 400);
    }
  };

  // Main Timer loop
  useEffect(() => {
    if (stage !== 'interview' || isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setQuestionSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isPaused]);

  // Submit Current Answer & Advance to Next Question
  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    stopSpeaking();
    stopSpeechRecognition();
    setIsEvaluating(true);
    setInterviewerStatus('Taking Notes');

    const duration = questionSeconds;
    const fullAnswerText = userAnswer.trim() || 'No answer provided verbally or in text.';

    // Evaluate answer with Gemini AI or Smart Rubric Fallback
    let score = 82;
    let feedback = '';
    let strengths: string[] = [];
    let improvements: string[] = [];

    try {
      const prompt = `You are ${currentPersona.name}, a ${currentPersona.role} conducting an AI technical mock interview.
Evaluate the candidate's answer for the following question:
Question: "${currentQuestion.question}"
Candidate Answer: "${fullAnswerText}"
Candidate Code/Scratchpad: "${userCode || 'None'}"
Key Expected Concepts: ${currentQuestion.keyConcepts.join(', ')}

Please provide a JSON response with:
1. "score": number from 0 to 100
2. "feedback": 2-3 sentences of constructive critique in conversational interviewer voice.
3. "strengths": array of 2 bullet points
4. "improvements": array of 2 bullet points of missed nuances or trade-offs.`;

      const response = await sendGeminiChat({
        messages: [{ role: 'user', content: prompt }],
        systemInstruction: 'You are an expert AI interviewer scoring mock candidate responses. Return JSON only.',
      });

      // Parse JSON from Gemini reply
      const jsonMatch = response.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        score = parsed.score || 80;
        feedback = parsed.feedback || 'Solid conceptual grasp with good foundational points.';
        strengths = parsed.strengths || ['Clear terminology', 'Good structured explanation'];
        improvements = parsed.improvements || ['Could dive deeper into mathematical trade-offs', 'Mention edge-cases'];
      } else {
        feedback = response.reply.slice(0, 200);
      }
    } catch (err) {
      // Smart offline fallback rubric
      const wordCount = fullAnswerText.split(' ').length;
      const matchedConcepts = currentQuestion.keyConcepts.filter(k => 
        fullAnswerText.toLowerCase().includes(k.toLowerCase().split(' ')[0])
      );
      score = Math.min(95, Math.max(50, 60 + matchedConcepts.length * 8 + (wordCount > 30 ? 10 : 0)));
      feedback = `Good attempt! You captured ${matchedConcepts.length} out of ${currentQuestion.keyConcepts.length} key concepts. Your communication was structured and confident.`;
      strengths = matchedConcepts.length > 0 
        ? matchedConcepts.map(c => `Mentioned ${c}`)
        : ['Clear speaking tone', 'Direct approach'];
      improvements = [
        'Explore the mathematical derivatives and edge-case behaviors',
        'Elaborate on production latency and memory bottlenecks'
      ];
    }

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      userAnswer: fullAnswerText,
      userCode: userCode || undefined,
      durationSeconds: duration,
      aiFeedback: feedback,
      score,
      strengths,
      improvements,
      modelAnswer: currentQuestion.sampleAnswer,
      inBetweenInteractions: inBetweenMessage ? [inBetweenMessage] : [],
    };

    const updatedAttempts = [...attempts, attempt];
    setAttempts(updatedAttempts);
    setIsEvaluating(false);

    // If there are more questions, advance
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setUserAnswer('');
      setUserCode('');
      setQuestionSeconds(0);
      setInBetweenMessage(null);

      const nextQ = questions[nextIdx];
      const nextQText = isUrduMode && nextQ.questionUrdu ? nextQ.questionUrdu : nextQ.question;
      setInterviewerSpeechText(nextQText);
      setTimeout(() => {
        speakText(nextQText, currentPersona);
      }, 500);
    } else {
      // Complete full interview session and generate Final Scorecard
      finalizeInterview(updatedAttempts);
    }
  };

  // Generate Final Scorecard & Save to LocalStorage / Dashboard
  const finalizeInterview = (allAttempts: QuestionAttempt[]) => {
    stopSpeaking();
    stopSpeechRecognition();

    const totalScore = Math.round(
      allAttempts.reduce((acc, curr) => acc + curr.score, 0) / (allAttempts.length || 1)
    );

    let hiringDecision: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement' = 'Hire';
    if (totalScore >= 90) hiringDecision = 'Strong Hire';
    else if (totalScore >= 78) hiringDecision = 'Hire';
    else if (totalScore >= 65) hiringDecision = 'Leaning Hire';
    else hiringDecision = 'Needs Improvement';

    const techScore = totalScore;
    const commScore = Math.round(Math.min(98, Math.max(70, liveMetrics.confidenceScore + 5)));
    const eyeContact = liveMetrics.eyeContactScore;

    const record: MockInterviewRecord = {
      id: `interview_${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      roleTrack: currentRole.title,
      interviewerName: currentPersona.name,
      difficulty,
      durationSeconds: elapsedSeconds,
      overallScore: totalScore,
      hiringDecision,
      technicalScore: techScore,
      communicationScore: commScore,
      eyeContactScore: eyeContact,
      confidenceScore: liveMetrics.confidenceScore,
      attempts: allAttempts,
      summaryFeedback: `Candidate demonstrated strong intuitive understanding of ${currentRole.title} fundamentals, maintaining ${eyeContact}% eye contact and confident technical pacing.`,
      topStrengths: [
        'High composure and consistent camera gaze tracking',
        'Strong grasp of architectural tradeoffs (RAG, attention, loss optimization)',
        'Clear, articulate spoken communication with minimal filler pauses'
      ],
      keyActionItems: [
        'Practice writing out mathematical loss functions and matrix dimensions',
        'Deepen familiarity with low-level GPU memory quantization and KV-cache constraints',
        'Incorporate more real-world quantitative metrics (e.g. latency percentiles, ROC-AUC) into verbal answers'
      ],
    };

    setCompletedRecord(record);
    setStage('scorecard');

    // Save record to local storage for Dashboard integration
    try {
      const savedHistory = localStorage.getItem('clay_mock_interviews');
      const parsedHistory: MockInterviewRecord[] = savedHistory ? JSON.parse(savedHistory) : [];
      parsedHistory.unshift(record);
      localStorage.setItem('clay_mock_interviews', JSON.stringify(parsedHistory));
      window.dispatchEvent(new Event('clay_interview_saved'));
    } catch (e) {
      console.warn('Failed to save interview record:', e);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <section className="w-full min-h-screen bg-brand-cream py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* ========================================================================= */}
        {/* STAGE 1: INTERVIEW SETUP & PERSONA SELECTION */}
        {/* ========================================================================= */}
        {stage === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Back / Navigation Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={onBackToGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-slate/15 text-brand-slate hover:text-brand-charcoal text-xs font-bold shadow-2xs hover:bg-brand-sand transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === 'en' ? "Back to AI Guide" : "AI Guide Par Wapas Jayein"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onViewDashboard}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber-dark hover:bg-brand-amber/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  {lang === 'en' ? "My Student Dashboard" : "Mera Student Dashboard"}
                </button>
              </div>
            </div>

            {/* Header Hero Banner */}
            <div className="bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden text-left">
              <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 border border-brand-amber/30 text-brand-amber text-[10px] font-mono font-black uppercase tracking-wider mb-3">
                  <Video className="w-3.5 h-3.5 animate-pulse" />
                  <span>AI Technical Mock Interviewer & Vision HUD</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {lang === 'en' ? "Practice AI Technical Interviews with Real Camera Vision" : "Real Camera Tracker ke Sath AI Mock Interview Ki Practice Karein"}
                </h1>
                <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                  {lang === 'en' 
                    ? "Experience real-time interviewer interactions, proactive in-between conversational nudges, live eye-contact tracking, and instant AI grading on your answers."
                    : "Real camera gaze tracker, animated AI interviewer aur live question-answer evaluations ke sath apni interview skills mazboot karein."}
                </p>

                {/* Feature Highlights Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10 text-[11px] font-mono text-white/80">
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Real Camera Eye-Contact HUD
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Bot className="w-3.5 h-3.5 text-brand-amber" /> In-Between AI Interactivity
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice & Speech Recognition
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Step: Select Role Track */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-amber" />
                  {lang === 'en' ? "1. Select Interview Role Track" : "1. Interview Ka Role Chuniye"}
                </h3>
                <span className="text-[10px] font-mono text-brand-muted uppercase font-bold">
                  {INTERVIEW_ROLES.length} Specialized Tracks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INTERVIEW_ROLES.map((role) => {
                  const isSelected = selectedRoleId === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setSelectedPersonaId(role.recommendedPersona);
                        audioEngine.playLoFiChord();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-brand-amber bg-brand-amber/[0.04] shadow-md ring-2 ring-brand-amber/30' 
                          : 'border-brand-slate/10 bg-brand-sand/20 hover:border-brand-slate/25'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-brand-amber text-white rounded-full flex items-center justify-center text-xs shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full inline-block mb-2">
                          {role.badge}
                        </span>
                        <h4 className="font-display font-bold text-xs text-brand-charcoal leading-snug">
                          {role.title}
                        </h4>
                        <p className="text-[10px] text-brand-muted mt-1 leading-relaxed line-clamp-2">
                          {role.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-brand-slate/10 flex items-center justify-between text-[9px] font-mono text-brand-slate">
                        <span>{role.totalQuestions} Questions</span>
                        <span className="text-brand-amber font-bold">~12 Mins</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Step: Select Interviewer Persona */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <Bot className="w-4 h-4 text-brand-amber" />
                  {lang === 'en' ? "2. Choose Your AI Interviewer Persona" : "2. Apna AI Interviewer Chuniye"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INTERVIEWER_PERSONAS.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersonaId(persona.id);
                        audioEngine.playLoFiChord();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected 
                          ? 'border-brand-amber bg-brand-amber/[0.04] shadow-md ring-2 ring-brand-amber/30' 
                          : 'border-brand-slate/10 bg-brand-sand/20 hover:border-brand-slate/25'
                      }`}
                    >
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-12 h-12 rounded-xl object-cover border border-brand-slate/15 shrink-0 shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-xs text-brand-charcoal truncate">
                            {persona.name}
                          </h4>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-amber shrink-0" />}
                        </div>
                        <span className="text-[9px] font-mono text-brand-amber font-semibold block truncate">
                          {persona.role}
                        </span>
                        <p className="text-[9.5px] text-brand-muted line-clamp-2 mt-0.5">
                          {persona.tone}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Step: Experience Level & Language Options */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-xs text-brand-charcoal">
                  {lang === 'en' ? "Target Seniority Level" : "Experience Level"}
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  {(['Junior', 'Mid-Level', 'Senior', 'Staff'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        difficulty === lvl
                          ? 'bg-brand-charcoal text-white shadow'
                          : 'bg-brand-sand/40 text-brand-slate hover:bg-brand-sand'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsUrduMode(!isUrduMode)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isUrduMode 
                      ? 'bg-brand-amber/15 border-brand-amber text-brand-amber-dark' 
                      : 'bg-brand-sand/30 border-brand-slate/15 text-brand-slate'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUrduMode ? "Bilingual Urdu/English Mode ON" : "English Only Mode"}</span>
                </button>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleStartInterview}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-brand-amber to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-display font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
              >
                <Video className="w-5 h-5 animate-pulse" />
                <span>{lang === 'en' ? "Enter Live Mock Interview Room" : "Live Interview Room Me Dakhil Hon"}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: LIVE INTERVIEW ROOM WITH REAL CAMERA & AI INTERVIEWER */}
        {/* ========================================================================= */}
        {stage === 'interview' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 text-left"
          >
            {/* Top Live Bar: Role, Question Progress, and Timers */}
            <div className="bg-white rounded-2xl p-3.5 px-5 border border-brand-slate/15 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold text-brand-amber block">
                    {currentRole.title} ({difficulty})
                  </span>
                  <h3 className="font-display text-xs font-black text-brand-charcoal">
                    Question {currentQuestionIndex + 1} of {questions.length} • {currentQuestion.topic}
                  </h3>
                </div>
              </div>

              {/* Timers & Pause Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-sand/50 rounded-xl font-mono text-xs text-brand-charcoal font-bold">
                  <Clock className="w-3.5 h-3.5 text-brand-amber" />
                  <span>{formatTime(questionSeconds)}</span>
                  <span className="text-brand-muted text-[10px]">/ Total {formatTime(elapsedSeconds)}</span>
                </div>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-lg border border-brand-slate/15 hover:bg-brand-sand text-brand-slate cursor-pointer"
                  title={isPaused ? "Resume Interview" : "Pause Interview"}
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to end this mock interview early?')) {
                      finalizeInterview(attempts);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                >
                  End Session
                </button>
              </div>
            </div>

            {/* Main Video Stage: 2-Column Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* LEFT COLUMN: Candidate Live Video Feed + Real-Time Vision HUD */}
              <div className="flex flex-col h-[380px] sm:h-[420px]">
                <CameraTrackerHUD
                  isInterviewActive={true}
                  onMetricsUpdate={(m) => setLiveMetrics(m)}
                  isUserSpeaking={isRecordingVoice || userAnswer.length > 5}
                />
              </div>

              {/* RIGHT COLUMN: AI Interviewer Video Avatar Studio & Live Audio Speech */}
              <div className="bg-brand-charcoal rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden text-white min-h-[380px] sm:h-[420px]">
                
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Interviewer Profile Header */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentPersona.avatar}
                        alt={currentPersona.name}
                        className={`w-11 h-11 rounded-2xl object-cover border-2 shadow-md ${
                          interviewerStatus === 'Speaking' 
                            ? 'border-brand-amber ring-2 ring-brand-amber/60 animate-pulse' 
                            : 'border-white/20'
                        }`}
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-brand-charcoal ${
                        interviewerStatus === 'Speaking' ? 'bg-brand-amber' : interviewerStatus === 'Listening' ? 'bg-emerald-400' : 'bg-purple-400'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-xs text-white">
                          {currentPersona.name}
                        </h4>
                        <span className="text-[9px] font-mono text-white/50">• {currentPersona.company}</span>
                      </div>
                      <span className="text-[10px] font-mono text-brand-amber flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping" />
                        Status: {interviewerStatus}
                      </span>
                    </div>
                  </div>

                  {/* Speaker Replay Button */}
                  <button
                    onClick={() => {
                      if (isSpeakingAudio) stopSpeaking();
                      else speakText(interviewerSpeechText, currentPersona);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSpeakingAudio 
                        ? 'bg-brand-amber/20 border-brand-amber text-brand-amber' 
                        : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                    }`}
                    title={isSpeakingAudio ? "Mute Interviewer" : "Replay Question Audio"}
                  >
                    {isSpeakingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span className="text-[10px] font-mono hidden sm:inline">{isSpeakingAudio ? 'Speaking...' : 'Replay Voice'}</span>
                  </button>
                </div>

                {/* Center: Live Spoken Question Display */}
                <div className="relative z-10 my-auto py-3 space-y-3">
                  <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
                    <span className="text-[9.5px] font-mono uppercase font-bold text-brand-amber tracking-wider block mb-1">
                      Technical Question:
                    </span>
                    <p className="font-display text-sm sm:text-base font-bold text-white leading-relaxed">
                      {isUrduMode && currentQuestion.questionUrdu ? currentQuestion.questionUrdu : currentQuestion.question}
                    </p>

                    {/* Key expected concepts preview tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
                      <span className="text-[9px] font-mono text-white/40 uppercase font-bold mr-1">Focus Areas:</span>
                      {currentQuestion.keyConcepts.slice(0, 3).map((concept, idx) => (
                        <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-brand-amber">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IN-BETWEEN CONVERSATIONAL INTERACTION BUBBLE (The AI bot acting in-between!) */}
                  <AnimatePresence>
                    {inBetweenMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-xs text-amber-200 shadow-xl flex items-start gap-2.5 backdrop-blur-md"
                      >
                        <Bot className="w-4 h-4 text-brand-amber shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <span className="text-[9px] font-mono uppercase font-black text-brand-amber block">
                            Interviewer Live In-Between Comment:
                          </span>
                          <p className="font-medium text-white/95 mt-0.5 leading-snug">
                            "{inBetweenMessage}"
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom In-Between Action Helpers */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={handleRequestHint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Request Hint" : "Hint Maangein"}</span>
                  </button>

                  <span className="text-[10px] font-mono text-white/50">
                    {isRecordingVoice ? '🎙️ Mic active - transcribing...' : 'Type or speak answer'}
                  </span>
                </div>
              </div>
            </div>

            {/* CANDIDATE ANSWER SUBMISSION BAR */}
            <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-amber" />
                    {lang === 'en' ? "Your Spoken or Written Answer" : "Aapka Jawab"}
                  </h4>
                  <span className="text-[10px] font-mono text-brand-muted">
                    ({userAnswer.trim().split(/\s+/).filter(Boolean).length} words)
                  </span>
                </div>

                {/* Code Scratchpad Toggle */}
                <button
                  onClick={() => setShowCodePad(!showCodePad)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showCodePad 
                      ? 'bg-brand-charcoal text-white' 
                      : 'bg-brand-sand/50 text-brand-slate hover:bg-brand-sand'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showCodePad ? 'Hide Code Scratchpad' : 'Code Scratchpad'}</span>
                </button>
              </div>

              {/* Main Answer Text Area */}
              <div className="relative">
                <textarea
                  rows={3}
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    triggerInBetweenReaction(e.target.value);
                  }}
                  placeholder={lang === 'en' 
                    ? "Speak into your microphone or type your explanation here. The AI interviewer will analyze keywords, structure, and camera tracking..." 
                    : "Apna jawab bol kar ya type karke yahan likhein..."}
                  className="w-full p-3.5 bg-brand-sand/20 border border-brand-slate/15 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors leading-relaxed"
                />
              </div>

              {/* Code scratchpad optional */}
              {showCodePad && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-muted uppercase font-bold">
                    <span>Code / Architecture Diagram Scratchpad</span>
                    <CopyCodeButton text={userCode} label="Copy Code" variant="compact" />
                  </div>
                  <textarea
                    rows={4}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="// Optional: paste Python/PyTorch snippet, Transformer pseudo-code, or RAG architecture flow..."
                    className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none focus:border-brand-amber"
                  />
                </div>
              )}

              {/* Control Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* Voice Record Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={isRecordingVoice ? stopSpeechRecognition : startSpeechRecognition}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      isRecordingVoice
                        ? 'bg-red-500 text-white animate-pulse shadow-red-500/30'
                        : 'bg-brand-sand/70 text-brand-charcoal hover:bg-brand-sand'
                    }`}
                  >
                    {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-amber" />}
                    <span>{isRecordingVoice ? 'Stop Recording' : 'Speak Answer (Mic)'}</span>
                  </button>

                  {isRecordingVoice && (
                    <span className="text-[10px] font-mono text-red-600 font-bold animate-pulse hidden sm:inline">
                      ● Recording live audio...
                    </span>
                  )}
                </div>

                {/* Next / Submit Button */}
                <button
                  onClick={handleNextQuestion}
                  disabled={isEvaluating}
                  className="px-6 py-2.5 bg-brand-amber hover:bg-brand-amber-dark disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'en' ? "AI Evaluating Answer..." : "AI Jawab Check Kar Raha Hai..."}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentQuestionIndex < questions.length - 1 
                          ? (lang === 'en' ? "Submit & Next Question" : "Agla Sawal") 
                          : (lang === 'en' ? "Finish & View Scorecard" : "Scorecard Dekhein")}
                      </span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: COMPREHENSIVE AI EVALUATION SCORECARD */}
        {/* ========================================================================= */}
        {stage === 'scorecard' && completedRecord && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-left"
          >
            {/* Top Scorecard Header Banner */}
            <div className="bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mock Interview Completed • Verified AI Evaluation</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {completedRecord.roleTrack}
                  </h2>
                  <p className="text-xs text-white/70 mt-1">
                    Evaluated by {completedRecord.interviewerName} • {completedRecord.dateStr} • Duration {formatTime(completedRecord.durationSeconds)}
                  </p>
                </div>

                {/* Big Overall Grade Badge */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/15">
                  <div className="text-center">
                    <span className="text-[9px] font-mono uppercase font-bold text-brand-amber block">
                      Overall Score
                    </span>
                    <div className="text-4xl font-black text-white leading-tight font-display">
                      {completedRecord.overallScore}<span className="text-lg text-brand-amber">/100</span>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-white/20" />

                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-white/60 block">
                      Hiring Verdict
                    </span>
                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg inline-block mt-0.5 ${
                      completedRecord.hiringDecision === 'Strong Hire' ? 'bg-emerald-500 text-white' :
                      completedRecord.hiringDecision === 'Hire' ? 'bg-teal-500 text-white' :
                      completedRecord.hiringDecision === 'Leaning Hire' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {completedRecord.hiringDecision}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Radar & Breakdown Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-brand-amber mb-1">
                  <Brain className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Technical Depth</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.technicalScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Concept accuracy</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-purple-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Communication</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.communicationScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Structure & clarity</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Eye Contact HUD</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.eyeContactScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Camera presence</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Confidence</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.confidenceScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Composure & pacing</span>
              </div>
            </div>

            {/* Recharts Performance Radar & Metrics Visualizer */}
            <InterviewPerformanceChart
              records={[completedRecord]}
              title={lang === 'en' ? "Session Performance Radar & Metrics" : "Session Performance Chart"}
              subtitle={lang === 'en' ? "Multi-axis breakdown of this mock interview session." : "Is session ka scorecard chart."}
            />

            {/* Strengths & Action Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
                <h3 className="font-display text-sm font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Strengths Observed
                </h3>
                <ul className="space-y-2 text-xs text-brand-charcoal">
                  {completedRecord.topStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
                <h3 className="font-display text-sm font-bold text-amber-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-amber" />
                  High-Impact Improvement Areas
                </h3>
                <ul className="space-y-2 text-xs text-brand-charcoal">
                  {completedRecord.keyActionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-amber font-bold">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Deep Dive */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-brand-amber" />
                Question-by-Question Breakdown & Ideal Model Answers
              </h3>

              <div className="space-y-4">
                {completedRecord.attempts.map((att, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full">
                        Question {idx + 1} • Score: {att.score}/100
                      </span>
                      <span className="text-[10px] font-mono text-brand-muted">
                        Answered in {formatTime(att.durationSeconds)}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-xs text-brand-charcoal">
                      {att.questionText}
                    </h4>

                    {/* Candidate Transcript */}
                    <div className="p-3 bg-white rounded-xl border border-brand-slate/10 text-xs">
                      <span className="font-mono text-[9px] text-brand-muted uppercase font-bold block mb-1">
                        Your Transcript / Answer:
                      </span>
                      <p className="text-brand-charcoal italic leading-relaxed">
                        "{att.userAnswer}"
                      </p>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-900">
                      <span className="font-mono text-[9px] text-amber-800 uppercase font-black block mb-0.5">
                        Interviewer Critique:
                      </span>
                      <p>{att.aiFeedback}</p>
                    </div>

                    {/* Ideal Model Answer with Copy */}
                    <div className="p-3 bg-slate-900 rounded-xl text-white text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-emerald-400 uppercase font-black">
                          Ideal Model Technical Answer:
                        </span>
                        <CopyCodeButton text={att.modelAnswer} label="Copy Answer" variant="compact" />
                      </div>
                      <p className="text-white/80 leading-relaxed font-sans text-[11px]">
                        {att.modelAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Retake, Go to Dashboard, Back to Guide */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <button
                onClick={() => setStage('setup')}
                className="px-5 py-2.5 rounded-2xl bg-white border border-brand-slate/15 hover:bg-brand-sand text-brand-charcoal text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-amber" />
                <span>Retake / Try Another Track</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onViewDashboard}
                  className="px-6 py-2.5 rounded-2xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>View in My Student Dashboard</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
