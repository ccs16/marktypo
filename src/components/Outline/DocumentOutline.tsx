import React from 'react';
import type { OutlineItem } from '../../types/editor';
import { ListTree, Hash } from 'lucide-react';

interface DocumentOutlineProps {
  outline: OutlineItem[];
  activeHeadingId?: string;
  onSelectHeading: (item: OutlineItem) => void;
}

export const DocumentOutline: React.FC<DocumentOutlineProps> = ({
  outline,
  activeHeadingId,
  onSelectHeading,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      {/* Outline Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ListTree className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            文档大纲
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
          {outline.length} 个节点
        </span>
      </div>

      {/* Outline Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {outline.length > 0 ? (
          outline.map((item) => {
            const isActive = activeHeadingId === item.id;
            const indentPadding = (item.level - 1) * 12;

            return (
              <div
                key={item.id}
                onClick={() => onSelectHeading(item)}
                style={{ paddingLeft: `${indentPadding + 6}px` }}
                className={`group flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer text-xs transition-colors truncate ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title={item.text}
              >
                <span
                  className={`text-[10px] font-mono shrink-0 ${
                    isActive ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-500'
                  }`}
                >
                  H{item.level}
                </span>
                <span className="truncate">{item.text}</span>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2 mt-8">
            <Hash className="w-6 h-6 opacity-40" />
            <p>暂无标题大纲</p>
            <p className="text-[11px] leading-relaxed">
              在正文中键入 <span className="font-mono text-blue-500"># 标题</span> 即可自动生成层级大纲
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
