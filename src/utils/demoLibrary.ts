import type { FileItem } from '../types/editor';
import { DEFAULT_MARKDOWN } from './defaultDocument';

export const DEMO_MATH_MARKDOWN = `# 数学公式与物理推导笔记 🔬

本文档展示 **MarkTypo** 中使用 LaTeX 与 KaTeX 渲染的高精度复杂数学与物理公式。

---

## 1. 经典力学与狭义相对论

在经典力学中，动能公式为：

$$
E_k = \\frac{1}{2} m v^2
$$

爱因斯坦质能等价关系式：

$$
E = mc^2 = \\frac{m_0 c^2}{\\sqrt{1 - \\frac{v^2}{c^2}}}
$$

---

## 2. 微积分与多重积分

高斯积分公式：

$$
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

多元微积分中的格林公式：

$$
\\oint_{L} (P dx + Q dy) = \\iint_{D} \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dx dy
$$

---

## 3. 线性代数与矩阵

特征值与特征向量方程：

$$
\\mathbf{A} \\mathbf{x} = \\lambda \\mathbf{x}
$$

行列式计算：

$$
\\det(\\mathbf{A}) = \\begin{vmatrix}
a & b \\\\
c & d
\\end{vmatrix} = ad - bc
$$

> 💡 **提示**：直接在正文中键入 \`$$ 公式 $$\` 或使用顶部工具栏中的【∑】按钮即可插入公式！
`;

export const DEMO_DIAGRAM_MARKDOWN = `# 现代系统架构与 Mermaid 图表 📊

本文档演示如何使用 **Mermaid** 纯文本代码在 MarkTypo 中实时绘制专业级矢量图表。

---

## 1. 用户认证与授权流程时序图

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as 用户
    participant App as 前端应用 (MarkTypo)
    participant Auth as 鉴权服务
    participant DB as 本地存储

    User->>App: 打开应用与本地工作区
    App->>Auth: 校验本地文件读取权限
    Auth-->>App: 权限校验通过
    App->>DB: 读取目标 .md 文件内容
    DB-->>App: 返回 Markdown 纯文本流
    App->>User: 所见即所得实时渲染文档
\`\`\`

---

## 2. 状态机流转图 (State Diagram)

\`\`\`mermaid
stateDiagram-v2
    [*] --> 未修改
    未修改 --> 编辑中 : 用户键入内容
    编辑中 --> 自动保存中 : 触发定时器
    自动保存中 --> 未修改 : 写入本地文件成功
    编辑中 --> 手动保存 : 按下 Ctrl + S
    手动保存 --> 未修改 : 保存成功
\`\`\`

---

## 3. 系统微服务拓扑图

\`\`\`mermaid
flowchart TD
    Client[客户端界面] --> EditorCore[TipTap 编辑核心]
    EditorCore --> Parser[Markdown 解析器]
    EditorCore --> MathEngine[KaTeX 引擎]
    EditorCore --> DiagramEngine[Mermaid 引擎]
    EditorCore --> Storage[本地文件系统]
\`\`\`
`;

export const DEMO_TASKS_MARKDOWN = `# 每日工作清单与规划 📝

### 🎯 今日核心攻坚任务
- [x] 完成 MarkTypo 编辑器核心功能开发
- [x] 验证 LaTeX 数学公式渲染精度
- [x] 验证 Mermaid 流程图与时序图绘制
- [ ] 导出文档为 PDF 打印版并归档
- [ ] 分享给团队进行体验反馈

---

### 📅 本周里程碑排期

| 项目模块 | 负责人 | 预期完成时间 | 状态 |
| :--- | :--- | :--- | :--- |
| 所见即所得编辑引擎 | DeepMind Assistant | 2026-09-29 | 🟢 已完成 |
| 本地文件与大纲导航 | DeepMind Assistant | 2026-09-29 | 🟢 已完成 |
| HTML / PDF 导出系统 | DeepMind Assistant | 2026-09-29 | 🟢 已完成 |
| 主题与偏好定制中心 | DeepMind Assistant | 2026-09-29 | 🟢 已完成 |
`;

export function getDemoFileTree(): FileItem[] {
  return [
    {
      id: 'demo-root',
      name: 'MarkTypo 示例知识库',
      path: 'MarkTypo 示例知识库',
      kind: 'directory',
      isExpanded: true,
      children: [
        {
          id: 'demo-welcome',
          name: '欢迎使用 MarkTypo.md',
          path: 'MarkTypo 示例知识库/欢迎使用 MarkTypo.md',
          kind: 'file',
        },
        {
          id: 'demo-math-dir',
          name: '学术推导',
          path: 'MarkTypo 示例知识库/学术推导',
          kind: 'directory',
          isExpanded: true,
          children: [
            {
              id: 'demo-math',
              name: '数学公式与物理推导.md',
              path: 'MarkTypo 示例知识库/学术推导/数学公式与物理推导.md',
              kind: 'file',
            },
          ],
        },
        {
          id: 'demo-diagram-dir',
          name: '技术架构',
          path: 'MarkTypo 示例知识库/技术架构',
          kind: 'directory',
          isExpanded: true,
          children: [
            {
              id: 'demo-diagram',
              name: '系统时序图与流程图.md',
              path: 'MarkTypo 示例知识库/技术架构/系统时序图与流程图.md',
              kind: 'file',
            },
          ],
        },
        {
          id: 'demo-tasks',
          name: '每日工作清单.md',
          path: 'MarkTypo 示例知识库/每日工作清单.md',
          kind: 'file',
        },
      ],
    },
  ];
}

export function getDemoFileContent(path: string): string {
  if (path.includes('欢迎使用 MarkTypo.md')) return DEFAULT_MARKDOWN;
  if (path.includes('数学公式与物理推导.md')) return DEMO_MATH_MARKDOWN;
  if (path.includes('系统时序图与流程图.md')) return DEMO_DIAGRAM_MARKDOWN;
  if (path.includes('每日工作清单.md')) return DEMO_TASKS_MARKDOWN;
  return DEFAULT_MARKDOWN;
}
