export type EditorTheme = 'github' | 'night' | 'sepia' | 'nord';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  kind: 'file' | 'directory';
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: FileItem[];
  isExpanded?: boolean;
}

export interface DocumentTab {
  id: string;
  title: string;
  filePath?: string;
  fileHandle?: FileSystemFileHandle;
  content: string;
  isModified: boolean;
  historyState?: any;
}

export interface OutlineItem {
  id: string;
  level: number;
  text: string;
  pos: number;
}

export interface DocumentStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  readingTimeMinutes: number;
}

export interface EditorSettings {
  theme: EditorTheme;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  typewriterMode: boolean;
  focusMode: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  showLineNumbers: boolean;
}
