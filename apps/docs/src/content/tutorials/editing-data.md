# Editing existing data

Forms are not only for new records. This tutorial loads a saved customer into a form that has a conditional field and a form array, which are the two cases that need a little care.

::: demo editing-data

## Patch with the same shape as the value

`patchValue()` takes an object shaped like `formValue$`, including the root group name. Fields you leave out keep their current values.

```ts
this.forms.patchValue({
  customer: { name: 'Acme Corp', email: 'billing@acme.test', vip: true },
});
```

## Wait for the form to render

For fixed defaults that don't come from your data, set `value` on the input's config instead. It is applied when the control is created, so no waiting is needed.

Form items are created asynchronously. If you call `setFormConfig()` and `patchValue()` in the same tick, the controls do not exist yet and the values are dropped. Wait for one macrotask between the two:

```ts
const nextRender = () => new Promise((resolve) => setTimeout(resolve));

this.forms.setFormConfig(config);
await nextRender();
this.forms.patchValue({ customer });
```

## Arrays need the right number of rows

A form array can only receive values for rows that exist. Build the configuration with one row per entry by passing the count to `initialItemCount`:

```ts
private buildConfig(contactCount: number): NgsFormsFormConfig {
  return {
    inputUpdateDebounce: 0,
    globalState: {},
    root: NgsFormsFormGroupComponent.create({
      name: 'customer',
      items: [
        // …
        NgsFormsFormArrayContainerComponent.create({
          name: 'contacts',
          initialItemCount: contactCount,
          items: [/* list and add button */],
        }),
      ],
    }),
  };
}
```

## Conditional fields need a second patch

A field behind `visible$` is only created after the value that shows it is set. Patch the fields that control visibility first, wait for the new fields to render, then patch the rest:

```ts
async load(id: string) {
  const customer = await firstValueFrom(this.api.getCustomer(id));

  this.forms.setFormConfig(this.buildConfig(customer.contacts.length));
  await nextRender();
  this.forms.patchValue({ customer });          // sets vip: true, which shows accountManager

  await nextRender();
  this.forms.patchValue({ customer: { accountManager: customer.accountManager } });
}
```

## Saving

When the user saves, read `formValue` (or the latest `formValue$` value) and send the part you need. Hidden fields are not in the value, so you never send stale data for questions that no longer apply.

```ts
save() {
  this.forms.setIsSubmitted(true);
  if (this.forms.isValid) this.api.saveCustomer(this.forms.formValue.customer).subscribe();
}
```

Next: [Building a custom control](/tutorials/custom-control).
