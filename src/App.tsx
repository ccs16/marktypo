import { useState, useEffect, useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import type { DocumentTab, FileItem, EditorSettings } from './types/editor';

import { TipTapEditor } from './components/Editor/TipTapEditor';
import { SourceEditor } from './components/Editor/SourceEditor';
import { FileTree } from './components/FileExplorer/FileTree';
import { DocumentOutline } from './components/Outline/DocumentOutline';
import { TabBar } from './components/TabBar/TabBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { StatusBar } from './components/StatusBar/StatusBar';

import { ExportModal } from './components/Modals/ExportModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { SettingsModal } from './components/Modals/SettingsModal';

import { useFileSystem } from './hooks/useFileSystem';
import { useOutline } from './hooks/useOutline';
import { calculateDocumentStats } from './utils/wordCount';
import { DEFAULT_MARKDOWN } from './utils/defaultDocument';
import { getDemoFileTree, getDemoFileContent } from './utils/demoLibrary';

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'github',
  fontSize: 16,
  lineHeight: 1.75,
  fontFamily: 'system-ui',
  typewriterMode: false,
  focusMode: false,
  autoSave: true,
  autoSaveInterval: 5,
  showLineNumbers: true,
};

export default function App() {
  // Settings & Theme
  const [settings, setSettings] = useState<EditorSettings>(() => {
    const saved = localStorage.getItem('marktypo_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('marktypo_settings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  // Document Tabs
  const [tabs, setTabs] = useState<DocumentTab[]>([
    {
      id: 'tab-welcome',
      title: '欢迎使用 MarkTypo.md',
      content: DEFAULT_MARKDOWN,
      isModified: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-welcome');

  // Sidebar & Layout
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'files' | 'outline'>('files');
  const [isSourceMode, setIsSourceMode] = useState(false);

  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // TipTap Editor instance
  const [editor, setEditor] = useState<Editor | null>(null);

  // File system hook
  const {
    fileTree,
    setFileTree,
    openDirectory,
    openFile,
    readFileContent,
    saveFile,
  } = useFileSystem();

  // Active tab reference
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const activeContent = activeTab ? activeTab.content : '';

  // Stats calculation
  const stats = calculateDocumentStats(activeContent);

  // Outline extraction
  const { outline, activeHeadingId, scrollToHeading } = useOutline(
    editor,
    activeContent,
    isSourceMode
  );

  // Update content of active tab
  const handleContentChange = useCallback((newMarkdown: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, content: newMarkdown, isModified: true }
          : t
      )
    );
  }, [activeTabId]);

  // Save current active document
  const handleSave = useCallback(async (saveAs: boolean = false) => {
    if (!activeTab) return;
    const currentHandle = saveAs ? undefined : activeTab.fileHandle;
    const currentPath = saveAs ? undefined : activeTab.filePath;
    const saveResult = await saveFile(currentHandle, activeTab.content, activeTab.title, currentPath);

    if (saveResult) {
      if (typeof saveResult === 'string') {
        const fileName = saveResult.split(/[/\\]/).pop() || activeTab.title;
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTab.id
              ? { ...t, filePath: saveResult, title: fileName, isModified: false }
              : t
          )
        );
      } else {
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTab.id
              ? { ...t, fileHandle: saveResult, title: saveResult.name, isModified: false }
              : t
          )
        );
      }
    } else {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTab.id ? { ...t, isModified: false } : t))
      );
    }
  }, [activeTab, saveFile]);

  // Update desktop window title
  useEffect(() => {
    if ((window as any).electronAPI?.setTitle && activeTab) {
      (window as any).electronAPI.setTitle(activeTab.title + (activeTab.isModified ? ' ●' : ''));
    }
  }, [activeTab]);

  // Auto-save logic
  const autoSaveTimerRef = useRef<any>(null);
  useEffect(() => {
    if (!settings.autoSave || !activeTab || !activeTab.isModified || (!activeTab.fileHandle && !activeTab.filePath)) {
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      handleSave(false);
    }, settings.autoSaveInterval * 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [activeTab, settings.autoSave, settings.autoSaveInterval, handleSave]);

  // Create new tab
  const handleNewTab = useCallback(() => {
    const newId = `tab-${Date.now()}`;
    const newTab: DocumentTab = {
      id: newId,
      title: '未命名文档.md',
      content: '# 未命名文档\n\n从这里开始书写...',
      isModified: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  }, []);

  // Close tab
  const handleCloseTab = useCallback((tabId: string) => {
    const tabToClose = tabs.find((t) => t.id === tabId);
    if (tabToClose?.isModified) {
      const confirmClose = window.confirm(`文档 "${tabToClose.title}" 尚未保存，确定要关闭吗？`);
      if (!confirmClose) return;
    }

    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId);
      if (filtered.length === 0) {
        const fallbackId = `tab-${Date.now()}`;
        return [
          {
            id: fallbackId,
            title: '未命名文档.md',
            content: '',
            isModified: false,
          },
        ];
      }
      return filtered;
    });

    if (activeTabId === tabId) {
      const remaining = tabs.filter((t) => t.id !== tabId);
      if (remaining.length > 0) {
        setActiveTabId(remaining[remaining.length - 1].id);
      }
    }
  }, [tabs, activeTabId]);

  // Open single file from disk
  const handleOpenFile = useCallback(async () => {
    const fileResult = await openFile();
    if (fileResult) {
      const existingTab = tabs.find((t) => t.fileHandle === fileResult.handle);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return;
      }

      const newId = `tab-${Date.now()}`;
      const newTab: DocumentTab = {
        id: newId,
        title: fileResult.name,
        filePath: fileResult.name,
        fileHandle: fileResult.handle,
        content: fileResult.content,
        isModified: false,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newId);
    }
  }, [openFile, tabs]);

  // Select file from File Explorer
  const handleSelectFileFromTree = useCallback(async (item: FileItem) => {
    if (item.kind !== 'file') return;

    // Check if demo file
    if (!item.handle) {
      const demoContent = getDemoFileContent(item.path);
      const existingTab = tabs.find((t) => t.filePath === item.path);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return;
      }
      const newId = `tab-${Date.now()}`;
      const newTab: DocumentTab = {
        id: newId,
        title: item.name,
        filePath: item.path,
        content: demoContent,
        isModified: false,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newId);
      return;
    }

    // Native file handle
    const fileHandle = item.handle as FileSystemFileHandle;
    const existingTab = tabs.find((t) => t.filePath === item.path || t.fileHandle === fileHandle);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    try {
      const content = await readFileContent(fileHandle);
      const newId = `tab-${Date.now()}`;
      const newTab: DocumentTab = {
        id: newId,
        title: item.name,
        filePath: item.path,
        fileHandle: fileHandle,
        content: content,
        isModified: false,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newId);
    } catch (err) {
      console.error('Error reading file from tree:', err);
    }
  }, [tabs, readFileContent]);

  // Load demo library
  const handleLoadDemoLibrary = () => {
    const demoTree = getDemoFileTree();
    setFileTree(demoTree);
    setShowSidebar(true);
    setSidebarTab('files');
  };

  // Electron Native Menu Listeners
  useEffect(() => {
    const electron = (window as any).electronAPI;
    if (!electron?.on) return;

    const unsubs = [
      electron.on('menu:newTab', () => handleNewTab()),
      electron.on('menu:fileOpened', (fileData: any) => {
        if (!fileData) return;
        const newId = `tab-${Date.now()}`;
        setTabs((prev) => [
          ...prev,
          {
            id: newId,
            title: fileData.name,
            filePath: fileData.filePath,
            content: fileData.content,
            isModified: false,
          },
        ]);
        setActiveTabId(newId);
      }),
      electron.on('menu:directoryOpened', (dirRoot: any) => {
        if (!dirRoot) return;
        setFileTree([dirRoot]);
        setShowSidebar(true);
        setSidebarTab('files');
      }),
      electron.on('menu:save', () => handleSave(false)),
      electron.on('menu:saveAs', () => handleSave(true)),
      electron.on('menu:exportHTML', () => setShowExportModal(true)),
      electron.on('menu:exportPDF', () => setShowExportModal(true)),
      electron.on('menu:toggleSourceMode', () => setIsSourceMode((prev) => !prev)),
      electron.on('menu:toggleFocusMode', () => setSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }))),
      electron.on('menu:toggleTypewriterMode', () => setSettings((prev) => ({ ...prev, typewriterMode: !prev.typewriterMode }))),
      electron.on('menu:showShortcuts', () => setShowShortcutsModal(true)),
      electron.on('menu:showSettings', () => setShowSettingsModal(true)),
      electron.on('menu:format', (data: any) => {
        if (!editor || isSourceMode) return;
        if (data.type === 'bold') editor.chain().focus().toggleBold().run();
        if (data.type === 'italic') editor.chain().focus().toggleItalic().run();
        if (data.type === 'underline') editor.chain().focus().toggleUnderline().run();
        if (data.type === 'strike') editor.chain().focus().toggleStrike().run();
        if (data.type === 'code') editor.chain().focus().toggleCode().run();
        if (data.type === 'heading') editor.chain().focus().toggleHeading({ level: data.level }).run();
        if (data.type === 'paragraph') editor.chain().focus().setParagraph().run();
      }),
      electron.on('menu:insert', (data: any) => {
        if (!editor || isSourceMode) return;
        if (data.type === 'table') editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        if (data.type === 'codeblock') editor.chain().focus().toggleCodeBlock().run();
        if (data.type === 'math') editor.chain().focus().insertContent('```latex\n\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n```').run();
        if (data.type === 'mermaid') editor.chain().focus().insertContent('```mermaid\nflowchart TD\n  A[开始] --> B[完成]\n```').run();
      }),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, [handleNewTab, handleSave, editor, isSourceMode, setFileTree]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl + N (New)
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewTab();
      }
      // Ctrl + O (Open)
      else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFile();
      }
      // Ctrl + Shift + O (Open Folder)
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        openDirectory();
      }
      // Ctrl + / (Toggle Source Mode)
      else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsSourceMode((prev) => !prev);
      }
      // F11 (Focus Mode)
      else if (e.key === 'F11') {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }));
      }
      // Escape (Exit Focus Mode)
      else if (e.key === 'Escape' && settings.focusMode) {
        setSettings((prev) => ({ ...prev, focusMode: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleNewTab, handleOpenFile, openDirectory, settings.focusMode]);

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
      }}
    >
      {/* Top Main Toolbar (Hidden in Focus Mode) */}
      {!settings.focusMode && (
        <Toolbar
          editor={editor}
          isSourceMode={isSourceMode}
          onToggleSourceMode={() => setIsSourceMode(!isSourceMode)}
          onSave={handleSave}
          onNew={handleNewTab}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          sidebarTab={sidebarTab}
          onSetSidebarTab={setSidebarTab}
          theme={settings.theme}
          onThemeChange={(theme) => setSettings((prev) => ({ ...prev, theme }))}
          focusMode={settings.focusMode}
          onToggleFocusMode={() => setSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }))}
          onOpenExportModal={() => setShowExportModal(true)}
          onOpenShortcutsModal={() => setShowShortcutsModal(true)}
          onOpenSettingsModal={() => setShowSettingsModal(true)}
        />
      )}

      {/* Main Workspace Row: Sidebar + TabBar + Editor */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Collapsible Sidebar */}
        {!settings.focusMode && showSidebar && (
          <aside className="sidebar-container w-64 shrink-0 h-full border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 transition-all duration-200">
            {sidebarTab === 'files' ? (
              <FileTree
                tree={fileTree}
                activeFilePath={activeTab?.filePath}
                onSelectFile={handleSelectFileFromTree}
                onOpenDirectory={openDirectory}
                onNewFile={handleNewTab}
                onLoadDemoLibrary={handleLoadDemoLibrary}
              />
            ) : (
              <DocumentOutline
                outline={outline}
                activeHeadingId={activeHeadingId}
                onSelectHeading={scrollToHeading}
              />
            )}
          </aside>
        )}

        {/* Right Editor Pane */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          {/* Tabs Bar */}
          {!settings.focusMode && (
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={setActiveTabId}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
            />
          )}

          {/* Core Editing Canvas */}
          <div className="flex-1 overflow-y-auto relative main-editor-container">
            <div className={`w-full h-full ${isSourceMode ? 'block' : 'hidden'}`}>
              <SourceEditor
                content={activeContent}
                onChange={handleContentChange}
                typewriterMode={settings.typewriterMode}
              />
            </div>
            <div className={`w-full h-full ${!isSourceMode ? 'block' : 'hidden'}`}>
              <TipTapEditor
                content={activeContent}
                onChange={handleContentChange}
                onEditorReady={setEditor}
                typewriterMode={settings.typewriterMode}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Status Bar (Hidden in Focus Mode) */}
      {!settings.focusMode && (
        <StatusBar
          stats={stats}
          isSourceMode={isSourceMode}
          onToggleSourceMode={() => setIsSourceMode(!isSourceMode)}
          typewriterMode={settings.typewriterMode}
          onToggleTypewriterMode={() =>
            setSettings((prev) => ({ ...prev, typewriterMode: !prev.typewriterMode }))
          }
          autoSaveEnabled={settings.autoSave}
          isModified={activeTab?.isModified ?? false}
        />
      )}

      {/* Floating Exit Button in Focus Mode */}
      {settings.focusMode && (
        <button
          onClick={() => setSettings((prev) => ({ ...prev, focusMode: false }))}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-900 text-white text-xs backdrop-blur-xs shadow-lg transition-all"
        >
          退出专注模式 (Esc)
        </button>
      )}

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={activeTab?.title || '文档'}
        markdownContent={activeContent}
        htmlContent={(() => {
          try {
            return editor && !editor.isDestroyed ? editor.getHTML() : '';
          } catch {
            return '';
          }
        })()}
        currentTheme={settings.theme}
      />

      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        onResetSettings={() => setSettings(DEFAULT_SETTINGS)}
      />
    </div>
  );
}
