import React, { useEffect } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown';

import { CodeBlockCustom } from './CodeBlockCustom';
import { BubbleToolbar } from './BubbleToolbar';
import { TableControls } from './TableControls';

// Custom CodeBlock with interactive NodeView
const CustomCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockCustom);
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  onEditorReady?: (editor: any) => void;
  typewriterMode?: boolean;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  onEditorReady,
  typewriterMode = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Replaced by CustomCodeBlock
        link: false,
        underline: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      CustomCodeBlock,
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        linkify: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: '从这里开始书写，或键入 # 创建标题、键入 - 创建列表、键入 | 创建表格...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // @ts-ignore
      const markdown = editor.storage.markdown.getMarkdown();
      onChange(markdown);

      if (typewriterMode) {
        // Keep active cursor centered
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          const element = selection.anchorNode.parentElement;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px]',
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result as string;
                if (src) {
                  const node = view.state.schema.nodes.image.create({ src });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              };
              reader.readAsDataURL(file);
              return true; // handled
            }
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files || []);
        if (files.length > 0 && files[0].type.startsWith('image/')) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target?.result as string;
            if (src) {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coordinates) {
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            }
          };
          reader.readAsDataURL(file);
          return true;
        }
        return false;
      },
    },
  });

  // Notify parent of editor instance
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Synchronize external content changes when switching tabs
  const prevContentRef = React.useRef(content);
  useEffect(() => {
    if (editor && content !== prevContentRef.current) {
      // @ts-ignore
      const currentMarkdown = editor.storage.markdown.getMarkdown();
      if (currentMarkdown !== content) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
      prevContentRef.current = content;
    }
  }, [content, editor]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Floating Bubble Toolbar */}
      <BubbleToolbar editor={editor} />

      {/* Floating Table Toolbar */}
      {editor && editor.isActive('table') && (
        <div className="sticky top-2 z-30 self-center mb-2">
          <TableControls editor={editor} />
        </div>
      )}

      {/* Editor Content Canvas */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-8 md:px-16 py-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
