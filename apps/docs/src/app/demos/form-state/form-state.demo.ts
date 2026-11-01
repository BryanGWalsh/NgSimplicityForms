import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent,
  NgsFormsBootstrapModule,
} from '@ng-simplicity/forms-bootstrap';

@Component({
  selector: 'docs-form-state-demo',
  imports: [NgsFormComponent, JsonPipe],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-6">
        <ngs-form></ngs-form>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-primary btn-sm" (click)="submit()">setIsSubmitted(true)</button>
          <button type="button" class="btn btn-outline-primary btn-sm" (click)="fill()">patchValue(…)</button>
          <button type="button" class="btn btn-outline-secondary btn-sm" (click)="reset()">setFormConfig(…) again</button>
        </div>
      </div>
      <div class="col-lg-6">
        <table class="table table-sm small mb-2">
          <tbody>
            <tr><th scope="row">isValid</th><td><code>{{ status().valid }}</code></td></tr>
            <tr><th scope="row">dirty</th><td><code>{{ status().dirty }}</code></td></tr>
            <tr><th scope="row">submitted</th><td><code>{{ submitted() }}</code></td></tr>
            <tr><th scope="row">greeting (computed)</th><td>{{ greeting() }}</td></tr>
          </tbody>
        </table>
        <div class="small text-body-secondary">toSignal(formValue$)</div>
        <pre class="docs-state-json border rounded p-2">{{ value() | json }}</pre>
        @if (lastSubmit()) {
          <div class="small text-body-secondary">Last submitted payload</div>
          <pre class="docs-state-json border rounded p-2">{{ lastSubmit() | json }}</pre>
        }
      </div>
    </div>
  `,
})
export class FormStateDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  /** The form value as a signal. */
  readonly value = toSignal(this.forms.formValue$, { initialValue: {} });

  /** Anything derived from the value is just a computed signal. */
  readonly greeting = computed(() => {
    const p = this.value()?.profile;
    return p?.name ? `Hello, ${p.title ? p.title + ' ' : ''}${p.name}!` : '(type a name)';
  });

  /** isValid and dirty are getters, so read them again whenever the value or submitted state changes. */
  readonly submitted = signal(false);
  readonly status = computed(() => {
    this.value();
    this.submitted();
    return { valid: this.forms.isValid, dirty: this.forms.dirty };
  });

  readonly lastSubmit = signal<unknown>(null);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    this.reset();
  }

  submit() {
    this.forms.setIsSubmitted(true);
    this.submitted.set(true);
    if (this.forms.isValid) this.lastSubmit.set(this.forms.formValue);
  }

  fill() {
    this.forms.patchValue({ profile: { title: 'Dr.', name: 'Ada Lovelace', email: 'ada@example.com' } });
  }

  reset() {
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'profile',
        items: [
          NgsFormsBootstrapFormItemSelectInputComponent.create({
            name: 'title',
            label: 'Title',
            labelLocation: 'top',
            options: [
              { id: 'Ms.', label: 'Ms.' },
              { id: 'Mr.', label: 'Mr.' },
              { id: 'Dr.', label: 'Dr.' },
            ],
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'name',
            label: 'Name',
            validators: [Validators.required],
            errorMessageMap: { required: 'Name is required.' },
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'email',
            label: 'Email',
            type: 'email',
            validators: [Validators.required, Validators.email],
            errorMessageMap: { required: 'Email is required.', email: 'Enter a valid email.' },
          }),
        ],
      }),
    });
    this.submitted.set(false);
    this.lastSubmit.set(null);
  }
}
