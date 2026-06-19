import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { NgsFormsFormItemDirective } from './form-item.component';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';

@Component({
  template: `
    <div [ngs-form-item]="itemData" [ngs-form-group]="formGroup" [ngs-form-array]="formArray" [ngs-form-index]="index"></div>
  `,
  imports: [NgsFormsFormItemDirective],
  standalone: true
})
class TestHostComponent {
  @ViewChild(NgsFormsFormItemDirective) directive!: NgsFormsFormItemDirective;
  itemData: any = undefined;
  formGroup: any = undefined;
  formArray: any = undefined;
  index: any = undefined;
}

@Component({
  template: '',
  standalone: true
})
class MockItemComponent {}

describe('NgsFormsFormItemDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let registryService: NgsFormsComponentRegistryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: NgsFormsComponentRegistryService,
          useValue: {
            getComponentTypeForKey: jest.fn().mockReturnValue(MockItemComponent)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    registryService = TestBed.inject(NgsFormsComponentRegistryService);
  });

  it('should log error when itemData is undefined', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    hostComponent.itemData = undefined;
    fixture.detectChanges();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Form item without form data');
    consoleErrorSpy.mockRestore();
  });

  it('should initialize NgsFormItemController with formGroup', () => {
    hostComponent.itemData = { uuid: '1', type: 'mock', config: {} };
    hostComponent.formGroup = new UntypedFormGroup({});
    fixture.detectChanges();

    expect(hostComponent.directive.controller).toBeDefined();
  });

  it('should initialize NgsFormItemController with formArray', () => {
    hostComponent.itemData = { uuid: '1', type: 'mock', config: {} };
    hostComponent.formArray = new UntypedFormArray([]);
    fixture.detectChanges();

    expect(hostComponent.directive.controller).toBeDefined();
  });
});
