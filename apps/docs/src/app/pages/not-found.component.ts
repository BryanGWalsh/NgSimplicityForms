import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-content py-5">
      <h1>Page not found</h1>
      <p>That page doesn't exist. It may have moved.</p>
      <a class="btn btn-primary" routerLink="/">Back to the home page</a>
    </div>
  `,
})
export class NotFoundComponent {}
