# Introduction

NG-Simplicity Forms is a set of Angular packages that render reactive forms from a configuration tree. Instead of writing a template and a `FormGroup` for every form, you describe the form as data: which fields exist, how they are laid out, which validators apply, and when each one is visible. The engine builds the Angular reactive form and renders the right component for each item.

::: demo quick-start-bootstrap

## Why configuration driven forms?

Hand written forms are easy until they are not. Once fields appear and disappear based on other answers, validators change with the account type, option lists come from the server and the same form has to work in two design systems, the template and the `FormGroup` drift apart. NG-Simplicity Forms keeps all of that in one typed object:

- **One source of truth.** The configuration describes both the structure of the form value and what the user sees.
- **Reactive rules.** Visibility (`visible$`), validators (`validators$`) and options (`options$`) can be RxJS streams, usually derived from the form's own value.
- **Swappable rendering.** The engine looks components up by key in a registry. The Bootstrap and Material packages register the same keys, so the same configuration renders in either style, and you can register your own components.
- **Modern Angular.** Every component uses `OnPush`, state is exposed through signals, and nothing depends on zone.js. This documentation site runs zoneless.

## The packages

| Package | What it contains |
| --- | --- |
| `@ng-simplicity/forms-core` | The engine: `NgsFormsService`, the component registry, the `<ngs-form>` renderer, configuration models, base classes, and structural items (group, section, row, column, form array, text). |
| `@ng-simplicity/forms-bootstrap` | Bootstrap 5 inputs: text, textarea, checkbox, radio and select. |
| `@ng-simplicity/forms-material` | Angular Material inputs: text, textarea, checkbox, radio and select. |

You always install `forms-core`, plus one theme package or your own components.

## How it fits together

```text
NgsFormsFormConfig
└── root: form-group "registration"          → UntypedFormGroup
    ├── section "Contact"                    → layout only, no control
    │   └── row
    │       ├── input-text "firstName"       → FormControl
    │       └── input-text "lastName"        → FormControl
    └── form-array "phones"                  → UntypedFormArray
        └── form-array-list → row per entry  → UntypedFormGroup per entry
```

1. You provide `NgsFormsService` on a component and put `<ngs-form>` in its template.
2. You register the components you want to use with `NgsFormsComponentRegistryService`.
3. You call `setFormConfig()` with the tree. Each node's `type` is a registry key, and the static `create()` helpers fill it in for you.
4. The engine renders each node, adds its control to the parent group under its `name`, and keeps validation messages up to date.
5. You read the result through `formValue$`, `isValid` and `dirty`, and mark the form submitted with `setIsSubmitted(true)`.

## Where to go next

- [Installation](/getting-started/installation) lists the packages and peer dependencies.
- [Quick start: Bootstrap](/getting-started/bootstrap) and [Quick start: Angular Material](/getting-started/material) build the form above step by step.
- The [tutorials](/tutorials/sign-up-form) walk through common use cases, each with a live demo.
- The [API reference](/api) documents every export.
