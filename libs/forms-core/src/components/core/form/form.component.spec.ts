import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormComponent } from './form.component';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { Component } from '@angular/core';

@Component({
  selector: 'mock-input',
  template: '<div>Mock Input</div>',
  standalone: true
})
class MockInputComponent {}

describe('NgsFormComponent', () => {
  let component: NgsFormComponent;
  let fixture: ComponentFixture<NgsFormComponent>;
  let formsService: NgsFormsService;
  let registryService: NgsFormsComponentRegistryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgsFormComponent],
      providers: [
        NgsFormsService,
        {
          provide: NgsFormsComponentRegistryService,
          useValue: {
            getComponentTypeForKey: jest.fn().mockReturnValue(MockInputComponent),
            register: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgsFormComponent);
    component = fixture.componentInstance;
    formsService = TestBed.inject(NgsFormsService);
    registryService = TestBed.inject(NgsFormsComponentRegistryService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and register internal service to forms service', () => {
    const setInternalServiceSpy = jest.spyOn(formsService, 'setInternalService');
    
    // Create new instance to trigger constructor
    const newFixture = TestBed.createComponent(NgsFormComponent);
    expect(setInternalServiceSpy).toHaveBeenCalled();
  });

  it('should render form item when config and group are set', async () => {
    formsService.setFormConfig({
      inputUpdateDebounce: 100,
      globalState: {},
      root: {
        uuid: 'root-id',
        type: 'mock-input',
        config: {}
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mock-input')).toBeTruthy();
  });
});
