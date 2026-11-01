# Layout and structure

Layout items arrange fields without adding controls, and form groups nest values. Combining them lets the visual structure and the data structure differ when they need to.

::: demo layout

## Sections

`NgsFormsFormSectionComponent` renders a title, an optional subtitle, and its items. It has no control, so the items' values stay in the surrounding group.

```ts
NgsFormsFormSectionComponent.create({
  title: 'Contact',
  subtitle: 'How we reach you.',
  titleClass: 'h4',        // default 'h3'
  subtitleClass: 'small',  // default 'lead'
  items: [/* … */],
}),
```

The rendered markup uses the classes `form-section`, `form-section-title`, `form-section-subtitle` and `form-section-items`, so you can style every section from your global stylesheet.

## Rows

`NgsFormsRowComponent` wraps each item in a `div` and the whole row in another. You choose the classes, so it works with Bootstrap's grid, CSS grid, flexbox utilities or Tailwind.

```ts
NgsFormsRowComponent.create({
  containerClass: 'row g-3',
  columnClasses: ['col-md-6', 'col-md-3', 'col-md-3'], // one per item
  items: [city, region, postcode],
}),

NgsFormsRowComponent.create({
  containerClass: 'grid grid-cols-2 gap-4', // Tailwind works too
  columnClass: '',                           // same class for every item
  items: [firstName, lastName],
}),
```

`columnClass` wins over `columnClasses` when both are set.

## Columns

`NgsFormsColumnComponent` renders its items one after the other with no wrapper. Use it to put several items in a single row cell:

```ts
NgsFormsRowComponent.create({
  containerClass: 'row',
  columnClasses: ['col-md-6', 'col-md-6'],
  items: [
    NgsFormsColumnComponent.create({ items: [packagingTitle, giftWrap, noInvoice] }),
    NgsFormsColumnComponent.create({ items: [notificationsTitle, smsUpdates] }),
  ],
}),
```

## Static text

`NgsFormsTextDivComponent` renders a line of text with optional classes. `NgsFormsTextDivComponent.title('Shipping')` is a shortcut for a heading (`h2` by default).

```ts
NgsFormsTextDivComponent.create({ text: 'Packaging', classes: 'fw-semibold mb-1' }),
NgsFormsTextDivComponent.title('Shipping', 'h4'),
```

For rich content, register and use `NgsFormsHtmlContentComponent` (key `content-html`). Its HTML passes through Angular's sanitizer.

```ts
registry.register(NgsFormsHtmlContentComponent.key, NgsFormsHtmlContentComponent);

NgsFormsHtmlContentComponent.create({ html: '<p>Read the <a href="/terms">terms</a> first.</p>', sanitize: true }),
```

## Nested groups

A form group nests its children's values under its `name`. Use it when the data you send has nested objects:

```ts
NgsFormsFormGroupComponent.create({
  name: 'shipping',
  items: [street, city, region, postcode],
}),
// → { order: { shipping: { street, city, region, postcode }, … } }
```

Groups can be hidden with `visible$` like any other item, which removes the whole nested object from the value.

## Label placement

The Bootstrap text input, textarea and select accept `labelLocation: 'left'` for a horizontal form (`col-sm-2` label, `col-sm-10` control). See the [Bootstrap reference](/themes/bootstrap).

## Visual vs. data structure

| You want | Use |
| --- | --- |
| A heading over some fields | `section` |
| Fields side by side | `form-row` (+ `column` for stacked cells) |
| A nested object in the value | `form-group` |
| Both a heading and a nested object | a `section` containing a `form-group` |
| A list of objects | `form-array` ([tutorial](/tutorials/form-arrays)) |
