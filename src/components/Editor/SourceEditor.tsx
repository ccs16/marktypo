import React, { useRef, useEffect, useState } from 'react';

interface SourceEditorProps {
  content: string;
  onChange: (value: string) => void;
  typewriterMode?: boolean;
}

export const SourceEditor: React.FC<SourceEditorProps> = ({
  content,
  onChange,
  typewriterMode = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = content.split('\n').length;
    setLineCount(Math.max(1, lines));
  }, [content]);

  // Sync scroll between textarea and line number gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Support Tab key indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden font-mono text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Line Numbers Gutter */}
      <div
        ref={gutterRef}
        className="w-14 py-8 select-none text-right pr-3 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 font-mono text-xs leading-6"
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Raw Markdown Textarea */}
      <div className="flex-1 h-full overflow-hidden relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder="在此编辑原生 Markdown 源码..."
          spellCheck={false}
          className="source-editor-textarea w-full h-full p-8 leading-6 bg-transparent resize-none outline-none overflow-y-auto whitespace-pre font-mono text-sm selection:bg-blue-200 dark:selection:bg-blue-800"
          style={{
            paddingBottom: typewriterMode ? '50vh' : '20vh',
          }}
        />
      </div>
    </div>
  );
};
