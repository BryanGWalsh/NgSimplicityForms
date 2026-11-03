# Status and limitations

NG-Simplicity Forms is in active development. This page lists what is declared in the types but not implemented yet, and behaviour worth knowing about. The [API reference](/api) marks unimplemented options with a <span class="badge docs-badge-ni">not implemented</span> badge.

## Reserved options

These options exist in the configuration types so that configurations can be written ahead of time, but the built-in components do not act on them yet:

| Option | Where | Today |
| --- | --- | --- |
| `inputUpdateDebounce` | form config | Ignored. Values update on every change. |
| `itemContainerClass` | form array | Ignored. Use `containerClass` on the list. |
| `sanitize` | `content-html` | HTML is always sanitized. |
| `NgsFormItemVisibilityFn`, `NgsFormValidatorArrayBuilderFn`, `NgsFormDisableFn` | types | Not consumed. |
| `NgsServerSideValidationErrorObjectType` | type | Not consumed. |
| `displayMode`, `showEditToggle` state | component state | Not read by the built-in components yet. Custom controls can use them, see [Component state and edit toggle](/guides/component-state). |

## Behaviour to know about

- **Swapped validators apply on the next change.** `validators$` replaces a control's validators without re-running them. See the workaround in [Validation and errors](/guides/validation#changing-validators-at-runtime).
- **Custom controls without `[formControl]`** need to call `control.updateValueAndValidity()` after `super.ngOnInit()` so their validators run once. See [Building a custom control](/tutorials/custom-control#2-extend-the-input-base-class).
- **Patching needs rendered controls.** Wait a tick after `setFormConfig()`, give arrays enough rows with `initialItemCount`, and patch conditional fields after they appear. For fixed defaults, set `value` on the input instead. See [Editing existing data](/tutorials/editing-data).
- **Disabled controls are left out of the form value.** That is how Angular reactive forms work, and it means they also skip validation.
- **Set ids must be unique.** An input with a fixed `id` inside a form array row repeats that id on every row.
- **One theme per page.** The registry is platform wide and the theme packages share keys.
- **`uuid` is not declared in version `1.1.1` and earlier.** From `1.1.2` every package declares it. On older versions, install it in your application.
- **`content-html` is not registered in version `1.1.1` and earlier.** From `1.1.2` the `registerAll…` helpers register it. On older versions, call `registry.register(NgsFormsHtmlContentComponent.key, NgsFormsHtmlContentComponent)` yourself.
- **The Material package relies on a few utility classes** (`w-100`, `mb-2`, `mb-3`) and application styles for radio layout. See the [Material quick start](/getting-started/material#4-add-the-supporting-styles).
- **Section and text config interfaces** (`NgsFormsFormSectionConfig`, `NgsFormsTextDivConfig`) are not exported from the package entry point, so you cannot import them by name yet. The `create()` helpers are fully typed regardless.

## Reporting issues

Found something else? [Open an issue](https://github.com/BryanGWalsh/NgSimplicityForms/issues) with the configuration that reproduces it.
