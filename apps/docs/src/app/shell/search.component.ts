import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ALL_PAGES } from '../nav';
import { ApiService } from '../shared/api.service';

interface Result {
  title: string;
  detail: string;
  link: string;
  icon: string;
}

/** Quick filter over page titles and API symbol names. */
@Component({
  selector: 'docs-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-search', '(document:keydown)': 'onGlobalKey($event)' },
  template: `
    <label class="visually-hidden" for="docs-search-input">Search the docs</label>
    <div class="position-relative">
      <i class="bi bi-search docs-search-icon" aria-hidden="true"></i>
      <input
        id="docs-search-input"
        class="form-control form-control-sm"
        type="search"
        placeholder="Search pages and API…  /"
        autocomplete="off"
        role="combobox"
        aria-controls="docs-search-results"
        [attr.aria-expanded]="results().length > 0"
        [value]="query()"
        (input)="query.set($any($event.target).value); active.set(0)"
        (keydown)="onKey($event)" />
    </div>
    @if (query() && results().length) {
      <ul id="docs-search-results" class="docs-search-results list-unstyled" role="listbox">
        @for (r of results(); track r.link; let i = $index) {
          <li role="option" [attr.aria-selected]="i === active()">
            <a [class.active]="i === active()" (click)="go($event, r)" [href]="r.link">
              <i class="bi {{ r.icon }}" aria-hidden="true"></i>
              <span><span class="d-block">{{ r.title }}</span><small class="text-body-secondary">{{ r.detail }}</small></span>
            </a>
          </li>
        }
      </ul>
    } @else if (query()) {
      <div class="docs-search-results small text-body-secondary p-2">No matches.</div>
    }
  `,
})
export class SearchComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly query = signal('');
  readonly active = signal(0);

  private readonly index = computed<Result[]>(() => [
    ...ALL_PAGES.map((p) => ({ title: p.title, detail: p.path.split('/')[0].replace('-', ' '), link: '/' + p.path, icon: 'bi-file-text' })),
    ...(this.api.data()?.packages ?? []).flatMap((pkg) =>
      pkg.symbols.map((s) => ({
        title: s.name,
        detail: `${s.kind} · ${pkg.slug}${s.registryKey ? ` · key "${s.registryKey}"` : ''}`,
        link: this.api.link(s),
        icon: 'bi-braces',
      }))
    ),
  ]);

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return this.index()
      .map((r) => {
        const hay = `${r.title} ${r.detail}`.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return null;
        const score = r.title.toLowerCase().startsWith(terms[0]) ? 0 : r.title.toLowerCase().includes(terms[0]) ? 1 : 2;
        return { r, score };
      })
      .filter((x): x is { r: Result; score: number } => !!x)
      .sort((a, b) => a.score - b.score || a.r.title.length - b.r.title.length)
      .slice(0, 12)
      .map((x) => x.r);
  });

  onKey(event: KeyboardEvent) {
    const n = this.results().length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.set((this.active() + 1) % Math.max(n, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.set((this.active() - 1 + n) % Math.max(n, 1));
    } else if (event.key === 'Enter' && n) {
      event.preventDefault();
      this.go(event, this.results()[this.active()]);
    } else if (event.key === 'Escape') {
      this.query.set('');
    }
  }

  onGlobalKey(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && !target.isContentEditable) {
      event.preventDefault();
      this.host.nativeElement.querySelector('input')?.focus();
    }
  }

  go(event: Event, result: Result) {
    event.preventDefault();
    this.query.set('');
    this.router.navigateByUrl(result.link);
  }
}
