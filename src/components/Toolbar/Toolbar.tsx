import React from 'react';
import type { Editor } from '@tiptap/react';
import type { EditorTheme } from '../../types/editor';
import {
  FolderTree,
  ListTree,
  Save,
  FilePlus,
  Code2,
  Eye,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Table as TableIcon,
  Sigma,
  GitBranch,
  Image as ImageIcon,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  Download,
  HelpCircle,
  Settings,
  Palette,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  isSourceMode: boolean;
  onToggleSourceMode: () => void;
  onSave: () => void;
  onNew: () => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  sidebarTab: 'files' | 'outline';
  onSetSidebarTab: (tab: 'files' | 'outline') => void;
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenExportModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  isSourceMode,
  onToggleSourceMode,
  onSave,
  onNew,
  showSidebar,
  onToggleSidebar,
  sidebarTab,
  onSetSidebarTab,
  theme,
  onThemeChange,
  focusMode,
  onToggleFocusMode,
  onOpenExportModal,
  onOpenShortcutsModal,
  onOpenSettingsModal,
}) => {
  // Helper to insert markdown code in source mode or TipTap in wysiwyg mode
  const insertContent = (wysiwygAction: () => void, _sourceSnippet?: string) => {
    if (!isSourceMode && editor) {
      wysiwygAction();
    }
  };

  return (
    <div className="toolbar-container h-11 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between gap-2 select-none z-20">
      {/* Left Section: Sidebar & File Management */}
      <div className="flex items-center gap-1">
        {/* Sidebar Toggles */}
        <button
          onClick={() => {
            if (!showSidebar) {
              onToggleSidebar();
              onSetSidebarTab('files');
            } else if (sidebarTab === 'files') {
              onToggleSidebar();
            } else {
              onSetSidebarTab('files');
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            showSidebar && sidebarTab === 'files'
              ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          title="切换文件目录边栏"
        >
          <FolderTree className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (!showSidebar) {
              onToggleSidebar();
              onSetSidebarTab('outline');
            } else if (sidebarTab === 'outline') {
              onToggleSidebar();
            } else {
              onSetSidebarTab('outline');
            }
          }}
          className={`p-1.5 rounded transition-colors ${
            showSidebar && sidebarTab === 'outline'
              ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          title="切换大纲目录边栏"
        >
          <ListTree className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* New File */}
        <button
          onClick={onNew}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="新建文档 (Ctrl+N)"
        >
          <FilePlus className="w-4 h-4" />
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="保存文档 (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* WYSIWYG / Source Mode Toggle */}
        <button
          onClick={onToggleSourceMode}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            isSourceMode
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900'
          }`}
          title="切换 所见即所得 / 源码模式 (Ctrl+/)"
        >
          {isSourceMode ? (
            <>
              <Code2 className="w-3.5 h-3.5" />
              <span>源码模式</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>所见即所得</span>
            </>
          )}
        </button>
      </div>

      {/* Middle Section: Rich Text Formatting (Disabled in Source Mode) */}
      <div className={`flex items-center gap-0.5 overflow-x-auto ${isSourceMode ? 'opacity-30 pointer-events-none' : ''}`}>
        {/* Headings */}
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (editor) {
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                // @ts-ignore
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }
          }}
          value={
            editor?.isActive('heading', { level: 1 })
              ? '1'
              : editor?.isActive('heading', { level: 2 })
              ? '2'
              : editor?.isActive('heading', { level: 3 })
              ? '3'
              : editor?.isActive('heading', { level: 4 })
              ? '4'
              : '0'
          }
          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded px-2 py-1 border border-slate-200 dark:border-slate-700 outline-none mr-1"
        >
          <option value="0">正文段落</option>
          <option value="1">一级标题 H1</option>
          <option value="2">二级标题 H2</option>
          <option value="3">三级标题 H3</option>
          <option value="4">四级标题 H4</option>
        </select>

        {/* Basic Inlines */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('bold') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="粗体 (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('italic') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="斜体 (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('underline') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="下划线 (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('strike') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="删除线 (Ctrl+Shift+X)"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('highlight') ? 'bg-yellow-500 text-black' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="高亮标注"
        >
          <Highlighter className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('code') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="行内代码"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Lists & Quotes */}
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('bulletList') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="无序列表"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('orderedList') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="有序列表"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('taskList') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="任务清单"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive('blockquote') ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="引用块"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="水平分割线"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Advanced Blocks: Table, Math, Mermaid, Image, Link */}
        <button
          onClick={() =>
            insertContent(() =>
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            )
          }
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="插入表格 (Ctrl+T)"
        >
          <TableIcon className="w-3.5 h-3.5 text-blue-500" />
        </button>

        <button
          onClick={() =>
            insertContent(() =>
              editor
                ?.chain()
                .focus()
                .insertContent('```latex\n\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n```')
                .run()
            )
          }
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="插入 LaTeX 数学公式"
        >
          <Sigma className="w-3.5 h-3.5 text-purple-500" />
        </button>

        <button
          onClick={() =>
            insertContent(() =>
              editor
                ?.chain()
                .focus()
                .insertContent('```mermaid\nflowchart TD\n  A[开始] --> B[处理中]\n  B --> C[完成]\n```')
                .run()
            )
          }
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="插入 Mermaid 图表"
        >
          <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
        </button>

        <button
          onClick={() => {
            const url = window.prompt('请输入图片 URL:');
            if (url && editor) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="插入图片 (支持直接粘贴截图或拖拽图片)"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            const url = window.prompt('请输入链接地址:');
            if (url && editor) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="插入超链接 (Ctrl+K)"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Section: Focus, Themes, Export & Settings */}
      <div className="flex items-center gap-1.5">
        {/* Theme Selector Dropdown */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-xs">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as EditorTheme)}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            title="选择编辑器主题"
          >
            <option value="github">Github 浅色</option>
            <option value="night">Night 极夜</option>
            <option value="sepia">Sepia 羊皮纸</option>
            <option value="nord">Nord 极光</option>
          </select>
        </div>

        {/* Focus Mode Toggle */}
        <button
          onClick={onToggleFocusMode}
          className={`p-1.5 rounded transition-colors ${
            focusMode
              ? 'bg-blue-600 text-white'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          title="专注模式 (F11)"
        >
          {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors shadow-xs"
          title="导出文档 (HTML / PDF / Markdown)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出</span>
        </button>

        {/* Shortcuts Cheat Sheet */}
        <button
          onClick={onOpenShortcutsModal}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="快捷键速查"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettingsModal}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="偏好设置"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
