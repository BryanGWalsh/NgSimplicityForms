import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NAV } from './nav';
import { SearchComponent } from './shell/search.component';

@Component({
  selector: 'docs-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SearchComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly nav = NAV;
  readonly sidebarOpen = signal(false);
  readonly repoUrl = 'https://github.com/BryanGWalsh/NgSimplicityForms';
  readonly year = new Date().getFullYear();

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.sidebarOpen.set(false));
  }
}
