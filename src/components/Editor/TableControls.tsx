import React from 'react';
import type { Editor } from '@tiptap/react';
import {
  Rows,
  Columns,
  Trash2,
  Plus,
  Minus,
  Heading,
} from 'lucide-react';

interface TableControlsProps {
  editor: Editor | null;
}

export const TableControls: React.FC<TableControlsProps> = ({ editor }) => {
  if (!editor || !editor.isActive('table')) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg text-xs z-20">
      <span className="px-2 font-medium text-slate-500 dark:text-slate-400 select-none">表格:</span>

      {/* Row Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1">
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          title="在上方插入行"
        >
          <div className="flex items-center">
            <Rows className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 text-blue-500" />
          </div>
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          title="在下方插入行"
        >
          <div className="flex items-center">
            <Rows className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 text-green-500" />
          </div>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 rounded"
          title="删除当前行"
        >
          <div className="flex items-center">
            <Rows className="w-3.5 h-3.5" />
            <Minus className="w-2.5 h-2.5" />
          </div>
        </button>
      </div>

      {/* Column Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1">
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          title="在左侧插入列"
        >
          <div className="flex items-center">
            <Columns className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 text-blue-500" />
          </div>
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          title="在右侧插入列"
        >
          <div className="flex items-center">
            <Columns className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 text-green-500" />
          </div>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 rounded"
          title="删除当前列"
        >
          <div className="flex items-center">
            <Columns className="w-3.5 h-3.5" />
            <Minus className="w-2.5 h-2.5" />
          </div>
        </button>
      </div>

      {/* Header Row Toggle */}
      <button
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        className="px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1"
        title="切换标题行样式"
      >
        <Heading className="w-3.5 h-3.5" />
        <span>表头</span>
      </button>

      {/* Delete Table */}
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="px-1.5 py-1 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 rounded flex items-center gap-1 ml-1"
        title="删除整个表格"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>删除表格</span>
      </button>
    </div>
  );
};
