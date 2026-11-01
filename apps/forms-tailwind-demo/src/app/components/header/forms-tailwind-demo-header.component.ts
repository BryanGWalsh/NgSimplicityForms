import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngs-forms-tailwind-demo-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a class="text-lg font-semibold text-gray-900 dark:text-gray-100" href="#">ng Simplicity dynamic forms tailwind demo</a>
        <ul class="hidden gap-6 text-sm text-gray-600 sm:flex dark:text-gray-300">
          <li><a class="font-medium text-sky-600 dark:text-sky-400" href="#">Home</a></li>
          <li><a class="hover:text-gray-900 dark:hover:text-white" href="#">Features</a></li>
          <li><a class="hover:text-gray-900 dark:hover:text-white" href="#">Pricing</a></li>
          <li><a class="hover:text-gray-900 dark:hover:text-white" href="#">Contact</a></li>
        </ul>
      </div>
    </nav>
  `,
})
export class FormsTailwindDemoHeaderComponent {}
