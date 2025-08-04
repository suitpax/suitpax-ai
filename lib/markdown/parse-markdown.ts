import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,          // Permite etiquetas HTML en el Markdown
  linkify: true,       // Convierte URLs en links automáticamente
  typographer: true,   // Habilita algunas mejoras tipográficas
});

export function renderMarkdown(markdownText: string): string {
  return md.render(markdownText);
}