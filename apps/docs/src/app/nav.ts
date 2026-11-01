/** A page in the docs navigation. `file` is the Markdown file under src/content. */
export interface DocPage {
  title: string;
  path: string;
  file: string;
  description?: string;
}

export interface NavSection {
  title: string;
  icon: string;
  pages: DocPage[];
}

export const NAV: NavSection[] = [
  {
    title: 'Getting started',
    icon: 'bi-rocket-takeoff',
    pages: [
      { title: 'Introduction', path: 'getting-started/introduction', file: 'getting-started/introduction.md' },
      { title: 'Installation', path: 'getting-started/installation', file: 'getting-started/installation.md' },
      { title: 'Quick start: Bootstrap', path: 'getting-started/bootstrap', file: 'getting-started/quick-start-bootstrap.md' },
      { title: 'Quick start: Angular Material', path: 'getting-started/material', file: 'getting-started/quick-start-material.md' },
    ],
  },
  {
    title: 'Tutorials',
    icon: 'bi-mortarboard',
    pages: [
      { title: 'Sign-up form with validation', path: 'tutorials/sign-up-form', file: 'tutorials/sign-up-form.md' },
      { title: 'Conditional fields', path: 'tutorials/conditional-fields', file: 'tutorials/conditional-fields.md' },
      { title: 'Repeating rows with form arrays', path: 'tutorials/form-arrays', file: 'tutorials/form-arrays.md' },
      { title: 'Cascading selects', path: 'tutorials/cascading-selects', file: 'tutorials/cascading-selects.md' },
      { title: 'Editing existing data', path: 'tutorials/editing-data', file: 'tutorials/editing-data.md' },
      { title: 'Building a custom control', path: 'tutorials/custom-control', file: 'tutorials/custom-control.md' },
    ],
  },
  {
    title: 'Guides',
    icon: 'bi-book',
    pages: [
      { title: 'Core concepts', path: 'guides/core-concepts', file: 'guides/core-concepts.md' },
      { title: 'Layout and structure', path: 'guides/layout', file: 'guides/layout.md' },
      { title: 'Validation and errors', path: 'guides/validation', file: 'guides/validation.md' },
      { title: 'Values, state and submission', path: 'guides/form-state', file: 'guides/form-state.md' },
      { title: 'Signals, OnPush and zoneless', path: 'guides/change-detection', file: 'guides/change-detection.md' },
    ],
  },
  {
    title: 'Themes',
    icon: 'bi-palette',
    pages: [
      { title: 'Bootstrap components', path: 'themes/bootstrap', file: 'themes/bootstrap.md' },
      { title: 'Material components', path: 'themes/material', file: 'themes/material.md' },
    ],
  },
  {
    title: 'Project',
    icon: 'bi-info-circle',
    pages: [
      { title: 'Status and limitations', path: 'project/status', file: 'project/status.md' },
      { title: 'Contributing to the docs', path: 'project/docs', file: 'project/docs.md' },
    ],
  },
];

export const ALL_PAGES: DocPage[] = NAV.flatMap((s) => s.pages);
