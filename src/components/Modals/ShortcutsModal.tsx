import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    title: '常用文件与视图',
    items: [
      { key: 'Ctrl + /', desc: '切换 所见即所得 / 源码模式' },
      { key: 'Ctrl + S', desc: '保存当前文件' },
      { key: 'Ctrl + N', desc: '新建空白文档' },
      { key: 'Ctrl + O', desc: '打开本地单文件' },
      { key: 'F11', desc: '全屏专注模式 (隐藏所有干扰元素)' },
    ],
  },
  {
    title: '文本排版与格式',
    items: [
      { key: 'Ctrl + B', desc: '粗体 (**文本**)' },
      { key: 'Ctrl + I', desc: '斜体 (*文本*)' },
      { key: 'Ctrl + U', desc: '下划线' },
      { key: 'Ctrl + Shift + X', desc: '删除线 (~~文本~~)' },
      { key: 'Ctrl + K', desc: '插入超链接' },
      { key: 'Tab', desc: '列表缩进 / 源码模式缩进 2 空格' },
    ],
  },
  {
    title: '标题与结构',
    items: [
      { key: 'Ctrl + 1', desc: '一级标题 (# H1)' },
      { key: 'Ctrl + 2', desc: '二级标题 (## H2)' },
      { key: 'Ctrl + 3', desc: '三级标题 (### H3)' },
      { key: 'Ctrl + 4 ~ 6', desc: '四至六级标题' },
      { key: 'Ctrl + 0', desc: '恢复为正文段落' },
    ],
  },
  {
    title: '高级块级元素',
    items: [
      { key: 'Ctrl + T', desc: '插入 3x3 交互表格' },
      { key: '```mermaid', desc: '插入 Mermaid 流程图/时序图代码块' },
      { key: '```latex / $$', desc: '插入 LaTeX / KaTeX 数学公式块' },
      { key: '- [ ]', desc: '创建可交互任务清单' },
      { key: '拖拽/粘贴图片', desc: '直接将截图或图片拖入/粘贴进编辑器' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-base">键盘快捷键与高效排版指南</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {SHORTCUT_GROUPS.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                  >
                    <span className="text-slate-600 dark:text-slate-300 truncate mr-2">
                      {item.desc}
                    </span>
                    <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold shrink-0 shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
