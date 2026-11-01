import { ChangeDetectionStrategy, Component, computed, inject, input, resource, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { DEMOS } from '../demos/demo-registry';
import { highlight } from './highlight';
import { handleCopyClick } from './copy';

const REPO_DEMOS = 'https://github.com/BryanGWalsh/NgSimplicityForms/blob/main/apps/docs/src/app/demos/';

/**
 * Shows a live demo with tabs for its source files. The source shown is the exact file that runs in the preview:
 * the build copies the demo .ts files to /demo-src.
 */
@Component({
  selector: 'docs-demo',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-demo', '(click)': 'onClick($event)' },
  template: `
    @if (demo(); as d) {
      <div class="docs-demo-header">
        <span class="docs-demo-title"><i class="bi bi-play-circle" aria-hidden="true"></i> {{ d.title }}</span>
        <span class="badge docs-theme-badge docs-theme-{{ d.theme }}">{{ themeLabel() }}</span>
      </div>
      <div class="docs-demo-tabs" role="tablist" aria-label="Demo views">
        <button type="button" role="tab" [attr.aria-selected]="tab() === 'preview'" [class.active]="tab() === 'preview'" (click)="tab.set('preview')">
          <i class="bi bi-eye" aria-hidden="true"></i> Preview
        </button>
        @for (file of d.files; track file) {
          <button type="button" role="tab" [attr.aria-selected]="tab() === file" [class.active]="tab() === file" (click)="tab.set(file)">
            <i class="bi bi-file-earmark-code" aria-hidden="true"></i> {{ fileName(file) }}
          </button>
        }
        <a class="docs-demo-gh ms-auto" [href]="repoUrl + d.files[0]" target="_blank" rel="noopener">
          <i class="bi bi-github" aria-hidden="true"></i><span class="d-none d-sm-inline"> View on GitHub</span>
        </a>
      </div>
      <div class="docs-demo-body" [hidden]="tab() !== 'preview'" role="tabpanel">
        @if (component.value(); as cmp) {
          <ng-container *ngComponentOutlet="cmp"></ng-container>
        } @else if (component.error()) {
          <div class="alert alert-danger mb-0">The demo failed to load.</div>
        } @else {
          <div class="text-body-secondary small">Loading demo…</div>
        }
      </div>
      @if (tab() !== 'preview') {
        <div class="docs-demo-code docs-code" role="tabpanel">
          <button type="button" class="docs-copy" data-copy aria-label="Copy code"><i class="bi bi-clipboard" aria-hidden="true"></i></button>
          @if (source.value(); as html) {
            <pre><code class="hljs language-typescript" [innerHTML]="html"></code></pre>
          } @else {
            <pre><code>Loading…</code></pre>
          }
        </div>
      }
    } @else {
      <div class="alert alert-warning mb-0">Unknown demo: {{ id() }}</div>
    }
  `,
})
export class DemoFrameComponent {
  readonly id = input.required<string>();
  readonly tab = signal<string>('preview');
  readonly repoUrl = REPO_DEMOS;

  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  readonly demo = computed(() => DEMOS[this.id()]);
  readonly themeLabel = computed(() => ({ bootstrap: 'Bootstrap', material: 'Material', tailwind: 'Tailwind', custom: 'Custom' })[this.demo()?.theme ?? 'custom']);

  readonly component = resource<Type<unknown> | undefined, { id: string }>({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => DEMOS[params.id]?.load() ?? Promise.resolve(undefined),
  });

  readonly source = resource<SafeHtml | undefined, { file: string }>({
    params: () => (this.tab() === 'preview' ? undefined : { file: this.tab() }) as { file: string },
    loader: async ({ params }) => {
      const text = await firstValueFrom(this.http.get(`demo-src/${params.file}`, { responseType: 'text' }));
      const lang = params.file.endsWith('.html') ? 'html' : 'typescript';
      return this.sanitizer.bypassSecurityTrustHtml(highlight(text, lang));
    },
  });

  fileName(path: string): string {
    return path.split('/').pop() ?? path;
  }

  onClick(event: MouseEvent) {
    handleCopyClick(event);
  }
}
