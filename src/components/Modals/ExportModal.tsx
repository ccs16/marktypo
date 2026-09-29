import React, { useState } from 'react';
import { X, FileCode, Printer, FileDown, Copy, Check } from 'lucide-react';
import { exportAsHTML, exportAsPDF, exportAsMarkdown } from '../../utils/exportHelper';
import type { EditorTheme } from '../../types/editor';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  markdownContent: string;
  htmlContent: string;
  currentTheme: EditorTheme;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  markdownContent,
  htmlContent,
  currentTheme,
}) => {
  const [copiedType, setCopiedType] = useState<'md' | 'html' | null>(null);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedType('md');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopiedType('html');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-base">导出文档</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            选择导出格式，所有样式均会完整保留并自包含：
          </p>

          {/* Export to Standalone HTML */}
          <div
            onClick={() => {
              exportAsHTML(title, htmlContent, currentTheme);
              onClose();
            }}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  导出为自包含 HTML 网页
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  内置完整排版与公式样式，离线直接双击即可阅读分享
                </p>
              </div>
            </div>
          </div>

          {/* Export / Print PDF */}
          <div
            onClick={() => {
              onClose();
              setTimeout(() => exportAsPDF(title), 200);
            }}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  打印或保存为 PDF 文档
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  调用系统打印引擎，专为 A4 排版优化，无杂乱边框
                </p>
              </div>
            </div>
          </div>

          {/* Export Markdown */}
          <div
            onClick={() => {
              exportAsMarkdown(title, markdownContent);
              onClose();
            }}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  导出为 Markdown (.md) 文件
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  原汁原味的标准 GFM Markdown 纯文本
                </p>
              </div>
            </div>
          </div>

          {/* Quick Copy Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              {copiedType === 'md' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">已复制 Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制 Markdown 源码</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyHtml}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              {copiedType === 'html' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">已复制 HTML</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制 HTML 内容</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
