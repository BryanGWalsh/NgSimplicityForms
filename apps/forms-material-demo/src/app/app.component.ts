import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs/operators';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormConfig,
  NgsFormsService,
  NgsFormsFormGroupComponent,
  NgsFormsFormSectionComponent,
  NgsFormsFormArrayAddItemComponent,
  NgsFormsFormArrayContainerComponent,
  NgsFormsFormArrayRemoveItemComponent,
  NgsFormsRowComponent,
  NgsFormsFormArrayListComponent
} from '@ng-simplicity/forms-core';
import {
  NgsFormsMaterialFormItemCheckboxComponent,
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialFormItemSelectInputComponent,
  NgsFormsMaterialFormItemTextAreaComponent,
  NgsFormsMaterialModule,
  NgsFormsMaterialRadioInputComponent,
} from '@ng-simplicity/forms-material';

@Component({
  selector: 'app-root',
  imports: [
    JsonPipe,
    NgsFormComponent,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [NgsFormsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly ngsFormsService = inject(NgsFormsService);

  readonly formValue = toSignal(this.ngsFormsService.formValue$);
  readonly isSubmitted = signal(false);

  get isValid(): boolean {
    return this.ngsFormsService.isValid;
  }

  get isDirty(): boolean {
    return this.ngsFormsService.dirty;
  }

  constructor(
    ngsFormsRegistryService: NgsFormsComponentRegistryService
  ) {
    // Register all Angular Material form components
    NgsFormsMaterialModule.registerAllMaterialComponents(ngsFormsRegistryService);
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    const contactMethod$ = this.ngsFormsService.formValue$.pipe(
      map(val => val?.materialDemoForm?.contactMethod ?? val?.contactMethod)
    );
    const emailVisible$ = contactMethod$.pipe(map(method => method === 'email'));
    const phoneVisible$ = contactMethod$.pipe(map(method => method === 'phone'));
    const subscribeToNewsletter$ = this.ngsFormsService.formValue$.pipe(
      map(val => !!(val?.materialDemoForm?.subscribeToNewsletter ?? val?.subscribeToNewsletter))
    );

    const formConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 150,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'materialDemoForm',
        items: [
          NgsFormsFormSectionComponent.create({
            title: '1. Personal Profile',
            subtitle: 'Tell us a bit about yourself. Required fields are checked in real time.',
            items: [
              NgsFormsRowComponent.create({
                containerClass: 'material-form-row material-form-row-two',
                columnClasses: ['material-form-column', 'material-form-column'],
                items: [
                  NgsFormsMaterialFormItemInputComponent.create({
                    name: 'firstName',
                    label: 'First Name',
                    placeholder: 'Enter first name',
                    validators: [Validators.required, Validators.minLength(2)],
                    errorMessageMap: {
                      required: 'First name is required.',
                      minlength: 'First name must contain at least 2 letters.',
                    },
                  }),
                  NgsFormsMaterialFormItemInputComponent.create({
                    name: 'lastName',
                    label: 'Last Name',
                    placeholder: 'Enter last name',
                    validators: [Validators.required],
                    errorMessageMap: {
                      required: 'Last name is required.',
                    },
                  }),
                ],
              }),
              NgsFormsMaterialFormItemTextAreaComponent.create({
                name: 'biography',
                label: 'Biography / About Me',
                placeholder: 'Describe your professional experience or hobbies...',
                rows: 4,
                validators: [Validators.maxLength(300)],
                errorMessageMap: {
                  maxlength: 'Biography must not exceed 300 characters.',
                },
              }),
            ],
          }),

          NgsFormsFormSectionComponent.create({
            title: '2. Preferences & Contact Details',
            subtitle: 'Select your preferred contact method to show and validate specific fields.',
            items: [
              NgsFormsMaterialRadioInputComponent.create({
                name: 'contactMethod',
                label: 'Preferred Contact Method',
                alignment: 'horizontal',
                options: [
                  { id: 'none', label: 'None / No contact', disabled: false },
                  { id: 'email', label: 'Email Address', disabled: false },
                  { id: 'phone', label: 'Phone Number', disabled: false },
                ],
              }),
              NgsFormsMaterialFormItemInputComponent.create({
                name: 'email',
                label: 'Preferred Email Address',
                placeholder: 'name@example.com',
                type: 'email',
                validators: [Validators.required, Validators.email],
                errorMessageMap: {
                  required: 'Email address is required when Email is chosen.',
                  email: 'Please provide a valid email format.',
                },
                visible$: emailVisible$,
              }),
              NgsFormsMaterialFormItemInputComponent.create({
                name: 'phone',
                label: 'Preferred Phone Number',
                placeholder: '123-456-7890',
                validators: [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)],
                errorMessageMap: {
                  required: 'Phone number is required when Phone is chosen.',
                  pattern: 'Phone number format must be 123-456-7890.',
                },
                visible$: phoneVisible$,
              }),
            ],
          }),

          NgsFormsFormSectionComponent.create({
            title: '3. Newsletter Subscriptions',
            subtitle: 'Subscribe to receive updates. Checking subscribe reveals delivery options.',
            items: [
              NgsFormsMaterialFormItemCheckboxComponent.create({
                name: 'subscribeToNewsletter',
                label: 'Yes, sign me up for the weekly digest newsletter',
              }),
              NgsFormsFormGroupComponent.create({ 
                name: 'newsletterSection',
                visible$: subscribeToNewsletter$,
                items: [
                  NgsFormsMaterialFormItemSelectInputComponent.create({
                    name: 'frequency',
                    label: 'Delivery Frequency',
                    placeholder: 'Choose a frequency',
                    options: [
                      { id: 'daily', label: 'Daily (Every morning)', disabled: false },
                      { id: 'weekly', label: 'Weekly (Every Friday)', disabled: false },
                      { id: 'monthly', label: 'Monthly (First of the month)', disabled: false },
                    ],
                  }),
                  NgsFormsMaterialFormItemCheckboxComponent.create({
                    name: 'agreeToTerms',
                    label: 'I agree to the promotional email terms and conditions',
                    validators: [Validators.requiredTrue],
                    errorMessageMap: {
                      required: 'You must agree to the terms to subscribe.',
                    },
                  }),
                ]
              }),
            ],
          }),

          NgsFormsFormSectionComponent.create({
            title: '4. Emergency Contacts',
            subtitle: 'Dynamically add or remove contacts. At least one contact is shown by default.',
            items: [
              NgsFormsFormArrayContainerComponent.create({
                name: 'contacts',
                initialItemCount: 1,
                minItems: 1,
                maxItems: 3,
                containerClass: 'material-form-array',
                itemContainerClass: 'material-form-array-item',
                items: [
                  NgsFormsFormArrayListComponent.create({
                    templateItem: NgsFormsRowComponent.create({
                      containerClass: 'material-form-row material-form-row-contact',
                      columnClasses: ['material-form-column', 'material-form-column', 'material-form-column-actions'],
                      items: [
                        NgsFormsMaterialFormItemInputComponent.create({
                          name: 'contactName',
                          label: 'Contact Name',
                          placeholder: 'Full name',
                          validators: [Validators.required],
                          errorMessageMap: {
                            required: 'Emergency contact name is required.',
                          },
                        }),
                        NgsFormsMaterialFormItemInputComponent.create({
                          name: 'contactPhone',
                          label: 'Contact Phone',
                          placeholder: 'Phone number',
                          validators: [Validators.required],
                          errorMessageMap: {
                            required: 'Phone number is required.',
                          },
                        }),
                        NgsFormsFormArrayRemoveItemComponent.create({
                          buttonText: 'Delete',
                          buttonClass: 'material-array-button material-array-button-warn',
                        }),
                      ],
                    })
                  }),
                  NgsFormsRowComponent.create({
                    containerClass: 'material-form-row material-form-row-add',
                    columnClasses: ['material-form-column'],
                    items: [
                      NgsFormsFormArrayAddItemComponent.create({
                        buttonText: 'Add Additional Contact',
                        buttonClass: 'material-array-button material-array-button-primary',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    };

    this.ngsFormsService.setFormConfig(formConfig);
  }

  onSubmit() {
    this.isSubmitted.set(true);
    this.ngsFormsService.setIsSubmitted(true);
    console.log('Material form submitted:', this.ngsFormsService.formValue);
  }

  onReset() {
    this.isSubmitted.set(false);
    this.ngsFormsService.setIsSubmitted(false);
    this.setupForm();
  }

  onLoadSampleData() {
    this.ngsFormsService.patchValue({
      materialDemoForm: {
        firstName: 'Jane',
        lastName: 'Doe',
        biography: 'A software engineer interested in building state of the art web applications.',
        contactMethod: 'email',
        email: 'jane.doe@example.com',
        subscribeToNewsletter: true,
        newsletterSection: {
          frequency: 'weekly',
          agreeToTerms: true,
        },
        contacts: [
          {
            contactName: 'John Doe',
            contactPhone: '555-019-2834',
          },
        ],
      }
    });
  }
}
