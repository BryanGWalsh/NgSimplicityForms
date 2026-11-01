import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../shared/api.service';
import { MarkdownService } from '../../shared/markdown.service';
import { groupSymbols } from './api-format';

@Component({
  selector: 'docs-api-index',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-content docs-content-wide">
      <h1>API reference</h1>
      <p class="lead">
        Generated with TypeDoc from the public entry point and doc comments of each package, so it always matches the
        source in this repository. Items marked <span class="badge docs-badge-ni">not implemented</span> are declared in
        the types but not used by the built-in components yet.
      </p>
      @for (pkg of packages(); track pkg.slug) {
        <section class="docs-api-package" [id]="pkg.slug">
          <h2><code>{{ pkg.name }}</code></h2>
          <p>{{ pkg.description }}</p>
          @for (group of pkg.groups; track group.title) {
            <h3 class="h6 text-uppercase text-body-secondary mt-4">{{ group.title }}</h3>
            <ul class="docs-api-list list-unstyled">
              @for (s of group.symbols; track s.name) {
                <li>
                  <a [routerLink]="api.link(s)" class="docs-api-name"><span class="docs-kind docs-kind-{{ s.kind }}">{{ s.kind }}</span>{{ s.name }}</a>
                  @if (s.registryKey) {
                    <code class="docs-key">{{ s.registryKey }}</code>
                  }
                  <span class="docs-api-summary" [innerHTML]="summary(s.summary)"></span>
                </li>
              }
            </ul>
          }
        </section>
      } @empty {
        <p class="text-body-secondary">Loading…</p>
      }
    </div>
  `,
})
export class ApiIndexComponent {
  readonly api = inject(ApiService);
  private readonly markdown = inject(MarkdownService);
  private readonly fragment = toSignal(inject(ActivatedRoute).fragment);
  private readonly scroller = inject(ViewportScroller);

  readonly packages = computed(() =>
    (this.api.data()?.packages ?? []).map((p) => ({ ...p, groups: groupSymbols(p.symbols) }))
  );

  constructor() {
    effect(() => {
      const f = this.fragment();
      if (f && this.packages().length) setTimeout(() => this.scroller.scrollToAnchor(f));
    });
  }

  summary(text?: string): string {
    return text ? this.markdown.renderFragment(text.split('\n\n')[0], true) : '';
  }
}
