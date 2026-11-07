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

## No need to wait for the form to render

Form items are created asynchronously, but you can call `patchValue()` straight after `setFormConfig()`, even before `<ngs-form>` has connected. The patch is applied at once to the controls that exist, kept, and applied again each time new controls appear, until the form stops changing:

```ts
this.forms.setFormConfig(config);
this.forms.patchValue({ customer });
```

Calling `setFormConfig()` again drops patches that are still being applied to the previous form. (In version `1.1.4` and earlier you had to wait a macrotask between the two calls.)

For fixed defaults that don't come from your data, set `value` on the input's config instead. It is applied when the control is created.

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

## Conditional fields fill in by themselves

A field behind `visible$` is only created after the value that shows it is set. Because the patch is re-applied while new controls keep appearing, one call fills them too, however deep the chain goes (a patched value reveals a field, whose patched value reveals another):

```ts
async load(id: string) {
  const customer = await firstValueFrom(this.api.getCustomer(id));

  this.forms.setFormConfig(this.buildConfig(customer.contacts.length));
  this.forms.patchValue({ customer }); // sets vip: true, which shows accountManager, which is then filled in too
}
```

Once the form has settled the patch is finished, so later edits and visibility changes are not overwritten. (In version `1.1.4` and earlier you had to patch conditional fields again after they appeared.)

## Saving

When the user saves, read `formValue` (or the latest `formValue$` value) and send the part you need. Hidden fields are not in the value, so you never send stale data for questions that no longer apply.

```ts
save() {
  this.forms.setIsSubmitted(true);
  if (this.forms.isValid) this.api.saveCustomer(this.forms.formValue.customer).subscribe();
}
```

Next: [Building a custom control](/tutorials/custom-control).
