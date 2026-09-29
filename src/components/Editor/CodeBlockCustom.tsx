import React, { useState, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Copy, Check, Eye, Code2, Trash2 } from 'lucide-react';
import { renderMermaidDiagram } from '../../utils/mermaidHelper';
import katex from 'katex';

const POPULAR_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'bash',
  'sql',
  'cpp',
  'java',
  'rust',
  'go',
  'mermaid',
  'latex',
  'markdown',
];

export const CodeBlockCustom: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const language = node.attrs.language || 'text';
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(language === 'mermaid' || language === 'latex' || language === 'math');
  const [mermaidSvg, setMermaidSvg] = useState<string>('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [katexHtml, setKatexHtml] = useState<string>('');
  const [katexError, setKatexError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const rawCode = node.textContent;

  // Render Mermaid diagram
  useEffect(() => {
    if (language === 'mermaid' && showPreview) {
      if (!rawCode.trim()) {
        setMermaidSvg('');
        setMermaidError(null);
        return;
      }
      renderMermaidDiagram(node.attrs.id || 'codeblock', rawCode)
        .then((svg) => {
          setMermaidSvg(svg);
          setMermaidError(null);
        })
        .catch((err) => {
          setMermaidError(err.message || 'Mermaid 图表解析错误');
        });
    }
  }, [language, rawCode, showPreview, node.attrs.id]);

  // Render KaTeX math
  useEffect(() => {
    if ((language === 'latex' || language === 'math') && showPreview) {
      if (!rawCode.trim()) {
        setKatexHtml('');
        setKatexError(null);
        return;
      }
      try {
        const html = katex.renderToString(rawCode, {
          displayMode: true,
          throwOnError: false,
        });
        setKatexHtml(html);
        setKatexError(null);
      } catch (err: any) {
        setKatexError(err.message || 'LaTeX 公式解析失败');
      }
    }
  }, [language, rawCode, showPreview]);

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSpecialRenderable = language === 'mermaid' || language === 'latex' || language === 'math';

  return (
    <NodeViewWrapper className="my-5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 shadow-md overflow-hidden relative group">
      {/* Code Header Bar */}
      <div
        contentEditable={false}
        className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 select-none"
      >
        <div className="flex items-center space-x-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              updateAttributes({ language: newLang });
              if (newLang === 'mermaid' || newLang === 'latex' || newLang === 'math') {
                setShowPreview(true);
              }
            }}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono outline-none focus:border-blue-500"
          >
            <option value="text">纯文本 (Text)</option>
            {POPULAR_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Toggle Preview Button for Mermaid / LaTeX */}
          {isSpecialRenderable && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-xs transition-colors ${
                showPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={showPreview ? '切换到源码编辑' : '切换到图形预览'}
            >
              {showPreview ? (
                <>
                  <Code2 className="w-3.5 h-3.5" />
                  <span>编辑源码</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>渲染预览</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="复制代码"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制</span>
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={deleteNode}
            className="p-1 rounded hover:bg-red-900/50 hover:text-red-300 text-slate-500 transition-colors"
            title="删除代码块"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mermaid Render View */}
      {language === 'mermaid' && showPreview && (
        <div
          contentEditable={false}
          className="p-6 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center min-h-[120px] overflow-x-auto"
        >
          {mermaidError ? (
            <div className="text-red-500 text-xs font-mono p-3 bg-red-50 dark:bg-red-950/50 rounded border border-red-200 dark:border-red-900 w-full text-center">
              ⚠️ {mermaidError}
            </div>
          ) : mermaidSvg ? (
            <div
              ref={previewRef}
              className="w-full flex justify-center [&>svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: mermaidSvg }}
            />
          ) : (
            <div className="text-slate-400 text-xs italic">输入 Mermaid 代码以生成图表...</div>
          )}
        </div>
      )}

      {/* LaTeX Render View */}
      {(language === 'latex' || language === 'math') && showPreview && (
        <div
          contentEditable={false}
          className="p-6 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center min-h-[80px] overflow-x-auto"
        >
          {katexError ? (
            <div className="text-red-500 text-xs font-mono p-3 bg-red-50 dark:bg-red-950/50 rounded border border-red-200 dark:border-red-900 w-full text-center">
              ⚠️ {katexError}
            </div>
          ) : katexHtml ? (
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: katexHtml }}
            />
          ) : (
            <div className="text-slate-400 text-xs italic">输入 LaTeX 公式语法以渲染...</div>
          )}
        </div>
      )}

      {/* Code Text Editing Area (Hidden when special preview is active) */}
      <pre
        className={`p-4 font-mono text-sm leading-relaxed overflow-x-auto m-0 !bg-transparent ${
          isSpecialRenderable && showPreview ? 'hidden' : 'block'
        }`}
      >
        <NodeViewContent />
      </pre>
    </NodeViewWrapper>
  );
};
