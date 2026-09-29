import { useState, useCallback } from 'react';
import type { FileItem } from '../types/editor';

const IGNORED_DIRS = new Set(['.git', 'node_modules', '.vscode', 'dist', 'build', '.idea']);

export function useFileSystem() {
  const isDesktop = typeof window !== 'undefined' && Boolean((window as any).electronAPI?.isDesktop);
  const [rootDirectoryHandle, setRootDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const isWebFSSupported = typeof window !== 'undefined' && 'showOpenFilePicker' in window;
  const isSupported = isDesktop || isWebFSSupported;

  // Recursively read directory handle in Web mode
  const readDirectory = useCallback(async (
    dirHandle: FileSystemDirectoryHandle,
    parentPath: string = ''
  ): Promise<FileItem[]> => {
    const items: FileItem[] = [];

    // @ts-ignore - directory iteration
    for await (const entry of dirHandle.values()) {
      if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }

      const itemPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;

      if (entry.kind === 'directory') {
        const children = await readDirectory(entry, itemPath);
        items.push({
          id: itemPath,
          name: entry.name,
          path: itemPath,
          kind: 'directory',
          handle: entry,
          children: children,
          isExpanded: false,
        });
      } else if (entry.kind === 'file') {
        const isMarkdown = /\.(md|markdown|txt)$/i.test(entry.name);
        if (isMarkdown) {
          items.push({
            id: itemPath,
            name: entry.name,
            path: itemPath,
            kind: 'file',
            handle: entry,
          });
        }
      }
    }

    return items.sort((a, b) => {
      if (a.kind === b.kind) {
        return a.name.localeCompare(b.name, 'zh-CN');
      }
      return a.kind === 'directory' ? -1 : 1;
    });
  }, []);

  // Open directory (Electron or Web)
  const openDirectory = useCallback(async (): Promise<FileItem[]> => {
    if (isDesktop) {
      const dirRoot = await (window as any).electronAPI.openDirectory();
      if (dirRoot) {
        setFileTree([dirRoot]);
        return [dirRoot];
      }
      return [];
    }

    if (!isWebFSSupported) {
      alert('您的浏览器不支持原生文件系统访问，请使用最新版 Chrome、Edge 或运行 MarkTypo 桌面版客户端。');
      return [];
    }

    try {
      // @ts-ignore
      const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();
      setRootDirectoryHandle(dirHandle);
      const tree = await readDirectory(dirHandle, dirHandle.name);
      const rootItem: FileItem = {
        id: dirHandle.name,
        name: dirHandle.name,
        path: dirHandle.name,
        kind: 'directory',
        handle: dirHandle,
        children: tree,
        isExpanded: true,
      };
      setFileTree([rootItem]);
      return [rootItem];
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error opening directory:', err);
      }
      return [];
    }
  }, [isDesktop, isWebFSSupported, readDirectory]);

  // Open single file (Electron or Web)
  const openFile = useCallback(async (): Promise<{ name: string; content: string; filePath?: string; handle?: FileSystemFileHandle } | null> => {
    if (isDesktop) {
      const res = await (window as any).electronAPI.openFile();
      if (res) {
        return { name: res.name, content: res.content, filePath: res.filePath };
      }
      return null;
    }

    if (!isWebFSSupported) {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown,.txt';
        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const file = input.files[0];
            const content = await file.text();
            resolve({ name: file.name, content });
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }

    try {
      // @ts-ignore
      const [fileHandle]: [FileSystemFileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Markdown 文件 (*.md, *.markdown)',
            accept: {
              'text/markdown': ['.md', '.markdown'],
              'text/plain': ['.txt'],
            },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const content = await file.text();
      return { name: file.name, content, handle: fileHandle, filePath: file.name };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error opening file:', err);
      }
      return null;
    }
  }, [isDesktop, isWebFSSupported]);

  // Read content from FileSystemFileHandle or path
  const readFileContent = useCallback(async (fileHandleOrPath: FileSystemFileHandle | string): Promise<string> => {
    if (typeof fileHandleOrPath === 'string') {
      if (isDesktop) {
        const text = await (window as any).electronAPI.readFile(fileHandleOrPath);
        return text || '';
      }
      return '';
    }
    const file = await fileHandleOrPath.getFile();
    return await file.text();
  }, [isDesktop]);

  // Save file (Electron or Web)
  const saveFile = useCallback(
    async (
      fileHandle: FileSystemFileHandle | undefined,
      content: string,
      suggestedName: string = 'Untitled.md',
      filePath?: string
    ): Promise<FileSystemFileHandle | string | null> => {
      try {
        if (isDesktop) {
          const res = await (window as any).electronAPI.saveFile({
            filePath,
            content,
            suggestedName,
          });
          if (res?.success) {
            return res.filePath;
          }
          return null;
        }

        let handle = fileHandle;
        if (!handle) {
          if (!isWebFSSupported) {
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = suggestedName;
            a.click();
            URL.revokeObjectURL(url);
            return null;
          }

          // @ts-ignore
          handle = await window.showSaveFilePicker({
            suggestedName: suggestedName.endsWith('.md') ? suggestedName : `${suggestedName}.md`,
            types: [
              {
                description: 'Markdown 文件',
                accept: { 'text/markdown': ['.md'] },
              },
            ],
          });
        }

        if (handle) {
          // @ts-ignore
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          return handle;
        }
        return null;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error saving file:', err);
        }
        return null;
      }
    },
    [isDesktop, isWebFSSupported]
  );

  return {
    isDesktop,
    isSupported,
    fileTree,
    setFileTree,
    rootDirectoryHandle,
    openDirectory,
    openFile,
    readFileContent,
    saveFile,
  };
}
