import React, { useState } from 'react';
import type { FileItem as FileItemType } from '../../types/editor';
import { FileItem } from './FileItem';
import {
  FolderOpen,
  FilePlus,
  Search,
  BookOpen,
} from 'lucide-react';

interface FileTreeProps {
  tree: FileItemType[];
  activeFilePath?: string;
  onSelectFile: (item: FileItemType) => void;
  onOpenDirectory: () => void;
  onNewFile: () => void;
  onLoadDemoLibrary?: () => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  tree,
  activeFilePath,
  onSelectFile,
  onOpenDirectory,
  onNewFile,
  onLoadDemoLibrary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items recursively by search query
  const filterTree = (items: FileItemType[]): FileItemType[] => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();

    return items.reduce<FileItemType[]>((acc, item) => {
      if (item.kind === 'file') {
        if (item.name.toLowerCase().includes(query)) {
          acc.push(item);
        }
      } else if (item.kind === 'directory' && item.children) {
        const filteredChildren = filterTree(item.children);
        if (filteredChildren.length > 0 || item.name.toLowerCase().includes(query)) {
          acc.push({
            ...item,
            children: filteredChildren,
            isExpanded: true,
          });
        }
      }
      return acc;
    }, []);
  };

  const displayedTree = filterTree(tree);

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      {/* File Tree Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          工作区目录
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenDirectory}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="打开本地文件夹"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewFile}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="新建文件"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 focus-within:border-blue-500">
          <Search className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto p-1">
        {displayedTree.length > 0 ? (
          displayedTree.map((item) => (
            <FileItem
              key={item.id}
              item={item}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
            />
          ))
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3 mt-6">
            <FolderOpen className="w-8 h-8 text-slate-400 opacity-60" />
            <p>尚未加载任何本地文件夹</p>
            <button
              onClick={onOpenDirectory}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors shadow-sm"
            >
              打开本地文件夹
            </button>
            {onLoadDemoLibrary && (
              <button
                onClick={onLoadDemoLibrary}
                className="w-full py-1.5 px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>载入示例工作区</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
