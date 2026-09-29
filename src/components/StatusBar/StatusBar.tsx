import React from 'react';
import type { DocumentStats } from '../../types/editor';
import {
  FileText,
  Clock,
  Code2,
  Eye,
  AlignLeft,
  CheckCircle2,
} from 'lucide-react';

interface StatusBarProps {
  stats: DocumentStats;
  isSourceMode: boolean;
  onToggleSourceMode: () => void;
  typewriterMode: boolean;
  onToggleTypewriterMode: () => void;
  autoSaveEnabled: boolean;
  isModified: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  isSourceMode,
  onToggleSourceMode,
  typewriterMode,
  onToggleTypewriterMode,
  autoSaveEnabled,
  isModified,
}) => {
  return (
    <div className="statusbar-container h-6 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 select-none font-mono">
      {/* Left: Stats */}
      <div className="flex items-center gap-4">
        {/* Word count */}
        <div className="flex items-center gap-1.5" title="字数与字符统计">
          <FileText className="w-3 h-3 text-slate-400" />
          <span>
            {stats.words.toLocaleString()} 词 / {stats.characters.toLocaleString()} 字符
          </span>
        </div>

        {/* Lines */}
        <div className="flex items-center gap-1" title="总行数">
          <AlignLeft className="w-3 h-3 text-slate-400" />
          <span>{stats.lines} 行</span>
        </div>

        {/* Reading time */}
        <div className="flex items-center gap-1" title="预计阅读时间">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>约 {stats.readingTimeMinutes} 分钟</span>
        </div>
      </div>

      {/* Right: State & Switches */}
      <div className="flex items-center gap-3">
        {/* Auto-save status */}
        <div className="flex items-center gap-1">
          {isModified ? (
            <span className="text-amber-500">● 待保存</span>
          ) : (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>{autoSaveEnabled ? '已自动保存' : '已就绪'}</span>
            </div>
          )}
        </div>

        <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700" />

        {/* Typewriter mode toggle */}
        <button
          onClick={onToggleTypewriterMode}
          className={`hover:text-blue-500 transition-colors ${
            typewriterMode ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
          }`}
          title="切换打字机模式 (光标垂直居中)"
        >
          打字机模式: {typewriterMode ? '开' : '关'}
        </button>

        <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700" />

        {/* Encoding */}
        <span>UTF-8</span>

        <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700" />

        {/* Mode Toggle Button */}
        <button
          onClick={onToggleSourceMode}
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
          title="点击切换编辑模式 (Ctrl+/)"
        >
          {isSourceMode ? (
            <>
              <Code2 className="w-3 h-3 text-amber-500" />
              <span className="text-amber-500 font-semibold">源码模式</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 text-blue-500" />
              <span>所见即所得</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
