import { Type } from '@angular/core';

export interface DemoDefinition {
  title: string;
  /** Which component set the demo registers. Pages only mix demos of one theme, see the note below. */
  theme: 'bootstrap' | 'material' | 'tailwind' | 'custom';
  /** Source files shown in the code tabs, relative to this folder. The first one is the demo component. */
  files: string[];
  load: () => Promise<Type<unknown>>;
}

/**
 * Every live demo on the site. Markdown pages embed one with a line containing `::: demo <id>`.
 *
 * The component registry is a single platform-wide service, and the Bootstrap, Material and Tailwind packages
 * register components under the same keys. Each demo registers its theme in its constructor, so keep demos of
 * different themes on separate pages.
 */
export const DEMOS: Record<string, DemoDefinition> = {
  'quick-start-bootstrap': {
    title: 'Registration form (Bootstrap)',
    theme: 'bootstrap',
    files: ['quick-start-bootstrap/quick-start-bootstrap.demo.ts'],
    load: () => import('./quick-start-bootstrap/quick-start-bootstrap.demo').then((m) => m.QuickStartBootstrapDemoComponent),
  },
  'quick-start-material': {
    title: 'Registration form (Material)',
    theme: 'material',
    files: ['quick-start-material/quick-start-material.demo.ts'],
    load: () => import('./quick-start-material/quick-start-material.demo').then((m) => m.QuickStartMaterialDemoComponent),
  },
  'quick-start-tailwind': {
    title: 'Registration form (Tailwind)',
    theme: 'tailwind',
    files: ['quick-start-tailwind/quick-start-tailwind.demo.ts'],
    load: () => import('./quick-start-tailwind/quick-start-tailwind.demo').then((m) => m.QuickStartTailwindDemoComponent),
  },
  'sign-up': {
    title: 'Sign-up form',
    theme: 'bootstrap',
    files: ['sign-up/sign-up.demo.ts'],
    load: () => import('./sign-up/sign-up.demo').then((m) => m.SignUpDemoComponent),
  },
  'conditional-fields': {
    title: 'Conditional fields with visible$',
    theme: 'bootstrap',
    files: ['conditional-fields/conditional-fields.demo.ts'],
    load: () => import('./conditional-fields/conditional-fields.demo').then((m) => m.ConditionalFieldsDemoComponent),
  },
  'form-arrays': {
    title: 'Invoice line items',
    theme: 'bootstrap',
    files: ['form-arrays/form-arrays.demo.ts'],
    load: () => import('./form-arrays/form-arrays.demo').then((m) => m.FormArraysDemoComponent),
  },
  'cascading-selects': {
    title: 'Country and region',
    theme: 'bootstrap',
    files: ['cascading-selects/cascading-selects.demo.ts'],
    load: () => import('./cascading-selects/cascading-selects.demo').then((m) => m.CascadingSelectsDemoComponent),
  },
  'editing-data': {
    title: 'Load and edit a customer',
    theme: 'bootstrap',
    files: ['editing-data/editing-data.demo.ts'],
    load: () => import('./editing-data/editing-data.demo').then((m) => m.EditingDataDemoComponent),
  },
  'custom-control': {
    title: 'Star rating control',
    theme: 'custom',
    files: ['custom-control/custom-control.demo.ts', 'custom-control/rating.component.ts'],
    load: () => import('./custom-control/custom-control.demo').then((m) => m.CustomControlDemoComponent),
  },
  'layout': {
    title: 'Sections, rows, columns and groups',
    theme: 'bootstrap',
    files: ['layout/layout.demo.ts'],
    load: () => import('./layout/layout.demo').then((m) => m.LayoutDemoComponent),
  },
  'validation': {
    title: 'Validators and error messages',
    theme: 'bootstrap',
    files: ['validation/validation.demo.ts'],
    load: () => import('./validation/validation.demo').then((m) => m.ValidationDemoComponent),
  },
  'form-state': {
    title: 'Reading values and state',
    theme: 'bootstrap',
    files: ['form-state/form-state.demo.ts'],
    load: () => import('./form-state/form-state.demo').then((m) => m.FormStateDemoComponent),
  },
  'bootstrap-catalog': {
    title: 'All Bootstrap components',
    theme: 'bootstrap',
    files: ['bootstrap-catalog/bootstrap-catalog.demo.ts'],
    load: () => import('./bootstrap-catalog/bootstrap-catalog.demo').then((m) => m.BootstrapCatalogDemoComponent),
  },
  'material-catalog': {
    title: 'All Material components',
    theme: 'material',
    files: ['material-catalog/material-catalog.demo.ts'],
    load: () => import('./material-catalog/material-catalog.demo').then((m) => m.MaterialCatalogDemoComponent),
  },
  'tailwind-catalog': {
    title: 'All Tailwind components',
    theme: 'tailwind',
    files: ['tailwind-catalog/tailwind-catalog.demo.ts'],
    load: () => import('./tailwind-catalog/tailwind-catalog.demo').then((m) => m.TailwindCatalogDemoComponent),
  },
};
