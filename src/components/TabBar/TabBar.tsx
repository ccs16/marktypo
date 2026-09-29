import React from 'react';
import type { DocumentTab } from '../../types/editor';
import { FileText, X, Plus } from 'lucide-react';

interface TabBarProps {
  tabs: DocumentTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  return (
    <div className="tabbar-container flex items-center h-9 bg-slate-200/80 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800 px-2 overflow-x-auto select-none">
      {/* Tab List */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 h-7.5 rounded-t text-xs cursor-pointer transition-all border-t-2 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-blue-600 font-medium shadow-xs'
                  : 'bg-transparent hover:bg-slate-300/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-transparent'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
              
              <span className="truncate max-w-[140px]" title={tab.title}>
                {tab.title}
              </span>

              {/* Unsaved indicator dot */}
              {tab.isModified && (
                <span
                  className="w-2 h-2 rounded-full bg-blue-500 shrink-0"
                  title="未保存修改"
                />
              )}

              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-1"
                  title="关闭标签页"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* New Tab Button */}
      <button
        onClick={onNewTab}
        className="p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors ml-1 shrink-0"
        title="新建空白文档 (Ctrl+N)"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
