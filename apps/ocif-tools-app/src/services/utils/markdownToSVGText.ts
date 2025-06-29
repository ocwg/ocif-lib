import { marked } from "marked";
export function renderMarkdownToSVGText(markdown: string, width?: number, height?: number): string {
  const html = marked.parse(markdown) ;
  const htmlToString = typeof html === 'string' ? html : '';

  return `

  <foreignObject x="0" y="0" width="${width ?? 100}" height="${height ?? 100}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="
         font-family: sans-serif;
         font-size: 16px;
         color: #222;
         padding: 1em;
    ">
      ${htmlToString}
    </div>
  </foreignObject>

  `.trim();
}

