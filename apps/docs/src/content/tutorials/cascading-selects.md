# Cascading selects

A classic dependent field: choose a country, then choose a province or state from a list that depends on the country. This tutorial uses `options$` to load options as the user changes the first select, and `visible$` to hide the second select until it makes sense.

::: demo cascading-selects

## Static options first

The first select has a fixed list, so it uses `options`:

```ts
NgsFormsBootstrapFormItemSelectInputComponent.create({
  name: 'country',
  label: 'Country',
  labelLocation: 'top',
  placeholder: 'Choose a country',
  options: [
    { id: 'ca', label: 'Canada' },
    { id: 'us', label: 'United States' },
    { id: 'au', label: 'Australia' },
  ],
  validators: [Validators.required],
}),
```

## Options from a stream

`options$` accepts any `Observable<NgsFormsFormInputOption[]>`. Every emission replaces the options. Combine `formValue$` with `switchMap` to load a new list each time the country changes, and `startWith` to show a placeholder while the request is in flight:

```ts
const country$ = this.forms.formValue$.pipe(
  map((v) => v?.address?.country as string | undefined),
  distinctUntilChanged()
);

const regionOptions$ = country$.pipe(
  switchMap((country) =>
    country
      ? this.http.get<NgsFormsFormInputOption[]>(`/api/regions?country=${country}`).pipe(
          startWith([{ id: '', label: 'Loading…', disabled: true }])
        )
      : of([])
  )
);

NgsFormsBootstrapFormItemSelectInputComponent.create({
  name: 'region',
  label: 'Province / state',
  labelLocation: 'top',
  placeholder: 'Choose a region',
  options$: regionOptions$,
  validators: [Validators.required],
  visible$: country$.pipe(map(Boolean)),
}),
```

`switchMap` cancels the previous request when the user changes country quickly, so a slow response can never overwrite a newer one.

## Clear the stale value

When the country changes, the region chosen for the old country is no longer valid. Clear it with `patchValue()`:

```ts
country$
  .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
  .subscribe(() => this.forms.patchValue({ address: { region: null } }));
```

`skip(1)` ignores the initial value, and `takeUntilDestroyed` ends the subscription with the component.

## The same pattern elsewhere

`options$` works on the Bootstrap and Material selects and radio groups. Use it for any option list that is not known up front: users from a search, products in a category, time slots for a date.

Next: [Editing existing data](/tutorials/editing-data).
