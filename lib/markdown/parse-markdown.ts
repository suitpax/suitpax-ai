import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export function markdownToHtml(mdText: string) {
  return md.render(mdText);
}