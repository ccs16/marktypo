const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function getInitialFile() {
  // Check if a file was passed as argument (e.g. via double click or command line)
  const args = process.argv.slice(app.isPackaged ? 1 : 2);
  for (const arg of args) {
    if (arg && !arg.startsWith('--') && fs.existsSync(arg) && fs.statSync(arg).isFile()) {
      return {
        filePath: path.resolve(arg),
        name: path.basename(arg),
        content: fs.readFileSync(arg, 'utf-8'),
      };
    }
  }
  return null;
}

function createMenu() {
  const template = [
    {
      label: '文件 (F)',
      submenu: [
        {
          label: '新建文档',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu:newTab'),
        },
        {
          label: '打开文件...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const res = await handleOpenFile();
            if (res) mainWindow?.webContents.send('menu:fileOpened', res);
          },
        },
        {
          label: '打开文件夹...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: async () => {
            const dir = await handleOpenDirectory();
            if (dir) mainWindow?.webContents.send('menu:directoryOpened', dir);
          },
        },
        { type: 'separator' },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:save'),
        },
        {
          label: '另存为...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu:saveAs'),
        },
        { type: 'separator' },
        {
          label: '导出为 HTML',
          click: () => mainWindow?.webContents.send('menu:exportHTML'),
        },
        {
          label: '导出为 PDF',
          click: () => mainWindow?.webContents.send('menu:exportPDF'),
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'Alt+F4',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: '编辑 (E)',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: '段落 (P)',
      submenu: [
        {
          label: '一级标题 (H1)',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'heading', level: 1 }),
        },
        {
          label: '二级标题 (H2)',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'heading', level: 2 }),
        },
        {
          label: '三级标题 (H3)',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'heading', level: 3 }),
        },
        {
          label: '普通正文',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'paragraph' }),
        },
        { type: 'separator' },
        {
          label: '插入表格 (3x3)',
          accelerator: 'CmdOrCtrl+T',
          click: () => mainWindow?.webContents.send('menu:insert', { type: 'table' }),
        },
        {
          label: '插入代码块',
          click: () => mainWindow?.webContents.send('menu:insert', { type: 'codeblock' }),
        },
        {
          label: '插入数学公式块',
          click: () => mainWindow?.webContents.send('menu:insert', { type: 'math' }),
        },
        {
          label: '插入 Mermaid 图表',
          click: () => mainWindow?.webContents.send('menu:insert', { type: 'mermaid' }),
        },
      ],
    },
    {
      label: '格式 (M)',
      submenu: [
        {
          label: '加粗',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'bold' }),
        },
        {
          label: '斜体',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'italic' }),
        },
        {
          label: '下划线',
          accelerator: 'CmdOrCtrl+U',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'underline' }),
        },
        {
          label: '删除线',
          accelerator: 'CmdOrCtrl+Shift+X',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'strike' }),
        },
        {
          label: '行内代码',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'code' }),
        },
        {
          label: '插入超链接',
          accelerator: 'CmdOrCtrl+K',
          click: () => mainWindow?.webContents.send('menu:format', { type: 'link' }),
        },
      ],
    },
    {
      label: '视图 (V)',
      submenu: [
        {
          label: '切换 源码 / 所见即所得模式',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow?.webContents.send('menu:toggleSourceMode'),
        },
        {
          label: '全屏专注模式',
          accelerator: 'F11',
          click: () => mainWindow?.webContents.send('menu:toggleFocusMode'),
        },
        {
          label: '打字机模式',
          click: () => mainWindow?.webContents.send('menu:toggleTypewriterMode'),
        },
        { type: 'separator' },
        { label: '重新加载窗口', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '切换开发者工具', accelerator: 'F12', role: 'toggleDevTools' },
      ],
    },
    {
      label: '帮助 (H)',
      submenu: [
        {
          label: '快捷键与排版指南',
          click: () => mainWindow?.webContents.send('menu:showShortcuts'),
        },
        {
          label: '偏好设置',
          click: () => mainWindow?.webContents.send('menu:showSettings'),
        },
        { type: 'separator' },
        {
          label: '关于 MarkTypo',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 MarkTypo',
              message: 'MarkTypo - 本地极简高颜值 Markdown 编辑器',
              detail: '版本: 1.0.0 (免费开源自用)\n所见即所得 · 本地文件工作区 · LaTeX · Mermaid · 离线私密',
              buttons: ['确定'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function handleOpenFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown 文档 (*.md, *.markdown, *.txt)', extensions: ['md', 'markdown', 'txt'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const content = fs.readFileSync(filePath, 'utf-8');
  return {
    filePath,
    name: path.basename(filePath),
    content,
  };
}

async function handleOpenDirectory() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const dirPath = result.filePaths[0];
  return scanDirectoryRecursively(dirPath, dirPath);
}

function scanDirectoryRecursively(dirPath, rootPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(rootPath, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      items.push({
        id: relPath,
        name: entry.name,
        path: fullPath,
        kind: 'directory',
        children: scanDirectoryRecursively(fullPath, rootPath),
        isExpanded: false,
      });
    } else if (entry.isFile() && /\.(md|markdown|txt)$/i.test(entry.name)) {
      items.push({
        id: relPath,
        name: entry.name,
        path: fullPath,
        kind: 'file',
      });
    }
  }

  items.sort((a, b) => {
    if (a.kind === b.kind) return a.name.localeCompare(b.name, 'zh-CN');
    return a.kind === 'directory' ? -1 : 1;
  });

  return {
    id: path.basename(dirPath),
    name: path.basename(dirPath),
    path: dirPath,
    kind: 'directory',
    children: items,
    isExpanded: true,
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 850,
    minHeight: 600,
    title: 'MarkTypo - 本地 Markdown 编辑器',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  createMenu();

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Check if initial file was passed
    const initialFile = getInitialFile();
    if (initialFile) {
      mainWindow.webContents.send('menu:fileOpened', initialFile);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('dialog:openFile', handleOpenFile);
ipcMain.handle('dialog:openDirectory', handleOpenDirectory);

ipcMain.handle('file:read', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return null;
  }
});

ipcMain.handle('file:save', async (event, { filePath, content, suggestedName = '未命名文档.md' }) => {
  try {
    let targetPath = filePath;
    if (!targetPath) {
      const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: suggestedName,
        filters: [{ name: 'Markdown 文档 (*.md)', extensions: ['md'] }],
      });
      if (result.canceled || !result.filePath) return null;
      targetPath = result.filePath;
    }

    fs.writeFileSync(targetPath, content, 'utf-8');
    return {
      success: true,
      filePath: targetPath,
      name: path.basename(targetPath),
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('app:setTitle', (event, title) => {
  if (mainWindow) {
    mainWindow.setTitle(`${title} - MarkTypo`);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
