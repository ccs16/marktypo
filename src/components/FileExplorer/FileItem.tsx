import React, { useState } from 'react';
import type { FileItem as FileItemType } from '../../types/editor';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
} from 'lucide-react';

interface FileItemProps {
  item: FileItemType;
  depth?: number;
  activeFilePath?: string;
  onSelectFile: (item: FileItemType) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  item,
  depth = 0,
  activeFilePath,
  onSelectFile,
}) => {
  const [isExpanded, setIsExpanded] = useState(item.isExpanded ?? false);

  const isDirectory = item.kind === 'directory';
  const isActive = !isDirectory && activeFilePath === item.path;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(item);
    }
  };

  return (
    <div className="select-none text-xs">
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        className={`flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer transition-colors ${
          isActive
            ? 'bg-blue-600 text-white font-medium shadow-sm'
            : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
        }`}
      >
        {isDirectory ? (
          <>
            <span className="text-slate-400">
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
            <span className={isActive ? 'text-white' : 'text-amber-500'}>
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5" />
              ) : (
                <Folder className="w-3.5 h-3.5" />
              )}
            </span>
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <span className={isActive ? 'text-white' : 'text-blue-500'}>
              {item.name.endsWith('.md') ? (
                <FileText className="w-3.5 h-3.5" />
              ) : (
                <FileCode className="w-3.5 h-3.5" />
              )}
            </span>
          </>
        )}

        <span className="truncate flex-1" title={item.name}>
          {item.name}
        </span>
      </div>

      {isDirectory && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileItem
              key={child.id}
              item={child}
              depth={depth + 1}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};
