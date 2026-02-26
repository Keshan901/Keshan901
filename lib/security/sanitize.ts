import sanitizeHtml from "sanitize-html";

export function sanitizeMarkdownToHtml(markdown: string) {
  return sanitizeHtml(markdown, {
    allowedTags: ["h1", "h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "blockquote", "code", "pre"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
  });
}
