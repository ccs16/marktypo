import { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import type { OutlineItem } from '../types/editor';

export function useOutline(editor: Editor | null, sourceMarkdown?: string, isSourceMode?: boolean) {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  useEffect(() => {
    if (isSourceMode && sourceMarkdown) {
      // Parse markdown headings via regex
      const items: OutlineItem[] = [];
      const lines = sourceMarkdown.split('\n');
      let pos = 0;

      lines.forEach((line, index) => {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].trim();
          items.push({
            id: `heading-source-${index}`,
            level,
            text,
            pos: pos,
          });
        }
        pos += line.length + 1;
      });

      setOutline(items);
      return;
    }

    if (!editor) return;

    const extractHeadings = () => {
      const items: OutlineItem[] = [];
      let index = 0;

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const level = node.attrs.level || 1;
          const text = node.textContent;
          if (text.trim()) {
            items.push({
              id: `heading-${index++}-${pos}`,
              level,
              text,
              pos,
            });
          }
        }
      });

      setOutline(items);
    };

    extractHeadings();

    editor.on('update', extractHeadings);
    return () => {
      editor.off('update', extractHeadings);
    };
  }, [editor, sourceMarkdown, isSourceMode]);

  // Scroll to heading
  const scrollToHeading = (item: OutlineItem) => {
    setActiveHeadingId(item.id);

    if (isSourceMode) {
      // In source mode, find corresponding text in source editor
      const textarea = document.querySelector('.source-editor-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(item.pos, item.pos + item.text.length + 4);
        const lineHeight = 24;
        const lineIndex = textarea.value.substring(0, item.pos).split('\n').length;
        textarea.scrollTop = Math.max(0, (lineIndex - 5) * lineHeight);
      }
      return;
    }

    if (!editor) return;

    // Scroll in TipTap
    const { view } = editor;
    const dom = view.nodeDOM(item.pos) as HTMLElement;
    if (dom && dom.scrollIntoView) {
      dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
      dom.classList.add('bg-blue-100', 'dark:bg-blue-900', 'transition-colors', 'duration-500');
      setTimeout(() => {
        dom.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'transition-colors', 'duration-500');
      }, 1000);
    }
  };

  return {
    outline,
    activeHeadingId,
    scrollToHeading,
  };
}
