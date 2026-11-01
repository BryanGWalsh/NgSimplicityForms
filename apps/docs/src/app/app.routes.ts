import { Route } from '@angular/router';
import { ALL_PAGES } from './nav';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent), title: 'NG-Simplicity Forms' },
  ...ALL_PAGES.map<Route>((page) => ({
    path: page.path,
    loadComponent: () => import('./pages/doc-page.component').then((m) => m.DocPageComponent),
    data: { page },
    title: `${page.title} · NG-Simplicity Forms`,
  })),
  {
    path: 'api',
    loadComponent: () => import('./pages/api/api-index.component').then((m) => m.ApiIndexComponent),
    title: 'API reference · NG-Simplicity Forms',
  },
  {
    path: 'api/:pkg/:name',
    loadComponent: () => import('./pages/api/api-symbol.component').then((m) => m.ApiSymbolComponent),
    title: 'API reference · NG-Simplicity Forms',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not found · NG-Simplicity Forms',
  },
];
