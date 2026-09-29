import React from 'react';
import { X, Settings, RotateCcw } from 'lucide-react';
import type { EditorSettings } from '../../types/editor';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-base">偏好设置</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-200">编辑器排版主题</span>
              <p className="text-[11px] text-slate-400">选择视觉风格与护眼色彩方案</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => onUpdateSettings({ theme: e.target.value as any })}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs outline-none"
            >
              <option value="github">Github 经典浅色</option>
              <option value="night">Night 极夜深色</option>
              <option value="sepia">Sepia 羊皮纸暖色</option>
              <option value="nord">Nord 极光北欧风</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-200">字号大小</span>
              <p className="text-[11px] text-slate-400">正文字符显示基准大小</p>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs outline-none"
            >
              <option value="14">14px (精细)</option>
              <option value="15">15px (舒适)</option>
              <option value="16">16px (标准推荐)</option>
              <option value="18">18px (清晰大字)</option>
              <option value="20">20px (特大)</option>
            </select>
          </div>

          {/* Line Height */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-200">行间距倍数</span>
              <p className="text-[11px] text-slate-400">舒适的段落行间距有助于沉浸阅读</p>
            </div>
            <select
              value={settings.lineHeight}
              onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs outline-none"
            >
              <option value="1.5">1.5 倍 (紧凑)</option>
              <option value="1.75">1.75 倍 (标准)</option>
              <option value="2.0">2.0 倍 (宽松)</option>
            </select>
          </div>

          {/* Typewriter mode */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-200">打字机居中模式</span>
              <p className="text-[11px] text-slate-400">使当前输入所在行始终保持在屏幕垂直居中</p>
            </div>
            <input
              type="checkbox"
              checked={settings.typewriterMode}
              onChange={(e) => onUpdateSettings({ typewriterMode: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-200">自动保存 (Auto-save)</span>
              <p className="text-[11px] text-slate-400">定时自动将编辑变动同步回本地文件</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => onUpdateSettings({ autoSave: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {settings.autoSave && (
            <div className="flex items-center justify-between pl-3 border-l-2 border-blue-500">
              <span className="text-slate-600 dark:text-slate-300">自动保存间隔</span>
              <select
                value={settings.autoSaveInterval}
                onChange={(e) => onUpdateSettings({ autoSaveInterval: Number(e.target.value) })}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs outline-none"
              >
                <option value="2">2 秒</option>
                <option value="5">5 秒 (推荐)</option>
                <option value="10">10 秒</option>
              </select>
            </div>
          )}

          {/* Reset button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onResetSettings}
              className="flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复默认设置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
