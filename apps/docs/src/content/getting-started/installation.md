# Installation

## Requirements

All three packages share a version number and support Angular **17 through 22**. Angular 17 is the minimum because the component templates use the built-in control flow (`@if`, `@for`).

| Package | Version | Peer dependencies |
| --- | --- | --- |
| `@ng-simplicity/forms-core` | `1.1.1` | `@angular/core`, `@angular/common`, `@angular/forms` 17 to 22 |
| `@ng-simplicity/forms-bootstrap` | `1.1.1` | the above, plus `@ng-simplicity/forms-core ^1.1.1` |
| `@ng-simplicity/forms-material` | `1.1.1` | the above, plus `@angular/material` 17 to 22 (same major as Angular) |

The packages also import [`uuid`](https://www.npmjs.com/package/uuid) to generate item ids. It is not declared in their `package.json` yet, so install it in your application as well.

## With Bootstrap

```bash
npm install @ng-simplicity/forms-core @ng-simplicity/forms-bootstrap uuid bootstrap
```

Add the Bootstrap stylesheet to the `styles` array of your build target in `angular.json` (or `project.json` in an Nx workspace):

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
```

The form array buttons accept an icon class. If you want to use Bootstrap Icons there, also install `bootstrap-icons` and add `node_modules/bootstrap-icons/font/bootstrap-icons.css`.

Continue with [Quick start: Bootstrap](/getting-started/bootstrap).

## With Angular Material

```bash
ng add @angular/material
npm install @ng-simplicity/forms-core @ng-simplicity/forms-material uuid
```

`ng add` sets up a theme and animations. If you add Material by hand, include a theme stylesheet such as `@angular/material/prebuilt-themes/azure-blue.css` and add `provideAnimationsAsync()` to your application providers.

Continue with [Quick start: Angular Material](/getting-started/material).

## With your own components

Install only `@ng-simplicity/forms-core` and `uuid`, then follow [Building a custom control](/tutorials/custom-control). The structural items (groups, sections, rows, columns and form arrays) come from the core package and work with any styling.

## Upgrades

Fixes are released once and work on every supported Angular major, so a single `^1.1.0` range keeps receiving compatible fixes whether your application is on Angular 17 or 22. See the [changelog](https://github.com/BryanGWalsh/NgSimplicityForms/blob/main/CHANGELOG.md) for release notes.
