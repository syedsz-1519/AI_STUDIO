import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Award, 
  TrendingUp, 
  Video, 
  FileText, 
  Volume2, 
  FileSpreadsheet, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Tag, 
  Eye, 
  Mic, 
  Edit3,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

interface HistoricalInterviewTableProps {
  records: MockInterviewRecord[];
  onOpenReportModal: (record: MockInterviewRecord) => void;
  onOpenAudioReplay: (record: MockInterviewRecord) => void;
  onOpenReflectionModal: (record: MockInterviewRecord) => void;
  onExportCsv: (record: MockInterviewRecord) => void;
  onOpenComparison?: (record: MockInterviewRecord) => void;
}

type SortField = 'date' | 'score' | 'difficulty' | 'role';
type SortOrder = 'asc' | 'desc';

export default function HistoricalInterviewTable({
  records,
  onOpenReportModal,
  onOpenAudioReplay,
  onOpenReflectionModal,
  onExportCsv,
  onOpenComparison
}: HistoricalInterviewTableProps) {
  const { lang } = useLanguage();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    audioEngine.playLoFiChord();
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const difficultyWeight: Record<string, number> = {
    'Beginner': 1,
    'Mid-Level': 2,
    'Senior': 3,
    'Staff': 4
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = (a.timestamp || 0) - (b.timestamp || 0);
      } else if (sortField === 'score') {
        comparison = (a.overallScore || 0) - (b.overallScore || 0);
      } else if (sortField === 'difficulty') {
        comparison = (difficultyWeight[a.difficulty] || 2) - (difficultyWeight[b.difficulty] || 2);
      } else if (sortField === 'role') {
        comparison = a.roleTrack.localeCompare(b.roleTrack);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [records, sortField, sortOrder]);

  if (records.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-brand-sand/20 border border-dashed border-brand-slate/20 text-center space-y-2">
        <Video className="w-7 h-7 text-brand-muted mx-auto" />
        <p className="text-xs text-brand-muted">
          No mock interview records available to display in historical table yet.
        </p>
      </div>
    );
  }

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-brand-muted/60 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-brand-amber ml-1 inline" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-brand-amber ml-1 inline" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-brand-slate/15 bg-white shadow-2xs">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-brand-sand/30 border-b border-brand-slate/15 text-[11px] font-mono text-brand-slate font-bold uppercase tracking-wider">
              <th 
                onClick={() => handleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Date & Time</span>
                {renderSortIndicator('date')}
              </th>
              <th 
                onClick={() => handleSort('role')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Role Track & Persona</span>
                {renderSortIndicator('role')}
              </th>
              <th 
                onClick={() => handleSort('difficulty')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Difficulty Level</span>
                {renderSortIndicator('difficulty')}
              </th>
              <th 
                onClick={() => handleSort('score')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Overall Score</span>
                {renderSortIndicator('score')}
              </th>
              <th className="py-3 px-4 select-none">
                <span>Hiring Bar</span>
              </th>
              <th className="py-3 px-4 select-none hidden md:table-cell">
                <span>Tone & Reflections</span>
              </th>
              <th className="py-3 px-4 text-right select-none">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-brand-slate/10">
            {sortedRecords.map((rec) => {
              const hasReflections = Boolean(rec.personalReflections || rec.personalNotes);
              const tone = rec.speechSentimentReport?.dominantTone || 'Analytical';

              return (
                <tr 
                  key={rec.id}
                  className="hover:bg-brand-sand/15 transition-colors group"
                >
                  {/* Date Column */}
                  <td className="py-3.5 px-4 font-mono text-[11.5px] text-brand-charcoal whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                      <span>{rec.dateStr}</span>
                    </div>
                  </td>

                  {/* Role Track Column */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-display font-bold text-brand-charcoal text-xs sm:text-[13px]">
                        {rec.roleTrack}
                      </div>
                      <div className="text-[10px] font-mono text-brand-muted flex items-center gap-1">
                        <span>Interviewer: {rec.interviewerName}</span>
                        <span>•</span>
                        <span>{Math.round(rec.durationSeconds / 60)} mins</span>
                      </div>
                    </div>
                  </td>

                  {/* Difficulty Level Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                      rec.difficulty === 'Staff' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                      rec.difficulty === 'Senior' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                      rec.difficulty === 'Mid-Level' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {rec.difficulty || 'Mid-Level'}
                    </span>
                  </td>

                  {/* Overall Score Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-display font-black text-sm ${
                        rec.overallScore >= 85 ? 'text-emerald-700' :
                        rec.overallScore >= 70 ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {rec.overallScore}%
                      </span>
                      {/* Mini Bar */}
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${
                            rec.overallScore >= 85 ? 'bg-emerald-500' :
                            rec.overallScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, rec.overallScore)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Hiring Bar Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      rec.hiringDecision === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                      rec.hiringDecision === 'Hire' ? 'bg-teal-100 text-teal-800' :
                      rec.hiringDecision === 'Leaning Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rec.hiringDecision}
                    </span>
                  </td>

                  {/* Spoken Tone & Reflection Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                        {tone.split(' ')[0]}
                      </span>

                      {hasReflections ? (
                        <button
                          onClick={() => onOpenReflectionModal(rec)}
                          className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 cursor-pointer"
                          title="View personal notes and reflections"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Notes</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenReflectionModal(rec)}
                          className="flex items-center gap-1 text-[10px] font-mono text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/40 px-2 py-0.5 rounded border border-dashed border-brand-slate/20 cursor-pointer"
                          title="Add personal reflection notes"
                        >
                          <Edit3 className="w-3 h-3 text-brand-slate" />
                          <span>+ Note</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenReportModal(rec)}
                        className="px-2.5 py-1 rounded-lg bg-brand-charcoal text-white hover:bg-black font-bold text-[10.5px] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="View Full Scorecard Report"
                      >
                        <FileText className="w-3 h-3 text-brand-amber" />
                        <span className="hidden sm:inline">Scorecard</span>
                      </button>

                      <button
                        onClick={() => onOpenAudioReplay(rec)}
                        className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-brand-sand/40 text-brand-charcoal transition-all cursor-pointer"
                        title="Play Spoken Audio Replay & Transcript"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      <button
                        onClick={() => onOpenReflectionModal(rec)}
                        className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-brand-sand/40 text-brand-charcoal transition-all cursor-pointer"
                        title="Add/Edit Personal Reflection Notes"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                      </button>

                      {onOpenComparison && (
                        <button
                          onClick={() => onOpenComparison(rec)}
                          className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-amber-50 text-brand-amber-dark transition-all cursor-pointer"
                          title="Compare with another session"
                        >
                          <BarChart2 className="w-3.5 h-3.5 text-brand-amber" />
                        </button>
                      )}

                      <button
                        onClick={() => onExportCsv(rec)}
                        className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-emerald-50 text-emerald-700 transition-all cursor-pointer"
                        title="Export Session Metrics (CSV)"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-brand-sand/20 border-t border-brand-slate/15 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-brand-muted">
        <span>Showing <strong>{sortedRecords.length}</strong> mock interview sessions</span>
        <div className="flex items-center gap-3">
          <span>Sort by clicking column headers</span>
          <span>•</span>
          <span className="text-emerald-700 font-bold">Passing Bar: ≥85%</span>
        </div>
      </div>
    </div>
  );
}
