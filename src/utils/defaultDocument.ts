export const DEFAULT_MARKDOWN = `# 欢迎使用 MarkTypo 编辑器 🖋️

> **MarkTypo** 是一款完全免费、轻量且优雅的 **Typora 风格**本地 Markdown 所见即所得编辑器。专为沉浸式写作、技术笔记与学术研究打造。

---

## 🌟 核心特性体验

1. **真·所见即所得**：输入 Markdown 语法后自动就地渲染，光标在位可直接编辑。
2. **毫秒级双模切换**：按下 \`Ctrl + /\` 可即刻在 **所见即所得 (WYSIWYG)** 与 **源码模式 (Source Mode)** 间无缝切换。
3. **本地工作区与多标签**：支持直接打开本地文件夹、大纲目录秒级跳转、多文档协同编辑。
4. **一键优雅导出**：支持导出独立离线 HTML 网页或排版精良的 PDF 文档。

---

## 📐 丰富排版样式测试

### 1. 文本装饰
你可以在这里自由使用 **加粗文本**、*斜体文字*、~~删除线文本~~、\`行内代码\` 以及 ==高亮重点标注==。

### 2. 交互式待办清单 (Task List)
- [x] 完成 MarkTypo 编辑器核心架构设计
- [x] 实现 Typora 风格所见即所得双向无缝转换
- [x] 支持 GFM 表格可视化交互操作
- [x] 支持 LaTeX / KaTeX 数学公式渲染
- [ ] 导出排版精良的 PDF / HTML 文件并分享给朋友

### 3. 可视化交互表格 (Table)

| 方案对比 | MarkTypo | 传统双栏编辑器 | 重型笔记软件 |
| :--- | :--- | :--- | :--- |
| **编辑体验** | 真·所见即所得，单视线无干扰 | 双栏割裂，视线来回跳跃 | 侧重网状双链，排版较重 |
| **收费情况** | **100% 永久免费 / 个人自用** | 部分收费 | 商业版或插件收费 |
| **本地隐私** | 本地离线存储，数据完全属于你 | 取决于云同步配置 | 强制云端同步或账户绑定 |
| **启动速度** | 极速秒开 (< 0.5s) | 较快 | 较慢 (1~3s) |

---

## 🔬 学术级数学公式 (LaTeX / KaTeX)

支持行内数学公式，例如质能方程 $E = mc^2$，以及勾股定理 $a^2 + b^2 = c^2$。

同时也支持高精度的多行独立块级数学公式：

$$
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}
$$

---

## 💻 语法高亮代码块 (Code Block)

支持主流编程语言语法高亮、代码一键复制与行号展示：

\`\`\`typescript
interface UserConfig {
  theme: 'github' | 'night' | 'sepia';
  typewriterMode: boolean;
  autoSaveInterval: number;
}

// 快速初始化 MarkTypo 编辑器实例
export function initEditor(config: UserConfig): void {
  console.log("MarkTypo Editor initialized successfully! 🚀", config);
}
\`\`\`

---

## 📊 Mermaid 图表原生渲染

内置 Mermaid 图表渲染引擎，支持流程图、时序图等纯文本图表绘制：

\`\`\`mermaid
flowchart LR
    A[本地 Markdown 文件] --> B(MarkTypo 解析引擎)
    B --> C{所见即所得渲染}
    C --> D[LaTeX 数学公式]
    C --> E[可视化交互表格]
    C --> F[Mermaid 矢量图表]
    B --> G[导出 HTML / PDF]
\`\`\`

---

## ⌨️ 常用快捷键速查

| 快捷键 | 对应动作 |
| :--- | :--- |
| **\`Ctrl + /\`** | 切换 所见即所得 / 源码模式 |
| **\`Ctrl + S\`** | 保存当前文件 |
| **\`Ctrl + N\`** | 新建空白文档 |
| **\`Ctrl + O\`** | 打开本地文件 |
| **\`Ctrl + 1 ~ 6\`** | 设为 1 ~ 6 级标题 |
| **\`Ctrl + B\`** | 粗体文字 |
| **\`Ctrl + I\`** | 斜体文字 |
| **\`Ctrl + T\`** | 插入 3x3 交互表格 |
| **\`F11\`** | 沉浸专注模式 (Focus Mode) |

> 💡 **提示**：点击左上角【打开文件夹】即可载入本地工作区；点击左侧【大纲】即可随时查看文章目录并一键锚点跳转！
`;
