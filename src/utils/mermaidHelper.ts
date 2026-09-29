import mermaid from 'mermaid';

let initialized = false;

export function initMermaid(theme: 'default' | 'dark' | 'neutral' | 'forest' = 'default') {
  mermaid.initialize({
    startOnLoad: false,
    theme: theme,
    securityLevel: 'loose',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });
  initialized = true;
}

export async function renderMermaidDiagram(id: string, code: string): Promise<string> {
  if (!initialized) {
    initMermaid();
  }

  try {
    const cleanCode = code.trim();
    if (!cleanCode) return '';
    // Generate a unique ID for each render to avoid SVG id clashes
    const uniqueId = `mermaid-${id}-${Math.random().toString(36).substring(2, 9)}`;
    const { svg } = await mermaid.render(uniqueId, cleanCode);
    return svg;
  } catch (error) {
    console.error('Mermaid render error:', error);
    throw error;
  }
}
