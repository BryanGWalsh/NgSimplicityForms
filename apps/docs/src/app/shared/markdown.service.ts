import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Marked, Renderer, Tokens } from 'marked';
import { Observable, map, shareReplay } from 'rxjs';
import { highlight } from './highlight';

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/** A rendered page is a sequence of HTML chunks and embedded live demos. */
export type DocSegment = { kind: 'html'; html: string } | { kind: 'demo'; id: string };

export interface RenderedDoc {
  title: string;
  segments: DocSegment[];
  toc: TocEntry[];
}

const DEMO_MARKER = /^::: demo ([\w-]+)\s*$/gm;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<RenderedDoc>>();

  load(file: string): Observable<RenderedDoc> {
    let doc$ = this.cache.get(file);
    if (!doc$) {
      doc$ = this.http.get(`content/${file}`, { responseType: 'text' }).pipe(
        map((source) => this.render(source)),
        shareReplay(1)
      );
      this.cache.set(file, doc$);
    }
    return doc$;
  }

  /** Renders a Markdown fragment (doc comments, for example) to HTML without demos or a table of contents. */
  renderFragment(source: string, inline = false): string {
    const doc = this.render(inline ? source.replace(/\n/g, ' ') : source);
    const html = doc.segments.map((s) => (s.kind === 'html' ? s.html : '')).join('');
    return inline ? html.replace(/^<p>|<\/p>\s*$/g, '') : html;
  }

  render(source: string): RenderedDoc {
    const toc: TocEntry[] = [];
    const used = new Map<string, number>();
    let title = '';

    const renderer = new Renderer();
    renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
      const html = this.parser.parseInline(tokens);
      const text = html.replace(/<[^>]+>/g, '');
      if (depth === 1) {
        title ||= text;
        return `<h1>${html}</h1>`;
      }
      let id = slugify(text);
      const count = used.get(id) ?? 0;
      used.set(id, count + 1);
      if (count) id = `${id}-${count}`;
      if (depth <= 3) toc.push({ id, text, level: depth });
      return `<h${depth} id="${id}"><a class="docs-anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${html}</h${depth}>`;
    };
    renderer.code = ({ text, lang }: Tokens.Code) => {
      const [language, ...flags] = (lang ?? '').split(/\s+/);
      const titleFlag = flags.find((f) => f.startsWith('title='));
      const fileTitle = titleFlag ? titleFlag.slice('title='.length) : '';
      return `<div class="docs-code">${
        fileTitle ? `<div class="docs-code-title">${escapeHtml(fileTitle)}</div>` : ''
      }<button type="button" class="docs-copy" data-copy aria-label="Copy code"><i class="bi bi-clipboard" aria-hidden="true"></i></button><pre><code class="hljs language-${escapeHtml(language || 'plaintext')}">${highlight(text, language)}</code></pre></div>`;
    };
    renderer.table = function (token: Tokens.Table) {
      const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
      const body = token.rows
        .map((row) => `<tr>${row.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`)
        .join('');
      return `<div class="table-responsive"><table class="table table-sm docs-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
    };
    renderer.blockquote = function ({ tokens }: Tokens.Blockquote) {
      // "> **Note**" / "> **Warning**" / "> **Tip**" become callouts.
      const html = this.parser.parse(tokens);
      const kind = /^<p><strong>(Note|Tip|Warning|Important)<\/strong>/.exec(html)?.[1]?.toLowerCase() ?? 'note';
      return `<div class="docs-callout docs-callout-${kind}">${html}</div>`;
    };

    const marked = new Marked({ renderer, gfm: true });
    const segments: DocSegment[] = [];
    let last = 0;
    for (const match of source.matchAll(DEMO_MARKER)) {
      const before = source.slice(last, match.index);
      if (before.trim()) segments.push({ kind: 'html', html: marked.parse(before) as string });
      segments.push({ kind: 'demo', id: match[1] });
      last = (match.index ?? 0) + match[0].length;
    }
    const rest = source.slice(last);
    if (rest.trim()) segments.push({ kind: 'html', html: marked.parse(rest) as string });
    return { title, segments, toc };
  }
}
