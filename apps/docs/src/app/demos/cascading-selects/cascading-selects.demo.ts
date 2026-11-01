import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { delay, distinctUntilChanged, map, Observable, of, skip, startWith, switchMap } from 'rxjs';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsFormInputOption,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent,
  NgsFormsBootstrapModule,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

const REGIONS: Record<string, NgsFormsFormInputOption[]> = {
  ca: [
    { id: 'on', label: 'Ontario' },
    { id: 'qc', label: 'Quebec' },
    { id: 'bc', label: 'British Columbia' },
  ],
  us: [
    { id: 'ca', label: 'California' },
    { id: 'ny', label: 'New York' },
    { id: 'tx', label: 'Texas' },
  ],
  au: [
    { id: 'nsw', label: 'New South Wales' },
    { id: 'vic', label: 'Victoria' },
  ],
};

/** Stand-in for an HTTP call such as `http.get<Option[]>('/api/regions?country=' + country)`. */
function loadRegions(country: string): Observable<NgsFormsFormInputOption[]> {
  return of(REGIONS[country] ?? []).pipe(delay(400));
}

@Component({
  selector: 'docs-cascading-selects-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-7"><ngs-form></ngs-form></div>
      <div class="col-lg-5"><docs-form-state-panel></docs-form-state-panel></div>
    </div>
  `,
})
export class CascadingSelectsDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    const country$ = this.forms.formValue$.pipe(
      map((v) => v?.address?.country as string | undefined),
      distinctUntilChanged()
    );

    // Each time the country changes, load its regions. Show a single disabled option while loading.
    const regionOptions$ = country$.pipe(
      switchMap((country) =>
        country
          ? loadRegions(country).pipe(startWith([{ id: '', label: 'Loading…', disabled: true }]))
          : of([])
      )
    );

    // A region from the previous country is no longer valid, so clear it when the country changes.
    country$
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.forms.patchValue({ address: { region: null } }));

    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'address',
        items: [
          NgsFormsBootstrapFormItemInputComponent.create({ name: 'street', label: 'Street address' }),
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
            errorMessageMap: { required: 'Choose a country.' },
          }),
          NgsFormsBootstrapFormItemSelectInputComponent.create({
            name: 'region',
            label: 'Province / state',
            labelLocation: 'top',
            placeholder: 'Choose a region',
            options$: regionOptions$,
            validators: [Validators.required],
            errorMessageMap: { required: 'Choose a region.' },
            // Hide the field until a country is chosen.
            visible$: country$.pipe(map(Boolean)),
          }),
        ],
      }),
    });
  }
}
