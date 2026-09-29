export function exportAsMarkdown(filename: string, content: string): void {
  const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsHTML(title: string, contentHtml: string, theme: string = 'github'): void {
  const safeTitle = title.replace(/\.md$/, '');
  const isDark = theme === 'night' || theme === 'nord';

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/${isDark ? 'github-dark' : 'github'}.min.css">
  <style>
    :root {
      --bg-primary: ${isDark ? '#0f172a' : '#ffffff'};
      --text-primary: ${isDark ? '#f1f5f9' : '#1e293b'};
      --border-color: ${isDark ? '#334155' : '#e2e8f0'};
      --code-bg: ${isDark ? '#1e293b' : '#f1f5f9'};
      --accent-color: #2563eb;
    }
    body {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.75;
      padding: 40px 20px;
      margin: 0;
    }
    .markdown-body {
      max-width: 860px;
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 {
      color: var(--text-primary);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 2.2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h2 { font-size: 1.7em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.2em; }
    h3 { font-size: 1.35em; }
    blockquote {
      border-left: 4px solid var(--accent-color);
      padding: 0.5em 1em;
      margin: 1em 0;
      background-color: var(--code-bg);
      border-radius: 0 6px 6px 0;
      color: #64748b;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.2em 0;
    }
    th, td {
      border: 1px solid var(--border-color);
      padding: 8px 12px;
      text-align: left;
    }
    th { background-color: var(--code-bg); }
    code:not(pre code) {
      background-color: var(--code-bg);
      color: #e11d48;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }
    pre {
      background: #1e293b !important;
      color: #f8fafc !important;
      padding: 16px !important;
      border-radius: 8px !important;
      overflow-x: auto !important;
    }
    ul[data-type="taskList"] {
      list-style: none;
      padding-left: 0;
    }
    ul[data-type="taskList"] li {
      display: flex;
      align-items: center;
      margin: 4px 0;
    }
    ul[data-type="taskList"] li label {
      margin-right: 8px;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 1em 0;
    }
    hr {
      border: none;
      border-top: 2px solid var(--border-color);
      margin: 2em 0;
    }
    @media print {
      body { padding: 0; background: #fff !important; color: #000 !important; }
      .markdown-body { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${contentHtml}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsPDF(title: string): void {
  const originalTitle = document.title;
  document.title = title.replace(/\.md$/, '');
  window.print();
  document.title = originalTitle;
}
