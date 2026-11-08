import { TestBed } from '@angular/core/testing';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapRadioInputComponent } from './radio.component';
import { NgsFormsBootstrapModule } from '../../forms-bootstrap.module';

async function settle(fixture: any, rounds = 5) {
  for (let i = 0; i < rounds; i++) {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
  }
}

// Every radio group used to share one Angular radio registry group, so choosing an option in one group
// unchecked (and visibly re-checked) the options of every other group in the app.
describe('several radio groups in one form', () => {
  const options = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, label: String(i + 1) }));
  const questions = ['q1', 'q2', 'q3', 'q4'];
  const answers = [8, 3, 10, 6];

  it('keeps each group checked on its own choice', async () => {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    NgsFormsBootstrapModule.registerAllBootStrapComponents(TestBed.inject(NgsFormsComponentRegistryService));
    const service = TestBed.inject(NgsFormsService);
    const fixture = TestBed.createComponent(NgsFormComponent);
    fixture.detectChanges();
    service.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'survey',
        items: questions.map((name) => NgsFormsBootstrapRadioInputComponent.create({ name, label: name, options })),
      }),
    } as any);
    await settle(fixture);

    const groups: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role=radiogroup]'));
    expect(groups.length).toBe(questions.length);
    const checked = () => groups.map((g) => {
      const radios: HTMLInputElement[] = Array.from(g.querySelectorAll('input[type=radio]'));
      return radios.findIndex((r) => r.checked) + 1;
    });

    for (let i = 0; i < questions.length; i++) {
      (groups[i].querySelectorAll('input[type=radio]')[answers[i] - 1] as HTMLInputElement).click();
      await settle(fixture, 2);
    }

    expect(service.formValue).toEqual({ survey: { q1: 8, q2: 3, q3: 10, q4: 6 } });
    expect(checked()).toEqual(answers);
  });
});
