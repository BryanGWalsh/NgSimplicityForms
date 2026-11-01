import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoFrameComponent } from '../shared/demo-frame.component';
import { highlight } from '../shared/highlight';

const SNIPPET = `NgsFormsFormGroupComponent.create({
  name: 'signUp',
  items: [
    NgsFormsBootstrapFormItemInputComponent.create({
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required, Validators.email],
    }),
    NgsFormsBootstrapFormsItemCheckboxComponent.create({
      name: 'newsletter',
      label: 'Send me the newsletter',
    }),
  ],
})`;

@Component({
  selector: 'docs-home',
  imports: [RouterLink, DemoFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="docs-hero">
      <div class="docs-hero-text">
        <span class="badge bg-body-tertiary text-body border mb-3">Angular 17 – 22 · Signals · Zoneless ready</span>
        <h1 class="display-5 fw-bold">Forms from configuration, not boilerplate.</h1>
        <p class="lead text-body-secondary">
          NG-Simplicity Forms renders complete Angular reactive forms from a typed configuration tree.
          Visibility, validators and options can all be streams, so the form reacts to what the user enters.
          Pick Bootstrap, Angular Material, Tailwind CSS, or bring your own components.
        </p>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-primary btn-lg" routerLink="/getting-started/introduction">Get started</a>
          <a class="btn btn-outline-secondary btn-lg" routerLink="/tutorials/sign-up-form">Follow a tutorial</a>
          <a class="btn btn-link btn-lg" routerLink="/api">API reference</a>
        </div>
      </div>
      <div class="docs-hero-code docs-code">
        <div class="docs-code-title">sign-up.form.ts</div>
        <pre><code class="hljs language-typescript" [innerHTML]="snippet"></code></pre>
      </div>
    </section>

    <section class="docs-features">
      @for (f of features; track f.title) {
        <div class="docs-feature">
          <i class="bi {{ f.icon }}" aria-hidden="true"></i>
          <h2 class="h6">{{ f.title }}</h2>
          <p>{{ f.text }}</p>
        </div>
      }
    </section>

    <section class="docs-home-demo">
      <h2 class="h4">Try it</h2>
      <p class="text-body-secondary">This is a live form rendered by the library. Choose a contact method to see conditional fields appear, and switch to the code tab to see the configuration behind it.</p>
      <docs-demo id="conditional-fields"></docs-demo>
    </section>

    <section class="docs-home-paths">
      <h2 class="h4">Where to next</h2>
      <div class="docs-card-grid">
        @for (c of paths; track c.link) {
          <a class="docs-card" [routerLink]="c.link">
            <span class="docs-card-title"><i class="bi {{ c.icon }}" aria-hidden="true"></i> {{ c.title }}</span>
            <span class="docs-card-text">{{ c.text }}</span>
          </a>
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  readonly snippet = highlight(SNIPPET, 'typescript');

  readonly features = [
    { icon: 'bi-diagram-3', title: 'Declarative config', text: 'Describe groups, sections, rows, arrays and inputs as one typed tree with static create() helpers.' },
    { icon: 'bi-lightning-charge', title: 'Reactive by design', text: 'Bind visibility, validators and options to Observables, so the form adapts as values change.' },
    { icon: 'bi-cpu', title: 'Signals, OnPush, zoneless', text: 'Built on toSignal and OnPush components. This whole site runs without zone.js.' },
    { icon: 'bi-palette2', title: 'Swappable themes', text: 'The same configuration renders with Bootstrap, Angular Material, Tailwind CSS, or components you register yourself.' },
  ];

  readonly paths = [
    { icon: 'bi-download', title: 'Install', text: 'Packages, peer dependencies and Angular version support.', link: '/getting-started/installation' },
    { icon: 'bi-bootstrap', title: 'Bootstrap quick start', text: 'A working form in four steps with Bootstrap 5.', link: '/getting-started/bootstrap' },
    { icon: 'bi-layers', title: 'Material quick start', text: 'The same form with Angular Material components.', link: '/getting-started/material' },
    { icon: 'bi-wind', title: 'Tailwind quick start', text: 'The same form styled with Tailwind CSS utilities.', link: '/getting-started/tailwind' },
    { icon: 'bi-list-ol', title: 'Form arrays', text: 'Let users add and remove repeating rows.', link: '/tutorials/form-arrays' },
    { icon: 'bi-puzzle', title: 'Custom controls', text: 'Build and register a control of your own.', link: '/tutorials/custom-control' },
    { icon: 'bi-braces', title: 'API reference', text: 'Every exported class, interface and option.', link: '/api' },
  ];
}
