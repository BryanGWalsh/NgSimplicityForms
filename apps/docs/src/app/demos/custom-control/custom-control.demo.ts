import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormsItemTextAreaComponent,
  NgsFormsBootstrapModule,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';
import { RatingInputComponent } from './rating.component';

@Component({
  selector: 'docs-custom-control-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-7">
        <ngs-form></ngs-form>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-primary" (click)="submit()">Send feedback</button>
          <button type="button" class="btn btn-outline-secondary" (click)="toggleSummary()">
            {{ summary() ? 'Edit answers' : 'Review answers' }}
          </button>
        </div>
      </div>
      <div class="col-lg-5"><docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel></div>
    </div>
  `,
})
export class CustomControlDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);
  readonly summary = signal(false);

  constructor() {
    const registry = inject(NgsFormsComponentRegistryService);
    NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
    // 5. Register the custom control next to the built-in ones.
    registry.register(RatingInputComponent.key, RatingInputComponent);
  }

  ngOnInit() {
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'feedback',
        items: [
          // 6. Use it in a config like any other item.
          RatingInputComponent.create({
            name: 'overall',
            label: 'How was your stay?',
            hint: 'Click a star.',
            validators: [Validators.required],
            errorMessageMap: { required: 'Please give a rating.' },
          }),
          RatingInputComponent.create({ name: 'value', label: 'Value for money', max: 10 }),
          NgsFormsBootstrapFormsItemTextAreaComponent.create({ name: 'comments', label: 'Anything else?' }),
        ],
      }),
    });
  }

  submit() {
    this.forms.setIsSubmitted(true);
    this.submitted.set(true);
  }

  toggleSummary() {
    this.summary.set(!this.summary());
    // Global state reaches every component through commonState(). Our rating control reads displayMode.
    this.forms.updateGlobalState({ displayMode: this.summary() ? 'summary' : 'input' });
  }
}
