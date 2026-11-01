import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('css', scss);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('text', plaintext);

/** Returns highlighted HTML for `code`. Unknown languages are escaped as plain text. */
export function highlight(code: string, language?: string): string {
  const lang = language && hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
}
