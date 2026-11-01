import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { DocPage, ALL_PAGES } from '../nav';
import { MarkdownService } from '../shared/markdown.service';
import { DemoFrameComponent } from '../shared/demo-frame.component';
import { handleCopyClick } from '../shared/copy';
import { ViewportScroller } from '@angular/common';

type ViewSegment = { kind: 'html'; html: SafeHtml } | { kind: 'demo'; id: string };

@Component({
  selector: 'docs-doc-page',
  imports: [DemoFrameComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Delegated click handling for links and copy buttons inside the rendered Markdown.
  host: { '(click)': 'onClick($event)' },
  template: `
    <div class="docs-page">
      <article class="docs-content">
        @if (doc(); as d) {
          @for (segment of segments(); track $index) {
            @if (segment.kind === 'html') {
              <div [innerHTML]="segment.html"></div>
            } @else {
              <docs-demo [id]="segment.id"></docs-demo>
            }
          }
          <nav class="docs-pager" aria-label="Previous and next page">
            @if (prev(); as p) {
              <a class="docs-pager-link" [routerLink]="'/' + p.path"><small>Previous</small><span>← {{ p.title }}</span></a>
            } @else {
              <span></span>
            }
            @if (next(); as n) {
              <a class="docs-pager-link text-end" [routerLink]="'/' + n.path"><small>Next</small><span>{{ n.title }} →</span></a>
            }
          </nav>
          <p class="small text-body-secondary mt-4">
            <a [href]="editUrl()" target="_blank" rel="noopener"><i class="bi bi-pencil" aria-hidden="true"></i> Edit this page on GitHub</a>
          </p>
        } @else {
          <div class="text-body-secondary">Loading…</div>
        }
      </article>
      @if (doc()?.toc?.length) {
        <aside class="docs-toc" aria-label="On this page">
          <div class="docs-toc-heading">On this page</div>
          <ul class="list-unstyled">
            @for (entry of doc()!.toc; track entry.id) {
              <li [class.ps-3]="entry.level === 3"><a [href]="'#' + entry.id" (click)="scrollTo($event, entry.id)">{{ entry.text }}</a></li>
            }
          </ul>
        </aside>
      }
    </div>
  `,
})
export class DocPageComponent {
  /** Bound from the route's data by withComponentInputBinding(). */
  readonly page = input.required<DocPage>();

  private readonly markdown = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly scroller = inject(ViewportScroller);

  readonly doc = toSignal(toObservable(this.page).pipe(switchMap((p) => this.markdown.load(p.file))));

  readonly segments = computed<ViewSegment[]>(() =>
    (this.doc()?.segments ?? []).map((s) =>
      // Content is our own Markdown from the repository, so it is trusted.
      s.kind === 'html' ? { kind: 'html', html: this.sanitizer.bypassSecurityTrustHtml(s.html) } : s
    )
  );

  private readonly index = computed(() => ALL_PAGES.findIndex((p) => p.path === this.page().path));
  readonly prev = computed(() => ALL_PAGES[this.index() - 1]);
  readonly next = computed(() => ALL_PAGES[this.index() + 1]);
  readonly editUrl = computed(
    () => `https://github.com/BryanGWalsh/NgSimplicityForms/edit/main/apps/docs/src/content/${this.page().file}`
  );

  constructor() {
    // Scroll to the fragment once the Markdown has rendered (the router tries before the content exists).
    effect(() => {
      if (!this.doc()) return;
      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) setTimeout(() => this.scroller.scrollToAnchor(fragment));
    });
  }

  scrollTo(event: Event, id: string) {
    event.preventDefault();
    this.router.navigate([], { fragment: id, replaceUrl: true });
    this.scroller.scrollToAnchor(id);
  }

  /** Route clicks on internal links in rendered Markdown through the router instead of reloading the page. */
  onClick(event: MouseEvent) {
    if (handleCopyClick(event)) return;
    const anchor = (event.target as HTMLElement | null)?.closest('a');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const href = anchor.getAttribute('href');
    if (!href || anchor.target === '_blank') return;
    if (href.startsWith('#')) {
      event.preventDefault();
      this.scrollTo(event, href.slice(1));
      return;
    }
    if (href.startsWith('/')) {
      event.preventDefault();
      this.router.navigateByUrl(href);
    }
  }
}
