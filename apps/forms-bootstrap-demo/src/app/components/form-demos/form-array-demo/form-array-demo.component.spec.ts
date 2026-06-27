import { TestBed } from '@angular/core/testing';
import { FormArrayDemoComponent } from './form-array-demo.component';
import { NgsFormsService } from '@ng-simplicity/forms-core';

describe('FormArrayDemoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormArrayDemoComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize the form configuration on init', () => {
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    const setFormConfigSpy = jest.spyOn(component.ngsFormsService, 'setFormConfig');
    
    component.ngOnInit();
    
    expect(setFormConfigSpy).toHaveBeenCalled();
    const config = setFormConfigSpy.mock.calls[0][0];
    expect(config.root.config.name).toBe('demoForm');
  });

  it('should log form submission', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    
    component.onSubmit();
    
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted with values:', expect.anything());
    consoleSpy.mockRestore();
  });
});
