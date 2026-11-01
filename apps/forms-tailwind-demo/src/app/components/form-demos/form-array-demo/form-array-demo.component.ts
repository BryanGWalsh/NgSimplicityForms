import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormConfig,
  NgsFormsService,
  NgsFormsFormGroupComponent,
  NgsFormsTextDivComponent,
  NgsFormsFormSectionComponent,
  NgsFormsFormArrayContainerComponent,
  NgsFormsFormArrayAddItemComponent,
  NgsFormsFormArrayRemoveItemComponent,
  NgsFormsRowComponent,
  NgsFormsFormArrayListComponent
} from '@ng-simplicity/forms-core';
import {
  NgsFormsTailwindModule,
  NgsFormsTailwindFormItemInputComponent,
  NgsFormsTailwindFormItemCheckboxComponent,
  NgsFormsTailwindRadioInputComponent,
  NgsFormsTailwindFormItemSelectInputComponent,
  NgsFormsTailwindFormItemTextAreaComponent
} from '@ng-simplicity/forms-tailwind';

@Component({
  selector: 'ngs-form-array-demo',
  imports: [CommonModule, NgsFormComponent],
  providers: [NgsFormsService],
  templateUrl: './form-array-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayDemoComponent implements OnInit {
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
    NgsFormsTailwindModule.registerAllTailwindComponents(ngsFormsRegistryService);
  }

  ngOnInit() {
    this.setupComprehensiveDemoForm();
  }

  private setupComprehensiveDemoForm() {
    // Dynamic visibility streams based on form values
    const contactMethod$ = this.ngsFormsService.formValue$.pipe(
      map(val => val?.demoForm?.contactMethod ?? val?.contactMethod)
    );

    const emailVisible$ = contactMethod$.pipe(map(method => method === 'email'));
    const phoneVisible$ = contactMethod$.pipe(map(method => method === 'phone'));

    const subscribeToNewsletter$ = this.ngsFormsService.formValue$.pipe(
      map(val => !!(val?.demoForm?.subscribeToNewsletter ?? val?.subscribeToNewsletter))
    );

    const formConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 150,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'demoForm',
        items: [
          // Section 1: Personal Profile Information
          NgsFormsFormSectionComponent.create({
            title: '1. Personal Profile',
            subtitle: 'Tell us a bit about yourself. Required fields are checked in real-time.',
            items: [
              NgsFormsRowComponent.create({
                containerClass: 'grid gap-x-4 md:grid-cols-2',
                items: [
                  NgsFormsTailwindFormItemInputComponent.create({
                    name: 'firstName',
                    label: 'First Name',
                    placeholder: 'Enter first name',
                    validators: [Validators.required, Validators.minLength(2)],
                    errorMessageMap: {
                      required: 'First name is highly recommended and required.',
                      minlength: 'First name must contain at least 2 letters.'
                    }
                  }),
                  NgsFormsTailwindFormItemInputComponent.create({
                    name: 'lastName',
                    label: 'Last Name',
                    placeholder: 'Enter last name',
                    validators: [Validators.required],
                    errorMessageMap: {
                      required: 'Last name is required to complete your registration.'
                    }
                  })
                ]
              }),
              NgsFormsTailwindFormItemTextAreaComponent.create({
                name: 'biography',
                label: 'Biography / About Me',
                placeholder: 'Describe your professional experience or hobbies...',
                labelLocation: 'top',
                validators: [Validators.maxLength(300)],
                errorMessageMap: {
                  maxlength: 'Biography must not exceed 300 characters.'
                }
              })
            ]
          }),

          // Section 2: Contact Preferences & Dynamic Fields
          NgsFormsFormSectionComponent.create({
            title: '2. Preferences & Contact Details',
            subtitle: 'Select your preferred contact method to show and validate specific fields.',
            items: [
              NgsFormsTailwindRadioInputComponent.create({
                name: 'contactMethod',
                label: 'Preferred Contact Method',
                alignment: 'horizontal',
                options: [
                  { id: 'none', label: 'None / No contact' },
                  { id: 'email', label: 'Email Address' },
                  { id: 'phone', label: 'Phone Number' }
                ]
              }),

              // Dynamically visible email field
              NgsFormsTailwindFormItemInputComponent.create({
                name: 'email',
                label: 'Preferred Email Address',
                placeholder: 'name@example.com',
                type: 'email',
                validators: [Validators.required, Validators.email],
                errorMessageMap: {
                  required: 'Email address is required when Email is chosen.',
                  email: 'Please provide a valid email format.'
                },
                visible$: emailVisible$
              }),

              // Dynamically visible phone field
              NgsFormsTailwindFormItemInputComponent.create({
                name: 'phone',
                label: 'Preferred Phone Number',
                placeholder: '123-456-7890',
                type: 'text',
                validators: [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)],
                errorMessageMap: {
                  required: 'Phone number is required when Phone is chosen.',
                  pattern: 'Phone number format must be 123-456-7890.'
                },
                visible$: phoneVisible$
              })
            ]
          }),

          // Section 3: Subscriptions & Nested Groups
          NgsFormsFormSectionComponent.create({
            title: '3. Newsletter Subscriptions',
            subtitle: 'Subscribe to receive updates. Checking subscribe will reveal option details.',
            items: [
              NgsFormsTailwindFormItemCheckboxComponent.create({
                name: 'subscribeToNewsletter',
                label: 'Yes, sign me up for the weekly digest newsletter'
              }),

              // Nested FormGroup that toggles based on subscription checkbox
              NgsFormsFormGroupComponent.create({ 
                name: 'newsletterSection',
                visible$: subscribeToNewsletter$,
                items: [
                  NgsFormsTailwindFormItemSelectInputComponent.create({
                    name: 'frequency',
                    label: 'Delivery Frequency',
                    labelLocation: 'top',
                    options: [
                      { id: 'daily', label: 'Daily (Every morning)' },
                      { id: 'weekly', label: 'Weekly (Every Friday)' },
                      { id: 'monthly', label: 'Monthly (First of the month)' }
                    ]
                  }),
                  NgsFormsTailwindFormItemCheckboxComponent.create({
                    name: 'agreeToTerms',
                    label: 'I agree to the promotional email terms and conditions',
                    validators: [Validators.requiredTrue],
                    errorMessageMap: {
                      required: 'You must agree to the terms to subscribe.'
                    }
                  })
                ]
              })
            ]
          }),

          // Section 4: Dynamic Emergency Contacts Array
          NgsFormsFormSectionComponent.create({
            title: '4. Emergency Contacts',
            subtitle: 'Dynamically add or remove contacts. Form array validator requires at least 1 contact.',
            items: [
              NgsFormsFormArrayContainerComponent.create({
                name: 'contacts',
                initialItemCount: 1,
                minItems: 1,
                maxItems: 3,
                containerClass: 'form-array-contacts',
                itemContainerClass: 'mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900',
                items: [
                  NgsFormsFormArrayListComponent.create({
                    templateItem: NgsFormsRowComponent.create({
                      containerClass: 'grid items-end gap-x-4 md:grid-cols-12',
                      columnClasses: ['md:col-span-5', 'md:col-span-5', 'md:col-span-2 mb-4'],
                      items: [
                        NgsFormsTailwindFormItemInputComponent.create({
                          name: 'contactName',
                          label: 'Contact Name',
                          placeholder: 'Full name',
                          validators: [Validators.required],
                          errorMessageMap: {
                            required: 'Emergency contact name is required.'
                          }
                        }),
                        NgsFormsTailwindFormItemInputComponent.create({
                          name: 'contactPhone',
                          label: 'Contact Phone',
                          placeholder: 'Phone number',
                          validators: [Validators.required],
                          errorMessageMap: {
                            required: 'Phone number is required.'
                          }
                        }),
                        NgsFormsFormArrayRemoveItemComponent.create({
                          buttonText: 'Delete',
                          buttonClass: 'w-full rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950'
                        })
                      ]
                    })
                  }),
                  NgsFormsRowComponent.create({
                    containerClass: 'mt-2 flex',
                    items: [
                      NgsFormsFormArrayAddItemComponent.create({
                        buttonText: 'Add Additional Contact',
                        buttonClass: 'rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700'
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    };

    this.ngsFormsService.setFormConfig(formConfig);
  }

  onSubmit() {
    this.isSubmitted.set(true);
    this.ngsFormsService.setIsSubmitted(true);
    if (this.isValid) {
      console.log('Form is VALID! Submitted values:', this.ngsFormsService.formValue);
      alert('Form successfully submitted! Check console log for data.');
    } else {
      console.warn('Form is INVALID. Please correct errors and try again.');
    }
  }

  onReset() {
    this.isSubmitted.set(false);
    this.ngsFormsService.setIsSubmitted(false);
    this.setupComprehensiveDemoForm();
  }

  onLoadSampleData() {
    this.ngsFormsService.patchValue({
      demoForm: {
        firstName: 'Jane',
        lastName: 'Doe',
        biography: 'A software engineer interested in building state of the art web applications.',
        contactMethod: 'email',
        email: 'jane.doe@example.com',
        subscribeToNewsletter: true,
        newsletterSection: {
          frequency: 'weekly',
          agreeToTerms: true
        },
        contacts: [
          {
            contactName: 'John Doe',
            contactPhone: '555-019-2834'
          }
        ]
      }
    });
  }
}
