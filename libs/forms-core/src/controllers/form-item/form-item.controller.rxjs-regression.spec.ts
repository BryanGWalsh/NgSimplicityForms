import { TestBed, ComponentFixture, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NgsFormsFormItemDirective } from '../../components/core/form-item/form-item.component';
import { NgsFormsComponentRegistryService } from '../../services/form-component-registry/form-component-registry.service';

let alive = 0;
let created = 0;

@Component({ template: 'mock', standalone: true })
class MockItemComponent implements OnDestroy {
  constructor() { alive++; created++; }
  ngOnDestroy() { alive--; }
}

@Component({
  template: `@if (show) { <div [ngs-form-item]="itemData"></div> }`,
  imports: [NgsFormsFormItemDirective],
  standalone: true,
})
class HostComponent {
  @ViewChild(NgsFormsFormItemDirective) directive!: NgsFormsFormItemDirective;
  show = true;
  itemData: any;
}

describe('NgsFormItemController async races', () => {
  let fixture: ComponentFixture<HostComponent>;
  beforeEach(async () => {
    alive = 0; created = 0;
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: NgsFormsComponentRegistryService, useValue: { getComponentTypeForKey: () => MockItemComponent } }],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
  });

  it('visible$ true then false in the same tick leaves the item hidden', fakeAsync(() => {
    const visible$ = new Subject<boolean>();
    fixture.componentInstance.itemData = { uuid: '1', type: 'mock', config: { visible$ } };
    fixture.detectChanges();
    visible$.next(true);
    visible$.next(false);
    flushMicrotasks();
    expect(alive).toBe(0);
  }));

  it('visible$ true,false,true in the same tick renders exactly one component', fakeAsync(() => {
    const visible$ = new Subject<boolean>();
    fixture.componentInstance.itemData = { uuid: '1', type: 'mock', config: { visible$ } };
    fixture.detectChanges();
    visible$.next(true);
    visible$.next(false);
    visible$.next(true);
    flushMicrotasks();
    expect(alive).toBe(1);
  }));

  it('destroying the directive before the deferred create does not create a component (visible$)', fakeAsync(() => {
    const visible$ = new Subject<boolean>();
    fixture.componentInstance.itemData = { uuid: '1', type: 'mock', config: { visible$ } };
    fixture.detectChanges();
    visible$.next(true);
    fixture.componentInstance.show = false;
    fixture.detectChanges(); // directive destroyed, controller.destroy() called
    flushMicrotasks();
    expect(created).toBe(0);
    expect(alive).toBe(0);
  }));

  it('destroying the directive before the deferred create does not create a component (no visible$)', fakeAsync(() => {
    fixture.componentInstance.itemData = { uuid: '1', type: 'mock', config: {} };
    fixture.detectChanges();
    fixture.componentInstance.show = false;
    fixture.detectChanges();
    flushMicrotasks();
    expect(created).toBe(0);
    expect(alive).toBe(0);
  }));
});
