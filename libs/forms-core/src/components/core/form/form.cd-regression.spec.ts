import { ChangeDetectionStrategy, Component, inject, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgsFormComponent } from './form.component';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { NgsFormsCoreModule } from '../../../forms-core.module';
import { NgsFormsBaseClassFormInputComponent } from '../../../classes/form-component-base/form-component-input.class';
import { NgsFormsFormGroupComponent } from '../../shared-form-components/form-group';
import { NgsFormsFormArrayContainerComponent } from '../../shared-form-components/form-array/container';
import { NgsFormsFormArrayListComponent } from '../../shared-form-components/form-array/list';
import { NgsFormsFormArrayRemoveItemComponent } from '../../shared-form-components/form-array/remove-item';
import { NgsFormsFormArrayAddItemComponent } from '../../shared-form-components/form-array/add-item';
import { NgsFormsRowComponent } from '../../shared-form-components/row';
import { NgsFormsTextDivComponent } from '../../shared-form-components/text-div';
import { NgsFormsFormItemDirective } from '../form-item/form-item.component';
import { NgsFormsFormItem } from '../../../models';
import { NgsFormsInternalService } from '../../../services/internal/internal-forms.service';

@Component({
  selector: 'rcd-input',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (control) {<input [formControl]="control" /><span class="err">{{ errorMessage }}</span><span class="mode">{{ commonState().displayMode }}</span>}`,
})
class RcdInputComponent extends NgsFormsBaseClassFormInputComponent<any> {
  static override key = 'rcd-input';
}

@Component({
  selector: 'rcd-host',
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  template: `@if (show()) {<ngs-form></ngs-form>}`,
})
class HostComponent {
  readonly forms = inject(NgsFormsService);
  readonly show = signal(true);
}

function register() {
  const registry = TestBed.inject(NgsFormsComponentRegistryService);
  NgsFormsCoreModule.registerCoreNgsFormComponents(registry);
  registry.register(RcdInputComponent.key, RcdInputComponent);
}

async function settle(fixture: ComponentFixture<unknown>, zoneless = false) {
  for (let i = 0; i < 8; i++) {
    if (!zoneless) fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 30));
  }
}

const input = (name: string, extra: object = {}) =>
  ({ uuid: name, type: RcdInputComponent.key, config: { name, ...extra } }) as NgsFormsFormItem<any>;

function arrayConfig() {
  return {
    inputUpdateDebounce: 0,
    globalState: {},
    root: NgsFormsFormGroupComponent.create({
      name: 'root',
      items: [
        NgsFormsFormArrayContainerComponent.create({
          name: 'list',
          initialItemCount: 3,
          items: [
            NgsFormsFormArrayListComponent.create({
              templateItem: NgsFormsRowComponent.create({
                items: [input('v'), NgsFormsFormArrayRemoveItemComponent.create({ buttonText: 'Remove' })],
              }),
            }),
            NgsFormsFormArrayAddItemComponent.create({ buttonText: 'Add' }),
          ],
        }),
      ],
    }),
  } as any;
}

describe('form array Remove after an earlier row is removed', () => {
  it('remove button removes its own row after an earlier row was removed', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.forms.setFormConfig(arrayConfig());
    await settle(fixture);
    fixture.componentInstance.forms.patchValue({ root: { list: [{ v: 'a' }, { v: 'b' }, { v: 'c' }] } });
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const removeButtons = () => Array.from(el.querySelectorAll('ngs-forms-form-array-remove-item button')) as HTMLButtonElement[];
    expect(removeButtons().length).toBe(3);

    removeButtons()[0].click(); // remove 'a'
    await settle(fixture);
    expect(fixture.componentInstance.forms.formValue.root.list).toEqual([{ v: 'b' }, { v: 'c' }]);

    // Now click the remove button of the row showing 'b' (row 0 now, but DI index is still 1)
    removeButtons()[0].click();
    await settle(fixture);
    expect(fixture.componentInstance.forms.formValue.root.list).toEqual([{ v: 'c' }]);
  });
});

describe('visibility toggled within one tick', () => {
  function cfg(visible$: Observable<boolean>) {
    return {
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [NgsFormsTextDivComponent.create({ text: 'always' }), { ...NgsFormsTextDivComponent.create({ text: 'conditional' }), config: { text: 'conditional', visible$ } } as any],
      }),
    } as any;
  }

  it('does not render an item whose visible$ went true -> false synchronously', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    const visible$ = new BehaviorSubject<boolean>(false);
    fixture.componentInstance.forms.setFormConfig(cfg(visible$));
    await settle(fixture);
    visible$.next(true);
    visible$.next(false);
    await settle(fixture);
    const texts = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('ngs-form-component-text-div')).map((e) => e.textContent);
    expect(texts).toEqual(['always']);
  });

  it('renders exactly one instance after true -> false -> true synchronously', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    const visible$ = new BehaviorSubject<boolean>(false);
    fixture.componentInstance.forms.setFormConfig(cfg(visible$));
    await settle(fixture);
    visible$.next(true);
    visible$.next(false);
    visible$.next(true);
    await settle(fixture);
    const texts = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('ngs-form-component-text-div')).map((e) => e.textContent);
    expect(texts).toEqual(['always', 'conditional']);
    // and hiding it again must remove every instance
    visible$.next(false);
    await settle(fixture);
    const texts2 = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('ngs-form-component-text-div')).map((e) => e.textContent);
    expect(texts2).toEqual(['always']);
  });
});

@Component({
  selector: 'rcd-directive-host',
  imports: [NgsFormsFormItemDirective],
  providers: [NgsFormsInternalService, NgsFormsService],
  template: `@if (show()) {<ng-container [ngs-form-item]="item()" [ngs-form-group]="group"></ng-container>}`,
})
class DirectiveHostComponent {
  readonly show = signal(true);
  readonly item = signal<NgsFormsFormItem<any>>(input('first'));
  readonly group = new UntypedFormGroup({});
}

describe('ngs-form-item directive lifecycle', () => {
  it('does not create the component (or register its control) if the directive is destroyed before the deferred create runs', async () => {
    TestBed.configureTestingModule({ imports: [DirectiveHostComponent] });
    register();
    const fixture = TestBed.createComponent(DirectiveHostComponent);
    fixture.detectChanges(); // directive ngOnInit -> create() queued in a microtask
    fixture.componentInstance.show.set(false);
    fixture.detectChanges(); // directive destroyed synchronously
    await settle(fixture);
    expect(Object.keys(fixture.componentInstance.group.controls)).toEqual([]);
  });

  it('re-renders when the [ngs-form-item] input changes', async () => {
    TestBed.configureTestingModule({ imports: [DirectiveHostComponent] });
    register();
    const fixture = TestBed.createComponent(DirectiveHostComponent);
    await settle(fixture);
    expect(Object.keys(fixture.componentInstance.group.controls)).toEqual(['first']);
    fixture.componentInstance.item.set(input('second'));
    await settle(fixture);
    expect(Object.keys(fixture.componentInstance.group.controls)).toEqual(['second']);
  });
});

describe('<ngs-form> re-mounted under the same NgsFormsService', () => {
  it('still renders the configured form after being destroyed and re-created', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.forms.setFormConfig({ inputUpdateDebounce: 0, globalState: {}, root: NgsFormsFormGroupComponent.create({ name: 'root', items: [input('email')] }) } as any);
    await settle(fixture);
    expect((fixture.nativeElement as HTMLElement).querySelector('rcd-input input')).toBeTruthy();
    fixture.componentInstance.show.set(false);
    await settle(fixture);
    fixture.componentInstance.show.set(true);
    await settle(fixture);
    expect((fixture.nativeElement as HTMLElement).querySelector('rcd-input input')).toBeTruthy();
  });

  it('setFormConfig after <ngs-form> was destroyed and re-created renders in the live form', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.show.set(false);
    await settle(fixture);
    fixture.componentInstance.show.set(true);
    await settle(fixture);
    fixture.componentInstance.forms.setFormConfig({ inputUpdateDebounce: 0, globalState: {}, root: NgsFormsFormGroupComponent.create({ name: 'root', items: [input('email')] }) } as any);
    await settle(fixture);
    expect((fixture.nativeElement as HTMLElement).querySelector('rcd-input input')).toBeTruthy();
  });
});

describe('zoneless', () => {
  async function setup(config: any) {
    TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideZonelessChangeDetection()] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.autoDetectChanges();
    fixture.componentInstance.forms.setFormConfig(config);
    await settle(fixture, true);
    return fixture;
  }

  it('renders, shows validation errors and state changes without zone.js', async () => {
    const fixture = await setup({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({ name: 'root', items: [input('email', { validators: [Validators.required], errorMessageMap: { required: 'Required!' }, value: 'x' })] }),
    });
    const el = fixture.nativeElement as HTMLElement;
    const inp = el.querySelector('rcd-input input') as HTMLInputElement;
    expect(inp).toBeTruthy();
    inp.value = '';
    inp.dispatchEvent(new Event('input'));
    await settle(fixture, true);
    expect(el.querySelector('.err')!.textContent).toBe('Required!');
    fixture.componentInstance.forms.updateComponentState('email', { displayMode: 'summary' });
    await settle(fixture, true);
    expect(el.querySelector('.mode')!.textContent).toBe('summary');
    fixture.componentInstance.forms.setIsSubmitted(true);
    await settle(fixture, true);
  });

  it('adds and removes form array rows without zone.js', async () => {
    const fixture = await setup(arrayConfig());
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('rcd-input').length).toBe(3);
    (el.querySelector('ngs-forms-form-array-add-item button') as HTMLButtonElement).click();
    await settle(fixture, true);
    expect(el.querySelectorAll('rcd-input').length).toBe(4);
    (el.querySelector('ngs-forms-form-array-remove-item button') as HTMLButtonElement).click();
    await settle(fixture, true);
    expect(el.querySelectorAll('rcd-input').length).toBe(3);
  });

  it('toggles visible$ without zone.js', async () => {
    const visible$ = new BehaviorSubject(false);
    const fixture = await setup({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({ name: 'root', items: [input('a'), input('b', { visible$ })] }),
    });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('rcd-input').length).toBe(1);
    visible$.next(true);
    await settle(fixture, true);
    expect(el.querySelectorAll('rcd-input').length).toBe(2);
    visible$.next(false);
    await settle(fixture, true);
    expect(el.querySelectorAll('rcd-input').length).toBe(1);
  });
});

describe('error message after blur (touched only)', () => {
  it('shows the error message once an invalid, untouched control is blurred', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    register();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({ name: 'root', items: [input('email', { validators: [Validators.required], errorMessageMap: { required: 'Required!' } })] }),
    } as any);
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const inp = el.querySelector('rcd-input input') as HTMLInputElement;
    inp.dispatchEvent(new Event('blur'));
    await settle(fixture);
    expect(el.querySelector('.err')!.textContent).toBe('Required!');
  });
});
