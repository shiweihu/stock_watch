'use client'
import { marked, Tokens } from 'marked';
//import DOMPurify from 'dompurify';






marked.use({
    renderer: {
        link(token: Tokens.Link) {
        const href = token.href ?? '#';
        const titleAttr = token.title ? ` title="${token.title}"` : '';
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" ${titleAttr}>${token.text}</a>`;
        }
    }
});



// 4. 导出渲染函数
export async function renderMarkdown(markdown: string) {
  const rawHtml = await marked.parse(markdown);
  //return DOMPurify.sanitize(rawHtml);
  return rawHtml
}