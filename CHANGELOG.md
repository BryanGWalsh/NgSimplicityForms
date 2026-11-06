# Changelog

All notable changes to this project will be documented in this file.

## [1.1.4] - 2026-11-06

### Fixed
- Form arrays: the Remove button removes its own row after earlier rows have been removed. Before, it could remove the row below it or do nothing.
- `visible$` that changes more than once in one tick no longer renders a hidden item or a second copy of the item. An item whose `ngs-form-item` is destroyed before it renders no longer adds its control to the form.
- `ngs-form-item` re-renders when its item, group or array input changes.
- `validators$` re-validates the control on every emission, and `validators` apply to a group's or array's initial state, so an empty required array is invalid.
- Enabling a group or array no longer enables children configured with `disabled: true` or `disabled$`.
- Error messages appear once a control is touched, for example on blur (Angular 18 and later).
- The `[ngs-form-array]` add and remove helpers use the `FormArray` API, so the array's value and validity follow its controls.
- `NgsFormsService`: the latest `setFormConfig()` call wins, the config is applied when `<ngs-form>` connects or is re-mounted under the same service, subscriptions and timers are torn down on destroy, and `formValue$` completes. A form whose controls are all disabled counts as valid.
- `subscribeToState()` gives every subscriber the current state.
- Bootstrap and Tailwind radios and selects keep numeric option ids as numbers, so a numeric value checks the matching radio.
- Material input and textarea use the generated id when no `id` is configured.

### Added
- `NGS_FORMS_ARRAY_ROW` injection token with the row's form group, for custom components inside form array rows.
- Form array Remove button: `ariaLabel` option, defaulting to `Remove item N`, and focus moves to the next row's Remove button when the focused row is removed.
- Section: `headingLevel` option (default 3). The title is exposed as a heading and the section as a group named by it.
- `isRequired` on input components.
- Typed Material configs `NgsFormsFormItemConfigMaterialTextInput` and `NgsFormsFormItemConfigMaterialTextArea`.
- Exports: `NgsFormsGlobalFormState`, `NgsFormsCommonComponentState`, `NgsFormsTextDivConfig`, `NgsFormsFormSectionConfig` and `NgsFormsFormsItemConfigBoostrapRadio`.

### Changed
- Accessibility (Bootstrap, Tailwind, and the Material checkbox and radio): invalid controls get `aria-invalid="true"`, required controls `aria-required="true"`, error messages are announced through a polite live region, and the radios in a group share a `name`.
- `NgsFormsFormInputOption.id` is typed `string | number`, matching the docs.
- `commonState()` and the state setters accept custom keys, and `updateGlobalState()` / `updateComponentState()` are typed.
- `control` on form groups and arrays is typed as `UntypedFormGroup` / `UntypedFormArray`.
- `NgsFormsService.attempt` is no longer public.
- The Bootstrap, Material and Tailwind packages require `@ng-simplicity/forms-core ^1.1.4`.

## [1.1.3] - 2026-11-03

### Added
- `visible: false` keeps an item out of the form. `visible$` still takes precedence when both are set.
- `disabled` and `disabled$` disable and enable a control. On a group or array they disable everything inside, including rows and fields added later.
- `value` sets an input's starting value when its control is created.
- A configured `id` is used as the element id in place of the generated one.
- `globalState` and the form's `initialState` (keyed by item `uuid` or `name`) seed component state on each `setFormConfig()`. An item's `initialState` seeds its own state when it is first created.
- `toggleDisplayMode()` on input components switches their own `displayMode` between `input` and `summary`.
- Docs: a Component state and edit toggle guide with a live demo, and the shared options listed in Core concepts.

### Changed
- Bootstrap and Tailwind: generated element ids no longer have a `-top` / `-left` suffix.
- The Bootstrap, Material and Tailwind packages require `@ng-simplicity/forms-core ^1.1.3`.
- `setFormConfig()` now resets component state as well as values.

### Removed
- The unused `onAddItem` and `onRemoveItem` options on the form array add and remove buttons.

## [1.1.2] - 2026-11-01

### Added
- New `@ng-simplicity/forms-tailwind` styling package with Tailwind CSS `input-text`, `input-textarea`, `checkbox`, `radio` and `select` components, `NgsFormsTailwindModule.registerAllTailwindComponents()`, and `provideNgsFormsTailwindClasses()` for overriding the default classes.
- Docs: Tailwind installation steps, a Tailwind quick start and a Tailwind component reference with live demos.

### Changed
- All packages declare `uuid` as a dependency, so it no longer has to be installed by hand.
- `NgsFormsCoreModule.registerCoreNgsFormComponents()` (and so every `registerAll…` helper) now registers `content-html`.
- The Bootstrap, Material and Tailwind packages require `@ng-simplicity/forms-core ^1.1.2`.
- Docs site: dark theme and full page width.

## [1.0.0] - 2026-06-19

### Added
- First official release of `@ng-simplicity/forms-core` core engine.
- First official release of `@ng-simplicity/forms-bootstrap` styling package (includes `input-text`, `input-textarea`, `checkbox`, `radio`, `select`, `error`).
- First official release of `@ng-simplicity/forms-material` styling package (includes `input-text`, `input-textarea`).
- Comprehensive unit test suites achieving 100% line coverage for all services, controllers, base classes, and components.
- Added support for Signals-based form value updates and OnPush/Zoneless change detection.
