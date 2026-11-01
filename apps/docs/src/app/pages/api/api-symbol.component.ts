import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { ApiDocComment, ApiMember } from '../../shared/api.model';
import { MarkdownService } from '../../shared/markdown.service';
import { highlight } from '../../shared/highlight';
import { linkTypes, memberSignature, symbolDeclaration } from './api-format';
import { handleCopyClick } from '../../shared/copy';

interface MemberGroup {
  title: string;
  members: ApiMember[];
}

@Component({
  selector: 'docs-api-symbol',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'onClick($event)' },
  template: `
    <div class="docs-content docs-content-wide">
      @if (symbol(); as s) {
        <nav aria-label="Breadcrumb" class="small mb-2">
          <a routerLink="/api">API</a> /
          <a routerLink="/api" [fragment]="s.package">{{ pkgName() }}</a>
        </nav>
        <h1 class="d-flex flex-wrap align-items-center gap-2">
          <span class="docs-kind docs-kind-{{ s.kind }} fs-6">{{ s.kind }}</span>
          <code class="docs-h1-code">{{ s.name }}</code>
          @if (s.notImplemented) {
            <span class="badge docs-badge-ni fs-6">not implemented</span>
          }
        </h1>

        <dl class="docs-api-facts">
          <div><dt>Import</dt><dd><code>import {{ '{' }} {{ s.name }} {{ '}' }} from '{{ pkgName() }}';</code></dd></div>
          @if (s.registryKey) {
            <div><dt>Registry key</dt><dd><code>{{ s.registryKey }}</code></dd></div>
          }
          @if (s.selector) {
            <div><dt>Selector</dt><dd><code>{{ s.selector }}</code></dd></div>
          }
          @if (s.providedIn) {
            <div><dt>Provided in</dt><dd><code>{{ s.providedIn }}</code></dd></div>
          }
          @if (s.source) {
            <div><dt>Source</dt><dd><a [href]="s.source.url" target="_blank" rel="noopener">{{ s.source.file }}:{{ s.source.line }}</a></dd></div>
          }
        </dl>

        <div class="docs-code"><pre><code class="hljs language-typescript" [innerHTML]="declaration()"></code></pre></div>

        @if (doc(s); as d) {
          <div class="docs-api-doc" [innerHTML]="d"></div>
        }

        @if (s.extendedBy?.length) {
          <p class="small">Extended by:
            @for (name of s.extendedBy; track name; let last = $last) {
              @if (api.byName().get(name); as target) {
                <a [routerLink]="api.link(target)"><code>{{ name }}</code></a>
              } @else {
                <code>{{ name }}</code>
              }
              @if (!last) {, }
            }
          </p>
        }

        @if (configSymbol(); as cfg) {
          <h2 class="h4">Configuration</h2>
          <p class="small text-body-secondary">
            Options accepted by <code>create()</code>, from
            <a [routerLink]="api.link(cfg)"><code>{{ cfg.name }}</code></a> (including inherited options).
          </p>
          <div class="table-responsive">
            <table class="table table-sm docs-table docs-config-table">
              <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                @for (m of cfg.members; track m.name) {
                  <tr>
                    <td><code>{{ m.name }}{{ m.optional ? '?' : '' }}</code></td>
                    <td><code class="docs-type" [innerHTML]="typeHtml(m.type)"></code></td>
                    <td>
                      @if (m.notImplemented) { <span class="badge docs-badge-ni">not implemented</span> }
                      <span [innerHTML]="inline(m.summary)"></span>
                      @if (m.defaultValue) { <span class="text-body-secondary"> Default: <code>{{ m.defaultValue }}</code></span> }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (s.members?.length) {
          <div class="form-check form-switch my-3">
            <input class="form-check-input" type="checkbox" id="show-inherited" [checked]="showInherited()" (change)="showInherited.set(!showInherited())" />
            <label class="form-check-label" for="show-inherited">Show inherited members ({{ inheritedCount() }})</label>
          </div>
          @for (group of memberGroups(); track group.title) {
            <h2 class="h4">{{ group.title }}</h2>
            <div class="docs-members">
              @for (m of group.members; track m.name + m.static) {
                <div class="docs-member" [id]="'member-' + m.name">
                  <div class="docs-member-head">
                    <code class="docs-member-name">{{ m.name }}{{ m.optional ? '?' : '' }}</code>
                    @if (m.static) { <span class="badge bg-body-tertiary text-body border">static</span> }
                    @if (m.protected) { <span class="badge bg-body-tertiary text-body border">protected</span> }
                    @if (m.readonly) { <span class="badge bg-body-tertiary text-body border">readonly</span> }
                    @if (m.notImplemented) { <span class="badge docs-badge-ni">not implemented</span> }
                    @if (m.inheritedFrom) {
                      <span class="small text-body-secondary ms-auto">inherited from
                        @if (api.byName().get(m.inheritedFrom); as from) {
                          <a [routerLink]="api.link(from)">{{ m.inheritedFrom }}</a>
                        } @else {
                          {{ m.inheritedFrom }}
                        }
                      </span>
                    }
                  </div>
                  <pre class="docs-member-sig"><code [innerHTML]="sig(m)"></code></pre>
                  @if (doc(m); as d) {
                    <div class="docs-member-doc" [innerHTML]="d"></div>
                  }
                  @if (m.signatures?.[0]?.parameters?.length && hasParamDocs(m)) {
                    <ul class="small mb-0">
                      @for (p of m.signatures![0].parameters; track p.name) {
                        <li><code>{{ p.name }}</code> {{ p.summary }}</li>
                      }
                    </ul>
                  }
                </div>
              }
            </div>
          }
        }
      } @else if (api.data()) {
        <h1>Not found</h1>
        <p>No symbol named <code>{{ name() }}</code>. <a routerLink="/api">Back to the API index</a>.</p>
      } @else {
        <p class="text-body-secondary">Loading…</p>
      }
    </div>
  `,
})
export class ApiSymbolComponent {
  readonly pkg = input.required<string>();
  readonly name = input.required<string>();
  readonly showInherited = signal(false);

  readonly api = inject(ApiService);
  private readonly markdown = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  readonly symbol = computed(() => this.api.byName().get(this.name()));
  readonly pkgName = computed(() => this.api.data()?.packages.find((p) => p.slug === this.symbol()?.package)?.name ?? '');

  readonly declaration = computed(() => {
    const s = this.symbol();
    return s ? highlight(symbolDeclaration(s), 'typescript') : '';
  });

  readonly inheritedCount = computed(() => (this.symbol()?.members ?? []).filter((m) => m.inheritedFrom).length);

  readonly memberGroups = computed<MemberGroup[]>(() => {
    const s = this.symbol();
    if (!s?.members) return [];
    const members = s.members.filter((m) => this.showInherited() || !m.inheritedFrom);
    if (s.kind === 'interface') return [{ title: 'Properties', members }];
    const groups: MemberGroup[] = [
      { title: 'Static members', members: members.filter((m) => m.static) },
      { title: 'Constructor', members: members.filter((m) => m.kind === 'constructor' && m.signatures?.[0]?.parameters.length) },
      { title: 'Properties', members: members.filter((m) => !m.static && (m.kind === 'property' || m.kind === 'accessor')) },
      { title: 'Methods', members: members.filter((m) => !m.static && m.kind === 'method') },
    ];
    return groups.filter((g) => g.members.length);
  });

  /** For form item components: the config interface taken by the static create() factory. */
  readonly configSymbol = computed(() => {
    const create = this.symbol()?.members?.find((m) => m.static && m.name === 'create');
    const type = create?.signatures?.[0]?.parameters[0]?.type?.replace(/<.*$/, '');
    const target = type ? this.api.byName().get(type) : undefined;
    if (target?.kind !== 'interface' || !target.members?.length) return undefined;
    // Required options first, reserved (not implemented) options last.
    const rank = (m: ApiMember) => (m.notImplemented ? 2 : m.optional ? 1 : 0);
    return { ...target, members: [...target.members].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)) };
  });

  typeHtml(type?: string): string {
    return linkTypes(type ?? 'unknown', this.api.byName());
  }

  inline(text?: string): string {
    return text ? this.markdown.renderFragment(text, true) : '';
  }

  sig(member: ApiMember): string {
    return linkTypes(memberSignature(member), this.api.byName());
  }

  hasParamDocs(member: ApiMember): boolean {
    return !!member.signatures?.[0]?.parameters.some((p) => p.summary);
  }

  /** Summary, remarks, default value and examples as HTML. */
  doc(item: ApiDocComment & { kind?: string; signatures?: { summary?: string }[] }): SafeHtml | null {
    const parts: string[] = [];
    const summary = item.summary ?? item.signatures?.[0]?.summary;
    if (summary) parts.push(summary);
    if (item.remarks) parts.push(item.remarks);
    if (item.defaultValue) parts.push(`**Default:** \`${item.defaultValue}\``);
    if (item.deprecated) parts.push(`> **Warning** Deprecated. ${item.deprecated === true ? '' : item.deprecated}`);
    for (const ex of item.examples ?? []) parts.push(ex);
    if (!parts.length) return null;
    return this.sanitizer.bypassSecurityTrustHtml(this.markdown.renderFragment(parts.join('\n\n')));
  }

  onClick(event: MouseEvent) {
    if (handleCopyClick(event)) return;
    const anchor = (event.target as HTMLElement | null)?.closest('a');
    const href = anchor?.getAttribute('href');
    if (!anchor || !href?.startsWith('/api/') || event.metaKey || event.ctrlKey || event.button !== 0) return;
    if (event.defaultPrevented) return; // already handled by a routerLink
    event.preventDefault();
    this.router.navigateByUrl(href);
  }
}
